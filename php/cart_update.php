<?php
session_start();
require __DIR__ . '/db.php';
header('Content-Type: application/json');

$itemId = (int) ($_POST['item_id'] ?? 0);
$action = $_POST['action'] ?? '';

if (!$itemId || !isset($_SESSION['cart'][$itemId])) {
    echo json_encode(['success' => false, 'message' => 'Item not in cart.']);
    exit();
}

if ($action === 'increase') {
    $_SESSION['cart'][$itemId]['quantity']++;
} elseif ($action === 'decrease') {
    $_SESSION['cart'][$itemId]['quantity']--;
    if ($_SESSION['cart'][$itemId]['quantity'] <= 0) {
        unset($_SESSION['cart'][$itemId]);
    }
} elseif ($action === 'remove') {
    unset($_SESSION['cart'][$itemId]);
}

echo json_encode(['success' => true]);
?>