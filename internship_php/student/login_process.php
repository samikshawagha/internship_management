<?php
require_once '../includes/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $mysqli->real_escape_string($_POST['email']);
    $password = $mysqli->real_escape_string($_POST['password']);

    $query = "SELECT * FROM students WHERE email='$email' LIMIT 1";
    $result = $mysqli->query($query);
    if ($result && $result->num_rows === 1) {
        $student = $result->fetch_assoc();
        if (password_verify($password, $student['password'])) {
            $_SESSION['student'] = $student;
            header('Location: dashboard.php');
            exit;
        }
    }
    $_SESSION['error'] = 'Invalid email or password';
    header('Location: login.php');
    exit;
}
?>