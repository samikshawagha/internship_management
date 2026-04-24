<?php
require_once 'includes/header.php';
// generator accepts POST with template_id, student_name, optional remarks
if (!isset($_POST['template_id']) || !isset($_POST['student_name'])) {
    header('Location: internship_php/student/certificates.php'); exit;
}

$template_id = (int)$_POST['template_id'];
$student_name = $mysqli->real_escape_string($_POST['student_name']);
$remarks = $mysqli->real_escape_string($_POST['remarks'] ?? '');

$tpl = $mysqli->query("SELECT * FROM event_certificates WHERE id=$template_id")->fetch_assoc();
if (!$tpl) { header('Location: internship_php/student/certificates.php'); exit; }

$title = $tpl['title'];
$issuer = $tpl['issuer'] ?: 'Organizer';
$date = $tpl['event_date'] ? date('F j, Y', strtotime($tpl['event_date'])) : date('F j, Y');
$template_html = $tpl['template_html'] ?: '<div style="padding:40px;text-align:center;">%TITLE% - %STUDENT_NAME%</div>';

$html = str_replace(['%STUDENT_NAME%','%TITLE%','%ISSUER%','%DATE%'], [htmlspecialchars($student_name), htmlspecialchars($title), htmlspecialchars($issuer), htmlspecialchars($date)], $template_html);

// Ensure uploads folder
$uploadDir = __DIR__ . '/uploads/certificates/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$filename = 'event_' . $template_id . '_' . preg_replace('/[^a-z0-9_\-]/i','_',strtolower($student_name)) . '_' . time() . '.html';
$fullpath = $uploadDir . $filename;
file_put_contents($fullpath, "<!doctype html><html><head><meta charset=\"utf-8\"><title>Certificate</title></head><body>$html</body></html>");

$file_path_db = '/internship_php/uploads/certificates/' . $filename;

// Insert into certificates table
$student_id = $_SESSION['student']['id'] ?? 0;
$cert_no = 'EVT-' . strtoupper(bin2hex(random_bytes(3)));
$mysqli->query("INSERT INTO certificates (student_id, internship_id, certificate_number, issued_date, grade, remarks, file_path)
    VALUES ($student_id, NULL, '$cert_no', NOW(), 'Participation', '$remarks', '$file_path_db')");

// Redirect to student certificates page
header('Location: internship_php/student/certificates.php?uploaded=1');
exit;
