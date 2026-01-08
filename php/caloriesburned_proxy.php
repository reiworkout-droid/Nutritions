<?php
require_once __DIR__ . '/env.php';
header('Content-Type: application/json');

// APIキー
$apiKey = $_ENV['CALORIESBURNED_API_KEY'] ?? '';
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'API key not set']);
    exit;
}

// 入力（食事タイミングの合計カロリー）
$input = json_decode(file_get_contents('php://input'), true);
$intakeCalories = $input['calories'] ?? 0;

if ($intakeCalories <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid calories']);
    exit;
}

// 固定条件
$weight = 70;
$duration = 60; // 1時間で取得 → kcal/分に変換

// 表示する運動3種（日本語名とAPI用名）
$activities = [
    'walking' => '🚶‍♂️ウォーキング🔥',
    'jogging' => '🏃‍♀️ジョギング🔥',
    'cycling' => '🚵‍♀️サイクリング🔥'
];

$results = [];

foreach ($activities as $apiActivity => $labelJa) {

    $url = "https://api.api-ninjas.com/v1/caloriesburned"
         . "?activity={$apiActivity}"
         . "&weight={$weight}"
         . "&duration={$duration}";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "X-Api-Key: {$apiKey}"
        ]
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);

    if (!isset($data[0]['calories_per_hour'])) {
        continue;
    }

    // kcal/分
    $kcalPerMinute = $data[0]['calories_per_hour'] / 60;

    // 必要分数（単純逓増）
    $requiredMinutes = $intakeCalories / $kcalPerMinute;

    $results[] = [
        'activity' => $labelJa,
        'minutes'  => round($requiredMinutes),
    ];
}

// レスポンス
echo json_encode([
    'intake_calories' => $intakeCalories,
    'weight' => 70,
    'results' => $results,
    'note' => '体重70kgを基準とした推定値です'
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);