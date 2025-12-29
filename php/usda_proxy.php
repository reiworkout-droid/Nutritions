<?php
require_once __DIR__ . '/env.php';
header('Content-Type: application/json');

$apiKey = $_ENV['USDA_API_KEY'] ?? '';
$query  = $_GET['q'] ?? '';

if ($query === '' || $apiKey === '') {
  echo json_encode([]);
  exit;
}

$url = 'https://api.nal.usda.gov/fdc/v1/foods/search?' . http_build_query([
  'query' => $query,
  'api_key' => $apiKey
]);

echo file_get_contents($url);