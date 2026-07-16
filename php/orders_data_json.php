<?php
session_start();
require __DIR__ . '/db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['loggedIn' => false, 'orders' => []]);
    exit();
}

$userId = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC");
$stmt->bind_param("i", $userId);
$stmt->execute();
$ordersResult = $stmt->get_result();

$orders = [];
while ($order = $ordersResult->fetch_assoc()) {
    $itemStmt = $conn->prepare("SELECT * FROM order_items WHERE order_id=?");
    $itemStmt->bind_param("i", $order['id']);
    $itemStmt->execute();
    $itemsResult = $itemStmt->get_result();

    $items = [];
    while ($item = $itemsResult->fetch_assoc()) {
        $items[] = $item;
    }
    $itemStmt->close();

    $order['items'] = $items;
    $orders[] = $order;
}
$stmt->close();

echo json_encode(['loggedIn' => true, 'orders' => $orders]);
?>