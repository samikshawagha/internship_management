<?php
require_once '../includes/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $mysqli->real_escape_string($_POST['name']);
    $email = $mysqli->real_escape_string($_POST['email']);
    $phone = $mysqli->real_escape_string($_POST['phone']);
    $address = $mysqli->real_escape_string($_POST['address']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password !== $confirm_password) {
        $_SESSION['error'] = 'Passwords do not match';
        header('Location: register.php');
        exit;
    }

    // Check if email already exists
    $check = $mysqli->query("SELECT id FROM companies WHERE email='$email'");
    if ($check->num_rows > 0) {
        $_SESSION['error'] = 'Email already registered';
        header('Location: register.php');
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $mysqli->query("INSERT INTO companies (name, email, phone, address, password, status) VALUES ('$name', '$email', '$phone', '$address', '$hashed_password', 0)");
    
    $_SESSION['message'] = 'Registration successful! Your account will be activated after admin approval. Please wait.';
    header('Location: login.php');
    exit;
}
?>