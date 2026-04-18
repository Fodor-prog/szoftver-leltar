<?php
require_once "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data["id"]) ? trim((string)$data["id"]) : "";
$gepid = isset($data["gepid"]) ? trim((string)$data["gepid"]) : "";
$szoftverid = isset($data["szoftverid"]) ? trim((string)$data["szoftverid"]) : "";
$verzio = isset($data["verzio"]) ? trim((string)$data["verzio"]) : "";
$datum = isset($data["datum"]) ? trim((string)$data["datum"]) : "";

if ($gepid === "" || $szoftverid === "") {
    echo json_encode([
        "success" => false,
        "message" => "A gép és a szoftver kiválasztása kötelező."
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    if ($id === "") {
        $stmt = $pdo->prepare("
            INSERT INTO telepites (gepid, szoftverid, verzio, datum)
            VALUES (:gepid, :szoftverid, :verzio, :datum)
        ");

        $stmt->execute([
            ":gepid" => $gepid,
            ":szoftverid" => $szoftverid,
            ":verzio" => $verzio !== "" ? $verzio : null,
            ":datum" => $datum !== "" ? $datum : null
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Új telepítés sikeresen mentve."
        ], JSON_UNESCAPED_UNICODE);

    } else {
        $stmt = $pdo->prepare("
            UPDATE telepites
            SET gepid = :gepid,
                szoftverid = :szoftverid,
                verzio = :verzio,
                datum = :datum
            WHERE id = :id
        ");

        $stmt->execute([
            ":id" => $id,
            ":gepid" => $gepid,
            ":szoftverid" => $szoftverid,
            ":verzio" => $verzio !== "" ? $verzio : null,
            ":datum" => $datum !== "" ? $datum : null
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Telepítés sikeresen módosítva."
        ], JSON_UNESCAPED_UNICODE);
    }

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Mentési hiba: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>