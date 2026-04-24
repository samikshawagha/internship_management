<?php
require_once '../includes/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $mysqli->real_escape_string($_POST['name']);
    $email = $mysqli->real_escape_string($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password !== $confirm_password) {
        $_SESSION['error'] = 'Passwords do not match';
        header('Location: register.php');
        exit;
    }

    // Check if email already exists
    $check = $mysqli->query("SELECT id FROM students WHERE email='$email'");
    if ($check->num_rows > 0) {
        $_SESSION['error'] = 'Email already registered';
        header('Location: register.php');
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $mysqli->query("INSERT INTO students (name, email, password) VALUES ('$name', '$email', '$hashed_password')");
    
    // Auto-login
    $student = $mysqli->query("SELECT * FROM students WHERE email='$email'")->fetch_assoc();
    $_SESSION['student'] = $student;
    header('Location: dashboard.php');
    exit;
}
?>