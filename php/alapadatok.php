<?php

header('Content-Type: application/json');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=szoftverleltar1;charset=utf8',
        'szoftverleltar1',
        'U4BKST2026WEB',
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        )
    );

    $gep = $pdo->query("SELECT COUNT(*) AS db FROM gep")->fetch()['db'];
    $szoftver = $pdo->query("SELECT COUNT(*) AS db FROM szoftver")->fetch()['db'];
    $telepites = $pdo->query("SELECT COUNT(*) AS db FROM telepites")->fetch()['db'];

    echo json_encode([
        "gep" => (int)$gep,
        "szoftver" => (int)$szoftver,
        "telepites" => (int)$telepites
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}