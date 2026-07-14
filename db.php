<?php
// ============================
// DATABASE CONNECTION
// Used by every PHP page that needs DB access
// ============================

$host = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbName = "campusbite_db";

$conn = new mysqli($host, $dbUsername, $dbPassword, $dbName);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>