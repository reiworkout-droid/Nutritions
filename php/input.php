<?php



?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/input.css">
    <title>何をどんだけ食うたと？</title>
</head>
<body>
    <header>
        <h1>今日何食うたと？</h1>
    </header>

    <div id="goArea">
        <button onclick="location.href='./read.php'" id="goButton">一覧画面</button>
    </div>


    <fieldset id="search">
    <legend class="form">食品検索</legend>
    <div>
        <div id="searchArea">
            <input type="text" id="form">
            <button id="searchButton">検索</button><br>
        </div>
        <!-- 出力場所 -->
         <div id="outputArea">
            <div id="output"></div>
            <div id="g"></div>
         </div>
         <div id="saveArea"></div>
    </div>
</fieldset>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<!-- axiosライブラリの読み込み -->
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script type="module" src="../nutrition.js"></script>
</body>
</html>