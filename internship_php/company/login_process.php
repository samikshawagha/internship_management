<?php
require_once '../includes/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $mysqli->real_escape_string($_POST['email']);
    $password = $mysqli->real_escape_string($_POST['password']);

    $query = "SELECT * FROM companies WHERE email='$email' LIMIT 1";
    $result = $mysqli->query($query);
    if ($result && $result->num_rows === 1) {
        $company = $result->fetch_assoc();
        if (password_verify($password, $company['password']) && $company['status'] == 1) {
            $_SESSION['company'] = $company;
            header('Location: dashboard.php');
            exit;
        } elseif ($company['status'] != 1) {
            $_SESSION['error'] = 'Your company account is not approved yet';
        } else {
            $_SESSION['error'] = 'Invalid password';
        }
    } else {
        $_SESSION['error'] = 'Email not found';
    }
    header('Location: login.php');
    exit;
}
?>