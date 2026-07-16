<?php
session_start();
require __DIR__ . '/db.php';
header('Content-Type: application/json');

$sql = "SELECT menu_items.*, categories.name AS category_name 
        FROM menu_items 
        JOIN categories ON menu_items.category_id = categories.id 
        ORDER BY menu_items.id ASC";
$result = $conn->query($sql);

$items = [];
while ($item = $result->fetch_assoc()) {
    $items[] = $item;
}

echo json_encode($items);
?>