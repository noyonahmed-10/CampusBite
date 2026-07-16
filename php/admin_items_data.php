<?php
require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$items = $conn->query("SELECT menu_items.*, categories.name AS category_name FROM menu_items JOIN categories ON menu_items.category_id = categories.id ORDER BY menu_items.id DESC");
$categories = $conn->query("SELECT * FROM categories ORDER BY name ASC");

$itemsArr = [];
while ($item = $items->fetch_assoc()) {
    $itemsArr[] = $item;
}

$catsArr = [];
while ($cat = $categories->fetch_assoc()) {
    $catsArr[] = $cat;
}

echo json_encode(['items' => $itemsArr, 'categories' => $catsArr]);
?>