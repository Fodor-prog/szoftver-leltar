<?php
require_once "config.php";

try {
    $sql = "
        SELECT
            t.id,
            t.gepid,
            t.szoftverid,
            t.verzio,
            t.datum,
            g.hely,
            g.tipus,
            g.ipcim,
            s.nev AS szoftver_nev,
            s.kategoria
        FROM telepites t
        INNER JOIN gep g ON t.gepid = g.id
        INNER JOIN szoftver s ON t.szoftverid = s.id
        ORDER BY t.id DESC
    ";

    $stmt = $pdo->query($sql);

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Hiba a telepítések lekérdezésénél: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>