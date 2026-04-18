<?php
require_once "config.php";

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {

        case 'GET':
            $stmt = $pdo->query("SELECT * FROM telepites ORDER BY id DESC");
            echo json_encode($stmt->fetchAll(), JSON_UNESCAPED_UNICODE);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $pdo->prepare("
                INSERT INTO telepites (gepid, szoftverid, verzio, datum)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['gepid'],
                $data['szoftverid'],
                $data['verzio'] !== '' ? $data['verzio'] : null,
                $data['datum'] !== '' ? $data['datum'] : null
            ]);

            echo json_encode([
                "success" => true,
                "message" => "Sikeres hozzáadás."
            ], JSON_UNESCAPED_UNICODE);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $pdo->prepare("
                UPDATE telepites
                SET gepid = ?, szoftverid = ?, verzio = ?, datum = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['gepid'],
                $data['szoftverid'],
                $data['verzio'] !== '' ? $data['verzio'] : null,
                $data['datum'] !== '' ? $data['datum'] : null,
                $data['id']
            ]);

            echo json_encode([
                "success" => true,
                "message" => "Sikeres módosítás."
            ], JSON_UNESCAPED_UNICODE);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;

            if (!$id) {
                echo json_encode([
                    "success" => false,
                    "message" => "Hiányzó azonosító."
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }

            $stmt = $pdo->prepare("DELETE FROM telepites WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode([
                "success" => true,
                "message" => "Sikeres törlés."
            ], JSON_UNESCAPED_UNICODE);
            break;

        default:
            echo json_encode([
                "success" => false,
                "message" => "Nem támogatott kérés."
            ], JSON_UNESCAPED_UNICODE);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Adatbázis hiba: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>