<?php
require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$todayOrders = $conn->query("SELECT COUNT(*) AS c FROM orders WHERE DATE(created_at) = CURDATE()")->fetch_assoc()['c'];
$pendingOrders = $conn->query("SELECT COUNT(*) AS c FROM orders WHERE status = 'Pending'")->fetch_assoc()['c'];
$menuItemsCount = $conn->query("SELECT COUNT(*) AS c FROM menu_items")->fetch_assoc()['c'];
$soldOutCount = $conn->query("SELECT COUNT(*) AS c FROM menu_items WHERE is_available = 0")->fetch_assoc()['c'];

$recentOrdersResult = $conn->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");
$recentOrders = [];
while ($order = $recentOrdersResult->fetch_assoc()) {
    $itemsRes = $conn->query("SELECT item_name, quantity FROM order_items WHERE order_id = " . (int)$order['id']);
    $lines = [];
    while ($oi = $itemsRes->fetch_assoc()) {
        $lines[] = $oi['item_name'] . " x" . $oi['quantity'];
    }
    $order['items_summary'] = implode(', ', $lines);
    $recentOrders[] = $order;
}

echo json_encode([
    'today_orders' => $todayOrders,
    'pending_orders' => $pendingOrders,
    'menu_items_count' => $menuItemsCount,
    'sold_out_count' => $soldOutCount,
    'recent_orders' => $recentOrders
]);
?>