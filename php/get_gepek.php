<?php
require_once "config.php";

try {
    $stmt = $pdo->query("SELECT id, hely, tipus, ipcim FROM gep ORDER BY hely ASC");

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Hiba a gépek lekérdezésénél: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>