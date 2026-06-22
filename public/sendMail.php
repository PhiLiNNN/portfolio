<?php

// Contact form mail handler.
// Receives JSON { name, email, message, website? } from the Angular contact
// form and sends it via authenticated SMTP (so SPF/DKIM pass -> inbox, not spam).
// No data is stored.
//
// Credentials live in mail-config.php (NOT in git). Create it on the server
// next to this file, based on mail-config.example.php.

// Reflect the request origin if it's the production site or a localhost dev
// origin (any port), so the browser lets the SPA read the response. Other
// origins get no CORS header -> their JS can't read it (the form still works
// only from the allowed origins).
$allowedOrigins = ['https://philipp-wendschuch.dev'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isLocalhostDev = (bool) preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin);
if (in_array($origin, $allowedOrigins, true) || $isLocalhostDev) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: content-type');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST, OPTIONS');
    http_response_code(405);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

function fail(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

$config = @include __DIR__ . '/mail-config.php';
if (!is_array($config) || empty($config['host']) || empty($config['user'])) {
    fail(500, 'Mail not configured');
}

$params = json_decode(file_get_contents('php://input'));
if (!is_object($params)) {
    fail(400, 'Invalid payload');
}

// Honeypot: bots fill hidden fields. Pretend success, send nothing.
if (!empty($params->website)) {
    http_response_code(204);
    exit;
}

$name    = trim((string) ($params->name ?? ''));
$message = trim((string) ($params->message ?? ''));
$email   = filter_var((string) ($params->email ?? ''), FILTER_VALIDATE_EMAIL);

if ($name === '' || strlen($name) > 100
    || $email === false
    || strlen($message) < 10 || strlen($message) > 5000) {
    fail(422, 'Validation failed');
}

// Strip CR/LF from anything that ends up in a header (anti header-injection).
$clean = static fn (string $v): string => str_replace(["\r", "\n"], '', $v);

$from    = $config['from'] ?? $config['user'];
$to      = $config['to'] ?? $config['user'];
$subject = 'Contact from ' . $clean($name);
$body    = "Name: {$name}\r\nEmail: {$email}\r\n\r\n{$message}";

$headers =
    'From: ' . $clean($from) . "\r\n" .
    'Reply-To: ' . $clean($email) . "\r\n" .
    'MIME-Version: 1.0' . "\r\n" .
    'Content-Type: text/plain; charset=utf-8' . "\r\n" .
    'Subject: ' . $clean($subject) . "\r\n" .
    'To: ' . $clean($to) . "\r\n";

// --- Minimal SMTP client (AUTH LOGIN over implicit TLS or STARTTLS) ---------
function smtpRead($conn): string {
    $data = '';
    while (($line = fgets($conn, 515)) !== false) {
        $data .= $line;
        // Final line of a reply has a space at index 3 ("250 "); "-" continues.
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function smtpCmd($conn, string $cmd, string $expect): bool {
    fwrite($conn, $cmd . "\r\n");
    return strncmp(smtpRead($conn), $expect, strlen($expect)) === 0;
}

$host = $config['host'];
$port = (int) ($config['port'] ?? 465);
$secure = $config['secure'] ?? ($port === 465 ? 'ssl' : 'tls');

$remote = ($secure === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
$conn = @stream_socket_client($remote, $errno, $errstr, 20, STREAM_CLIENT_CONNECT);
if (!$conn) {
    fail(502, 'SMTP connect failed');
}
stream_set_timeout($conn, 20);

$ok = strncmp(smtpRead($conn), '220', 3) === 0; // server greeting
$ok = $ok && smtpCmd($conn, 'EHLO ' . $host, '250');

if ($secure === 'tls') {
    $ok = $ok && smtpCmd($conn, 'STARTTLS', '220');
    $ok = $ok && stream_socket_enable_crypto($conn, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
    $ok = $ok && smtpCmd($conn, 'EHLO ' . $host, '250');
}

$ok = $ok && smtpCmd($conn, 'AUTH LOGIN', '334');
$ok = $ok && smtpCmd($conn, base64_encode($config['user']), '334');
$ok = $ok && smtpCmd($conn, base64_encode($config['pass'] ?? ''), '235');
$ok = $ok && smtpCmd($conn, 'MAIL FROM:<' . $clean($from) . '>', '250');
$ok = $ok && smtpCmd($conn, 'RCPT TO:<' . $clean($to) . '>', '250');
$ok = $ok && smtpCmd($conn, 'DATA', '354');

if ($ok) {
    // Dot-stuff lines beginning with "." per RFC 5321.
    $payload = preg_replace('/^\./m', '..', $headers . "\r\n" . $body);
    fwrite($conn, $payload . "\r\n.\r\n");
    $ok = strncmp(smtpRead($conn), '250', 3) === 0;
}

@fwrite($conn, "QUIT\r\n");
fclose($conn);

if (!$ok) {
    fail(502, 'SMTP send failed');
}

http_response_code(200);
echo json_encode(['ok' => true]);
