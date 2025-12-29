<?php
header('Content-Type: application/json');

// ① .env を読む
$envPath = __DIR__ . '/../.env';
$lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($lines as $line) {
    if (str_starts_with(trim($line), '#')) continue;
    [$key, $value] = explode('=', $line, 2);
    $_ENV[trim($key)] = trim($value);
}

// ② APIキー取得
$apiKey = $_ENV['USDA_API_KEY'] ?? '';

// ③ クエリ取得
$query = $_GET['q'] ?? '';

// ④ バリデーション
if ($query === '' || $apiKey === '') {
    echo json_encode([]);
    exit;
}

// ⑤ USDA API呼び出し
$url = 'https://api.nal.usda.gov/fdc/v1/foods/search?' . http_build_query([
    'query' => $query,
    'api_key' => $apiKey
]);

echo file_get_contents($url);