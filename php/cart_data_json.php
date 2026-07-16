<?php
session_start();
require __DIR__ . '/db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$cart = $_SESSION['cart'];
$subtotal = 0;
foreach ($cart as $item) {
    $subtotal += $item['price'] * $item['quantity'];
}
$serviceCharge = 10;
$total = $cart ? $subtotal + $serviceCharge : 0;

echo json_encode([
    'items' => $cart,
    'subtotal' => $subtotal,
    'service_charge' => $serviceCharge,
    'total' => $total
]);
?>