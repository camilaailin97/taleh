<?php
// 1. Configuración de seguridad para evitar bloqueos del navegador
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// 2. Cargar la librería de Mercado Pago (asegúrate de tenerla instalada vía composer)
require 'vendor/autoload.php';

use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

// 3. Configura tu Access Token (REEMPLAZA CON TU TOKEN REAL)
MercadoPagoConfig::setAccessToken("APP_USR-7999825053986712-070600-e87c755b0a3f934c8b18448ecdca50ac-250750027");

// 4. Recibir y decodificar los datos del frontend
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['total'])) {
    http_response_code(400);
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

// 5. Crear la preferencia de pago
$client = new PreferenceClient();
$preference = $client->create([
    "items" => [
        [
            "title" => "Pedido en Taleh",
            "quantity" => 1,
            "unit_price" => (float)$data['total'],
            "currency_id" => "ARS"
        ]
    ],
    "back_urls" => [
        "success" => "https://camilaailin97.github.io/taleh/",
        "failure" => "https://camilaailin97.github.io/taleh/",
        "pending" => "https://camilaailin97.github.io/taleh/"
    ],
    "auto_return" => "approved"
]);

// 6. Devolver el link de pago al frontend
echo json_encode(["init_point" => $preference->init_point]);
?>