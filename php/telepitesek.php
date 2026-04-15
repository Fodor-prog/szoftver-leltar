<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

$pdo = new PDO(
    'mysql:host=localhost;dbname=szoftverleltar1;charset=utf8',
    'szoftverleltar1',
    'U4BKST2026WEB',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $stmt = $pdo->query("SELECT * FROM telepites");
        echo json_encode($stmt->fetchAll());
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
            $data['verzio'],
            $data['datum']
        ]);

        echo json_encode(["success" => true]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $pdo->prepare("
            UPDATE telepites
            SET gepid=?, szoftverid=?, verzio=?, datum=?
            WHERE id=?
        ");
        $stmt->execute([
            $data['gepid'],
            $data['szoftverid'],
            $data['verzio'],
            $data['datum'],
            $data['id']
        ]);

        echo json_encode(["success" => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'];

        $stmt = $pdo->prepare("DELETE FROM telepites WHERE id=?");
        $stmt->execute([$id]);

        echo json_encode(["success" => true]);
        break;
}