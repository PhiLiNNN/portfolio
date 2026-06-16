<?php

// Copy this file to "mail-config.php" (same folder, on the server) and fill in
// the real mailbox password. mail-config.php is git-ignored and must NOT be
// committed. sendMail.php reads these values to send over authenticated SMTP.
//
// Hostinger Email settings (mailbox hosted on mx1/mx2.hostinger.com):
//   host: smtp.hostinger.com
//   port: 465 (SSL)  -> set 'secure' => 'ssl'
//         or 587 (STARTTLS) -> set 'secure' => 'tls'
//   user/pass: the full email address + its mailbox password
//
// "from" MUST equal the authenticated mailbox so SPF/DKIM align (-> inbox).
// "to" is where the contact form messages are delivered.

return [
    'host'   => 'smtp.hostinger.com',
    'port'   => 465,
    'secure' => 'ssl',
    'user'   => 'contact@philipp-wendschuch.dev',
    'pass'   => 'PUT-MAILBOX-PASSWORD-HERE',
    'from'   => 'contact@philipp-wendschuch.dev',
    'to'     => 'contact@philipp-wendschuch.dev',
];
