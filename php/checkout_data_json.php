<?php
session_start();
require __DIR__ . '/db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
    echo json_encode(['loggedIn' => isset($_SESSION['user_id']), 'items' => [], 'subtotal' => 0, 'service_charge' => 0, 'total' => 0]);
    exit();
}

$cart = $_SESSION['cart'];
$subtotal = 0;
foreach ($cart as $item) {
    $subtotal += $item['price'] * $item['quantity'];
}
$serviceCharge = 10;
$total = $subtotal + $serviceCharge;

echo json_encode([
    'loggedIn' => isset($_SESSION['user_id']),
    'items' => $cart,
    'subtotal' => $subtotal,
    'service_charge' => $serviceCharge,
    'total' => $total
]);
?>