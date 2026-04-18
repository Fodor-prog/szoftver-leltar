<?php
require_once "config.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data["id"]) ? trim((string)$data["id"]) : "";

if ($id === "") {
    echo json_encode([
        "success" => false,
        "message" => "Hiányzó azonosító."
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM telepites WHERE id = :id");
    $stmt->execute([
        ":id" => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Telepítés törölve."
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Törlési hiba: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>