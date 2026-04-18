<?php
require_once "config.php";

try {
    $stmt = $pdo->query("SELECT id, nev, kategoria FROM szoftver ORDER BY nev ASC");

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Hiba a szoftverek lekérdezésénél: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
