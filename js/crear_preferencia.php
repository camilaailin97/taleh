<?php
// RESPUESTA DE SEGURIDAD PARA EL NAVEGADOR
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

// RECIBIR DATOS
$data = json_decode(file_get_contents('php://input'), true);
$total = isset($data['total']) ? $data['total'] : 0;

$access_token = "APP_USR-7999825053986712-070600-e87c755b0a3f934c8b18448ecdca50ac-250750027";

$url = "https://api.mercadopago.com/checkout/preferences";
$payload = json_encode([
    "items" => [["title" => "Compra en Taleh", "quantity" => 1, "unit_price" => (float)$total, "currency_id" => "ARS"]],
    "auto_return" => "approved"
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $access_token", "Content-Type: application/json"]);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>