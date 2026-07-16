<?php
session_start();
require __DIR__ . '/db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Please log in first.']);
    exit();
}

if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
    echo json_encode(['success' => false, 'error' => 'Your cart is empty.']);
    exit();
}

$userId = $_SESSION['user_id'];
$cart = $_SESSION['cart'];

$studentName = trim($_POST['student_name'] ?? '');
$studentId = trim($_POST['student_id'] ?? '');
$pickupTime = $_POST['pickup_time'] ?? '';
$payment = $_POST['payment'] ?? '';
$notes = trim($_POST['notes'] ?? '');

$subtotal = 0;
foreach ($cart as $item) {
    $subtotal += $item['price'] * $item['quantity'];
}
$serviceCharge = 10;
$total = $subtotal + $serviceCharge;

$stmt = $conn->prepare("INSERT INTO orders (user_id, student_name, student_id, pickup_time, payment_method, notes, subtotal, service_charge, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')");
$stmt->bind_param("isssssddd", $userId, $studentName, $studentId, $pickupTime, $payment, $notes, $subtotal, $serviceCharge, $total);
$stmt->execute();
$orderId = $stmt->insert_id;
$stmt->close();

$itemStmt = $conn->prepare("INSERT INTO order_items (order_id, item_id, item_name, price, quantity) VALUES (?, ?, ?, ?, ?)");
foreach ($cart as $itemId => $item) {
    $itemStmt->bind_param("iisdi", $orderId, $itemId, $item['name'], $item['price'], $item['quantity']);
    $itemStmt->execute();
}
$itemStmt->close();

$_SESSION['cart'] = [];

echo json_encode(['success' => true, 'order_id' => $orderId]);
?>