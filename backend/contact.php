<?php
// Basic PHP mail handler. Configure the recipient and deploy over HTTPS before use.
// For production, prefer an authenticated transactional email provider (SMTP/API), add rate limiting,
// server-side logging/monitoring, and a privacy notice appropriate to your jurisdiction.
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['message'=>'Method not allowed.']); exit; }
// Honeypot field for simple bot filtering.
if (!empty($_POST['website_url'] ?? '')) { echo json_encode(['message'=>'Thank you. Your enquiry has been received.']); exit; }
$recipient = 'REPLACE_WITH_ADMIN_EMAIL@example.com'; // REQUIRED: change to the admin inbox
$name = trim((string)($_POST['name'] ?? ''));
$country = trim((string)($_POST['country'] ?? ''));
$email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$phone = trim((string)($_POST['phone'] ?? ''));
$treatment = trim((string)($_POST['treatment'] ?? ''));
$hospital = trim((string)($_POST['hospital'] ?? 'Not sure'));
$message = trim((string)($_POST['message'] ?? ''));
$assistance = trim((string)($_POST['assistance'] ?? ''));
$consent = (string)($_POST['consent'] ?? '') === 'yes';
if (!$name || !$country || !$email || !$phone || !$treatment || !$message || !$consent) { http_response_code(422); echo json_encode(['message'=>'Please complete all required fields and consent.']); exit; }
if ($recipient === 'REPLACE_WITH_ADMIN_EMAIL@example.com') { http_response_code(500); echo json_encode(['message'=>'The website administrator has not configured the recipient email yet.']); exit; }
$clean = static function(string $s): string { return str_replace(["\r", "\n"], ' ', $s); };
$subject = 'New medical tourism enquiry - ' . $clean($name);
$body = "New enquiry received from Himalaya Tulsi Healthcare website\n\n" .
        "Name: {$clean($name)}\nCountry: {$clean($country)}\nEmail: {$email}\nPhone: {$clean($phone)}\n" .
        "Treatment: {$clean($treatment)}\nPreferred hospital: {$clean($hospital)}\nAssistance: {$clean($assistance)}\n\n" .
        "Message:\n" . $message . "\n\nConsent: Yes\n";
// Use a domain mailbox as From; do not use the visitor's email in the From header.
$headers = "From: website@" . ($_SERVER['HTTP_HOST'] ?? 'yourdomain.com') . "\r\n" . "Reply-To: {$email}\r\n" . "Content-Type: text/plain; charset=UTF-8\r\n";
if (mail($recipient, $subject, $body, $headers)) { echo json_encode(['message'=>'Thank you. Your enquiry has been sent. Our team will contact you.']); }
else { http_response_code(500); echo json_encode(['message'=>'Email delivery failed. Please try again later or contact us directly.']); }
?>
