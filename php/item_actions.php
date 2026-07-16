<?php
require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if ($action === 'delete') {
    $id = (int) ($input['id'] ?? 0);
    if (!$id) { echo json_encode(['success' => false, 'error' => 'Invalid ID.']); exit(); }

    $stmt = $conn->prepare("DELETE FROM menu_items WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true]);
    exit();
}

if ($action === 'save') {
    $id = (int) ($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');
    $price = (float) ($input['price'] ?? 0);
    $categoryId = (int) ($input['category_id'] ?? 0);
    $image = trim($input['image'] ?? '') ?: 'placeholder-food.jpg';
    $isAvailable = !empty($input['is_available']) ? 1 : 0;

    if (!$name || !$categoryId || $price <= 0) {
        echo json_encode(['success' => false, 'error' => 'Please fill in all required fields.']);
        exit();
    }

    if ($id) {
        $stmt = $conn->prepare("UPDATE menu_items SET name=?, description=?, price=?, category_id=?, image=?, is_available=? WHERE id=?");
        $stmt->bind_param("ssdisii", $name, $description, $price, $categoryId, $image, $isAvailable, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO menu_items (name, description, price, category_id, image, is_available) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdisi", $name, $description, $price, $categoryId, $image, $isAvailable);
    }
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true]);
    exit();
}

echo json_encode(['success' => false, 'error' => 'Unknown action.']);
?>