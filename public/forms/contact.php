<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

function respond(int $status, bool $success, string $message): void
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Method not allowed.');
}

$recipient = getenv('NEXUS_CONTACT_RECIPIENT') ?: '';
$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    respond(500, false, 'Contact recipient is not configured.');
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Please provide a name, valid email, and message.');
}

if (mb_strlen($name) > 120 || mb_strlen($message) > 5000) {
    respond(422, false, 'Your message is too long.');
}

$safeName = str_replace(["\r", "\n"], ' ', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$body = "Name: {$safeName}\nEmail: {$safeEmail}\n\nMessage:\n{$message}";
$headers = [
    'Content-Type: text/plain; charset=UTF-8',
    "Reply-To: {$safeEmail}",
];

if (!mail($recipient, 'New Nexus landing contact message', $body, implode("\r\n", $headers))) {
    respond(500, false, 'Unable to send the message. Please try again later.');
}

respond(200, true, 'Thanks. Your message has been sent.');
