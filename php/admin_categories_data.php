<?php
require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$categories = $conn->query("
    SELECT categories.*, COUNT(menu_items.id) AS item_count
    FROM categories
    LEFT JOIN menu_items ON menu_items.category_id = categories.id
    GROUP BY categories.id
    ORDER BY categories.name ASC
");

$result = [];
while ($cat = $categories->fetch_assoc()) {
    $result[] = $cat;
}

echo json_encode($result);
?>