<?php
// Database configuration
$host = 'localhost';
$db   = 'internship_management';
$user = 'root';
$pass = '';

$mysqli = new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_error) {
    die('Connection error: ' . $mysqli->connect_error);
}
?>