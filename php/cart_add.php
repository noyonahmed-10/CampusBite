<?php
session_start();
require __DIR__ . '/db.php';
header('Content-Type: application/json');

$itemId = (int) ($_POST['item_id'] ?? 0);

if (!$itemId) {
    echo json_encode(['success' => false, 'message' => 'Invalid item.']);
    exit();
}

// Look up the item in the database
$stmt = $conn->prepare("SELECT id, name, price, is_available FROM menu_items WHERE id = ?");
$stmt->bind_param("i", $itemId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Item not found.']);
    exit();
}

$item = $result->fetch_assoc();

if (!$item['is_available']) {
    echo json_encode(['success' => false, 'message' => 'Item is sold out.']);
    exit();
}

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

if (isset($_SESSION['cart'][$itemId])) {
    $_SESSION['cart'][$itemId]['quantity']++;
} else {
    $_SESSION['cart'][$itemId] = [
        'name' => $item['name'],
        'price' => $item['price'],
        'quantity' => 1
    ];
}

echo json_encode(['success' => true]);
?>