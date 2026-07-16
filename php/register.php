<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$fullName = trim($_POST['full_name'] ?? '');
$studentId = trim($_POST['student_id'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';

if (empty($fullName) || empty($studentId) || empty($email) || empty($password) || empty($confirmPassword)) {
    echo json_encode(['success' => false, 'error' => 'Please fill in all fields.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email address.']);
    exit();
}

if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'error' => 'Passwords do not match.']);
    exit();
}

$check = $conn->prepare("SELECT id FROM users WHERE email=?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'An account with this email already exists.']);
    $check->close();
    exit();
}
$check->close();

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$role = "student";

$insert = $conn->prepare("INSERT INTO users (full_name, student_id, email, password, role) VALUES (?, ?, ?, ?, ?)");
$insert->bind_param("sssss", $fullName, $studentId, $email, $hashedPassword, $role);

if ($insert->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Registration failed.']);
}
$insert->close();
?>