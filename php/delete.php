<?php

// エラー表示（開発中）
ini_set('display_errors', 1);
error_reporting(E_ALL);

// POSTチェック
if (!isset($_POST['id'])) {
    echo json_encode(['error' => 'ID not found']);
    exit();
}

$id = intval($_POST['id']);

// DB接続
$dbn = 'mysql:dbname=My_nutrition;charset=utf8mb4;port=3306;host=localhost';
$user = 'root';
$pwd  = '';

// DB接続 決まった構文
try {
  $pdo = new PDO($dbn, $user, $pwd);
} catch (PDOException $e) {
  echo json_encode(["db error" => "{$e->getMessage()}"]);
  exit();
}

// DELETE実行
$sql = 'DELETE FROM My_nutrition WHERE id = :id';
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':id', $id, PDO::PARAM_INT);

try {
    $stmt->execute();
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['sql error' => $e->getMessage()]);
}