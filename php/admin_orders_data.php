<?php
require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$orders = $conn->query("SELECT * FROM orders ORDER BY created_at DESC");

$result = [];
while ($order = $orders->fetch_assoc()) {
    $itemsRes = $conn->query("SELECT item_name, quantity FROM order_items WHERE order_id = " . (int)$order['id']);
    $lines = [];
    while ($oi = $itemsRes->fetch_assoc()) {
        $lines[] = $oi['item_name'] . " x" . $oi['quantity'];
    }
    $order['items_summary'] = implode(', ', $lines);
    $result[] = $order;
}

echo json_encode($result);
?>