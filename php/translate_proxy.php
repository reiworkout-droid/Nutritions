<?php
require_once __DIR__ . '/env.php';
header('Content-Type: application/json');

$apiKey = $_ENV['GOOGLE_API_KEY'] ?? '';

$input  = json_decode(file_get_contents('php://input'), true);
$text   = $input['q'] ?? '';
$target = $input['target'] ?? 'en';

if ($text === '' || $apiKey === '') {
  echo json_encode([]);
  exit;
}

$url = 'https://translation.googleapis.com/language/translate/v2?key=' . $apiKey;

$options = [
  'http' => [
    'method'  => 'POST',
    'header'  => "Content-Type: application/json",
    'content' => json_encode([
      'q' => $text,
      'target' => $target
    ])
  ]
];

echo file_get_contents($url, false, stream_context_create($options));