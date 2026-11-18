<?php

// Contact form mail handler.
//
//   GET  ?challenge=1   -> issues a proof-of-work challenge (ALTCHA-compatible)
//   POST JSON {name, email, message, website?, altcha?}
//                       -> verifies honeypot + proof of work + timing, then
//                          sends the mail via authenticated SMTP.
//
// Bot protection, all self-hosted, no third party:
//   1. Honeypot: hidden field "website"; bots fill it -> silent 204.
//   2. Proof of work: the browser must solve a SHA-256 puzzle issued here.
//      Cheap for one visitor, expensive for mass submission; needs JS.
//   3. Timing: the challenge carries its issue time; submits faster than
//      MIN_SECONDS after issue are rejected. Challenges expire after TTL.
//   4. Replay: each solved challenge is accepted once (marker file in tmp).
//
// Credentials live in mail-config.php (NOT in git). Create it on the server
// next to this file, based on mail-config.example.php.

const POW_MAX_NUMBER = 60000;   // search space; ~0.3–1 s in a browser
const POW_TTL        = 600;     // seconds a challenge stays valid
const POW_MIN_SECONDS = 3;      // fastest plausible human submit after load

// Reflect the request origin if it's the production site or a localhost dev
// origin (any port), so the browser lets the SPA read the response.
$allowedOrigins = ['https://philipp-wendschuch.dev'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isLocalhostDev = (bool) preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin);
if (in_array($origin, $allowedOrigins, true) || $isLocalhostDev) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: content-type');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function fail(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

$config = @include __DIR__ . '/mail-config.php';
if (!is_array($config) || empty($config['host']) || empty($config['user'])) {
    fail(500, 'Mail not configured');
}

// HMAC key for challenges: explicit 'pow_secret' or derived from the mailbox
// password so an unconfigured install still works.
$powSecret = (string) ($config['pow_secret'] ?? hash('sha256', 'pow|' . ($config['pass'] ?? '') . '|' . $config['user']));

// --- Proof of work ----------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['challenge'])) {
        fail(404, 'Not found');
    }
    $salt      = time() . '.' . bin2hex(random_bytes(8));
    $number    = random_int(0, POW_MAX_NUMBER);
    $challenge = hash('sha256', $salt . $number);
    $signature = hash_hmac('sha256', $challenge, $powSecret);
    echo json_encode([
        'algorithm' => 'SHA-256',
        'challenge' => $challenge,
        'salt'      => $salt,
        'maxnumber' => POW_MAX_NUMBER,
        'signature' => $signature,
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST, OPTIONS');
    http_response_code(405);
    exit;
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

/** Verify the solved challenge; returns null on success or an error string. */
function verifyPow($sol, string $secret): ?string {
    if (!is_object($sol)) {
        return 'missing';
    }
    $salt      = (string) ($sol->salt ?? '');
    $challenge = (string) ($sol->challenge ?? '');
    $signature = (string) ($sol->signature ?? '');
    $number    = $sol->number ?? null;

    if (!preg_match('/^(\d{9,11})\.[0-9a-f]{16}$/', $salt, $m)) {
        return 'bad salt';
    }
    $issued = (int) $m[1];
    $age    = time() - $issued;
    if ($age > POW_TTL) {
        return 'expired';
    }
    if ($age < POW_MIN_SECONDS) {
        return 'too fast';
    }
    if (!is_int($number) && !(is_float($number) && floor($number) == $number)) {
        return 'bad number';
    }
    $number = (int) $number;
    if ($number < 0 || $number > POW_MAX_NUMBER) {
        return 'bad number';
    }
    if (!hash_equals(hash_hmac('sha256', $challenge, $secret), $signature)) {
        return 'bad signature';
    }
    if (!hash_equals($challenge, hash('sha256', $salt . $number))) {
        return 'wrong solution';
    }
    // One-time use: remember solved challenges until they expire anyway.
    $dir = sys_get_temp_dir() . '/pw-pow';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $marker = $dir . '/' . hash('sha256', $challenge);
    if (file_exists($marker)) {
        return 'replay';
    }
    @file_put_contents($marker, '1');
    // Occasional cleanup of old markers.
    if (random_int(0, 20) === 0) {
        foreach (glob($dir . '/*') ?: [] as $f) {
            if (@filemtime($f) < time() - POW_TTL) {
                @unlink($f);
            }
        }
    }
    return null;
}

$powError = verifyPow($params->altcha ?? null, $powSecret);
if ($powError !== null) {
    fail(422, 'Challenge failed: ' . $powError);
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
