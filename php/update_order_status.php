<?php
require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$orderId = (int) ($input['order_id'] ?? 0);
$status = $input['status'] ?? '';

$validStatuses = ['Pending', 'Preparing', 'Ready', 'Completed'];
if (!$orderId || !in_array($status, $validStatuses, true)) {
    echo json_encode(['success' => false, 'error' => 'Invalid input.']);
    exit();
}

$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $orderId);
$stmt->execute();
$stmt->close();

echo json_encode(['success' => true]);
?>