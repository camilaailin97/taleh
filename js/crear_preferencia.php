<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

$access_token = "TU_ACCESS_TOKEN";

// Leer JSON enviado desde fetch
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["total"])) {
    echo json_encode([
        "error" => "No llegó el total"
    ]);
    exit;
}

$total = filter_var($data["total"], FILTER_VALIDATE_FLOAT);

if ($total === false || $total <= 0) {
    echo json_encode([
        "error" => "Total inválido",
        "recibido" => $data["total"]
    ]);
    exit;
}

$payload = [
    "items" => [[
        "title" => "Compra en Taleh",
        "quantity" => 1,
        "currency_id" => "ARS",
        "unit_price" => $total
    ]],
    "auto_return" => "approved"
];

$ch = curl_init("https://api.mercadopago.com/checkout/preferences");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode([
        "error" => curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

curl_close($ch);

echo $response;