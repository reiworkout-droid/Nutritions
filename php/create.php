<?php

// var_dump($_POST);
// exit;
//選択した日または今日の日付
$date = $_POST['date'] ?? date('Y-m-d');

//それぞれの値が無ければ以下を出力
if (
    !isset($_POST['food']) || $_POST['food'] === '' ||
    !isset($_POST['gram']) || $_POST['gram'] === '' ||
    !isset($_POST['protein']) || $_POST['protein'] === '' ||
    !isset($_POST['fat']) || $_POST['fat'] === '' ||
    !isset($_POST['carb']) || $_POST['carb'] === '' ||
    !isset($_POST['energy']) || $_POST['energy'] === '' 
) {
    exit('入力項目が正しくありません');
}

//値を取ってくる
$food = $_POST['food'];
$gram = $_POST['gram'];
$protein = $_POST['protein'];
$fat     = $_POST['fat'];
$carb    = $_POST['carb'];
$energy  = $_POST['energy'];
$timing  = $_POST['timing'];

// DB接続　毎回決まった構文（dbnameのみ変更）
// 各種項目設定
$dbn ='mysql:dbname=My_nutrition;charset=utf8mb4;port=3306;host=localhost';
$user = 'root';
$pwd = '';

// DB接続 決まった構文
try {
  $pdo = new PDO($dbn, $user, $pwd);
} catch (PDOException $e) {
  echo json_encode(["db error" => "{$e->getMessage()}"]);
  exit();
}

//SQLに入力内容を渡す変数を作る
$sql = 'INSERT INTO My_nutrition (id, food, gram, protein, fat, carb, energy, timing, date, created_at, updated_at) VALUES(NULL, :food, :gram, :protein, :fat, :carb, :energy, :timing, :date, now(), now())';
$stmt = $pdo->prepare($sql);

// バインド変数を設定
$stmt->bindValue(':food', $food, PDO::PARAM_STR);
$stmt->bindValue(':gram', $gram, PDO::PARAM_STR);
$stmt->bindValue(':protein', $protein, PDO::PARAM_STR);
$stmt->bindValue(':fat', $fat, PDO::PARAM_STR);
$stmt->bindValue(':carb', $carb, PDO::PARAM_STR);
$stmt->bindValue(':energy', $energy, PDO::PARAM_STR);
$stmt->bindValue(':timing', $timing, PDO::PARAM_INT);
$stmt->bindValue(':date', $date, PDO::PARAM_STR);

// SQL実行（実行に失敗すると `sql error ...` が出力される）
try {
  $status = $stmt->execute();
} catch (PDOException $e) {
  echo json_encode(["sql error" => "{$e->getMessage()}"]);
  exit();
}

header('Location: read.php');
exit();