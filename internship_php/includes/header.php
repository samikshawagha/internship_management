<?php
// start session and include database
session_start();
require_once __DIR__ . '/db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Management</title>
    <link rel="stylesheet" href="/internship_php/assets/css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="/internship_php/index.php">InternshipSys</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNav" aria-controls="topNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="topNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <?php if (isset($_SESSION['admin'])): ?>
                    <li class="nav-item"><a class="nav-link" href="/internship_php/admin/dashboard.php">Admin Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="/internship_php/admin/logout.php">Logout</a></li>
                <?php elseif (isset($_SESSION['student'])): ?>
                    <li class="nav-item"><a class="nav-link" href="/internship_php/student/dashboard.php">Student Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="/internship_php/student/logout.php">Logout</a></li>
                <?php elseif (isset($_SESSION['company'])): ?>
                    <li class="nav-item"><a class="nav-link" href="/internship_php/company/dashboard.php">Company Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="/internship_php/company/logout.php">Logout</a></li>
                <?php else: ?>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="loginDropdown" role="button" data-bs-toggle="dropdown">Login</a>
                        <ul class="dropdown-menu" aria-labelledby="loginDropdown">
                            <li><a class="dropdown-item" href="/internship_php/admin/login.php">Admin</a></li>
                            <li><a class="dropdown-item" href="/internship_php/student/login.php">Student</a></li>
                            <li><a class="dropdown-item" href="/internship_php/company/login.php">Company</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="registerDropdown" role="button" data-bs-toggle="dropdown">Register</a>
                        <ul class="dropdown-menu" aria-labelledby="registerDropdown">
                            <li><a class="dropdown-item" href="/internship_php/student/register.php">Student</a></li>
                            <li><a class="dropdown-item" href="/internship_php/company/register.php">Company</a></li>
                        </ul>
                    </li>
                <?php endif; ?>
            </ul>
        </div>
    </div>
</nav>