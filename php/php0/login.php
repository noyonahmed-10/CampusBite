<?php
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$login = trim($_POST['login'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($login) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Please enter your email/student ID and password.']);
    exit();
}

$stmt = $conn->prepare("SELECT id, full_name, student_id, email, password, role FROM users WHERE email=? OR student_id=?");
$stmt->bind_param("ss", $login, $login);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['full_name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['role'] = $user['role'];

        echo json_encode([
            'success' => true,
            'role' => $user['role'],
            'name' => $user['full_name']
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Incorrect password.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No account found with this Email or Student ID.']);
}

$stmt->close();
?>