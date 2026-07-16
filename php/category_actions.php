<?php
require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if ($action === 'delete') {
    $id = (int) ($input['id'] ?? 0);
    if (!$id) { echo json_encode(['success' => false, 'error' => 'Invalid ID.']); exit(); }

    $check = $conn->prepare("SELECT COUNT(*) AS c FROM menu_items WHERE category_id = ?");
    $check->bind_param("i", $id);
    $check->execute();
    $count = $check->get_result()->fetch_assoc()['c'];
    $check->close();

    if ($count > 0) {
        echo json_encode(['success' => false, 'error' => 'Cannot delete: category still has menu items.']);
        exit();
    }

    $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true]);
    exit();
}

if ($action === 'save') {
    $id = (int) ($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');

    if (!$name) {
        echo json_encode(['success' => false, 'error' => 'Category name is required.']);
        exit();
    }

    if ($id) {
        $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ?");
        $stmt->bind_param("si", $name, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
        $stmt->bind_param("s", $name);
    }
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true]);
    exit();
}

echo json_encode(['success' => false, 'error' => 'Unknown action.']);
?>