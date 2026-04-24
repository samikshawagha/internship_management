<?php
require_once '../includes/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $mysqli->real_escape_string($_POST['email']);
    $password = $mysqli->real_escape_string($_POST['password']);

    $query = "SELECT * FROM admins WHERE email='$email' LIMIT 1";
    $result = $mysqli->query($query);
    if ($result && $result->num_rows === 1) {
        $admin = $result->fetch_assoc();
        if (password_verify($password, $admin['password'])) {
            $_SESSION['admin'] = $admin;
            header('Location: dashboard.php');
            exit;
        }
    }
    $_SESSION['error'] = 'Invalid credentials';
    header('Location: login.php');
    exit;
}
?>