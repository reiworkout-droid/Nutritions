<?php
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
//タイムスタンプ形式
$timestamp = strtotime($date);
//表示用に変更
$displayDate = date('Y年n月j日', $timestamp);

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

function getMeal($pdo, $date, $timing) {
    // SQL作成&実行
    $sql = 'SELECT * FROM My_nutrition WHERE date = :date AND timing = :timing ORDER BY id DESC';
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':date', $date, PDO::PARAM_STR);
    $stmt->bindValue(':timing', $timing, PDO::PARAM_INT);

    // SQL実行（実行に失敗すると `sql error ...` が出力される）
    try {
    $stmt->execute();
    } catch (PDOException $e) {
    echo json_encode(["sql error" => "{$e->getMessage()}"]);
    exit();
    }
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// 各タイミングのデータ取得
$morningData = getMeal($pdo, $date, 1);
$lunchData   = getMeal($pdo, $date, 2);
$dinnerData  = getMeal($pdo, $date, 3);
$otherData   = getMeal($pdo, $date, 4);

// 合計計算用関数
function calcTotal($mealArray) {
    $total = ['Energy'=>0,'Protein'=>0,'TotalFat'=>0,'Carb'=>0];
    foreach ($mealArray as $m) {
        $total['Energy'] += $m['energy'] ?? 0;
        $total['Protein'] += $m['protein'] ?? 0;
        $total['TotalFat'] += $m['fat'] ?? 0;
        $total['Carb'] += $m['carb'] ?? 0;
    }
    return $total;
}

$dailyTotal = calcTotal(array_merge($morningData,$lunchData,$dinnerData,$otherData));

?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/nutrition.css">
    <title>MyNutrition</title>
</head>
<body>
    <!-- Splash Screen -->
    <div id="splash">
        <h2 class="splash-title">今日何食うたと？</h2>

        <div class="muscle-foods">
            <span>🍗</span>
            <span>🥚</span>
            <span>🥦</span>
            <span>🍚</span>
        </div>
    </div>

    <!-- 本編 -->
    <header>
        <h1><?php echo $displayDate; ?>何食うたと？</h1>
    </header>

    <main>
        <div id="goList">
            <button onclick="location.href='./php/calender.php'" id="dateButton">日付選択</button>
        </div>
        <fieldset id="total">
            <legend id="resultArea">1日合計</legend>
            <div>
                <p id="calorie">総カロリー： <span></span> KCAL</p>
                <p id="protein">総タンパク質(g)： <span></span> g</p>
                <p id="fat">総脂質(g)： <span></span> g</p>
                <p id="carbo">総炭水化物(g)： <span></span> g</p>
            </div>
        </fieldset>

        <!-- 保存場所 -->
         <fieldset id="morning">
            <legend id="titleMorning">朝食</legend>
            <div class="addButton">
                <button class="burn-btn" data-meal="morning">
                    朝食を消費
                </button>
                <button type="button" class="addMeal" data-meal="1">食事追加</button>
                <button type="button" id="deleteMorningButton" class="deleteButton">1件削除</button>
            </div>
                <div id="morningArea">
                <div class="mealItem">
                    <div class="foodName"></div>
                    <div class="nutrients">
                    </div>
                    <div id="morningSum"></div>
                </div>
            </div>
            <div id="sumMorningArea" class="nutrition-summary">
                <div class="sum">合計：</div> 
                <div id="sumMorningEnergy" class="nutri-item">E: <span></span> kcal</div>
                <div id="sumMorningProtein" class="nutri-item">P: <span></span> g</div>
                <div id="sumMorningFat" class="nutri-item">F: <span></span> g</div>
                <div id="sumMorningCarb" class="nutri-item">C: <span></span> g</div>
            </div>
            <div class="burn-result" data-meal="morning" style="display:none;">
                <ul class="burn-result-list"></ul>
                <p class="note">※体重70kg基準</p>
            </div>
        </fieldset>

         <fieldset id="lunch">
            <legend id="titleLunch">昼食</legend>
            <div class="addButton">
                <button class="burn-btn" data-meal="lunch">
                    昼食を消費
                </button>
                <button type="button" class="addMeal" data-meal="2">食事追加</button>
                <button type="button" id="deleteLunchButton" class="deleteButton">1件削除</button>
            </div>
            <div id="lunchArea">
                <div class="mealItem">
                    <div class="foodName"></div>
                    <div class="nutrients">
                    </div>
                </div>
            </div>
            <div id="sumLunchArea" class="nutrition-summary">
                <div class="sum">合計：</div> 
                <div id="sumLunchEnergy" class="nutri-item">E: <span></span> kcal</div>
                <div id="sumLunchProtein" class="nutri-item">P: <span></span> g</div>
                <div id="sumLunchFat" class="nutri-item">F: <span></span> g</div>
                <div id="sumLunchCarb" class="nutri-item">C: <span></span> g</div>
            </div>
            <div class="burn-result" data-meal="lunch" style="display:none;">
                <ul class="burn-result-list"></ul>
                <p class="note">※体重70kg基準</p>
            </div>
        </fieldset>

         <fieldset id="dinner">
            <legend id="titleDinner">夕食</legend>
            <div class="addButton">
                <button class="burn-btn" data-meal="dinner">
                    夕食を消費
                </button>
                <button type="button" class="addMeal" data-meal="3">食事追加</button>
                <button type="button" id="deleteDinnerButton" class="deleteButton">1件削除</button>
            </div>
                <div id="dinnerArea">
                <div class="mealItem">
                    <div class="foodName"></div>
                    <div class="nutrients">
                    </div>
                </div>
            </div>
            <div id="sumDinnerArea" class="nutrition-summary">
                <div class="sum">合計：</div> 
                <div id="sumDinnerEnergy" class="nutri-item">E: <span></span> kcal</div>
                <div id="sumDinnerProtein" class="nutri-item">P: <span></span> g</div>
                <div id="sumDinnerFat" class="nutri-item">F: <span></span> g</div>
                <div id="sumDinnerCarb" class="nutri-item">C: <span></span> g</div>
            </div>
            <div class="burn-result" data-meal="dinner" style="display:none;">
                <ul class="burn-result-list"></ul>
                <p class="note">※体重70kg基準</p>
            </div>
        </fieldset>

         <fieldset id="other">
            <legend id="titleOther">間食</legend>
            <div class="addButton">
                <button class="burn-btn" data-meal="other">
                間食を消費
                </button>
                <button type="button" class="addMeal" data-meal="4">食事追加</button>
                <button type="button" id="deleteOtherButton" class="deleteButton">1件削除</button>
            </div>
                <div id="otherArea">
                <div class="mealItem">
                    <div class="foodName"></div>
                    <div class="nutrients">
                    </div>
                </div>
            </div>
            <div id="sumOtherArea" class="nutrition-summary">
                <div class="sum">合計：</div> 
                <div id="sumOtherEnergy" class="nutri-item">E: <span></span> kcal</div>
                <div id="sumOtherProtein" class="nutri-item">P: <span></span> g</div>
                <div id="sumOtherFat" class="nutri-item">F: <span></span> g</div>
                <div id="sumOtherCarb" class="nutri-item">C: <span></span> g</div>
            </div>
            <div class="burn-result" data-meal="other" style="display:none;">
                <ul class="burn-result-list"></ul>
                <p class="note">※体重70kg基準</p>
            </div>
        </fieldset>

        
        
    </main>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script>
    //アニメーション終了
    window.addEventListener('load', () => {
        const splash = document.getElementById('splash');
        setTimeout(() => {
        splash.remove();
        }, 3500);
    });
    </script>

    <script>
        let currentFoodId = null;
        let morningTotal = { energy: 0, protein: 0, fat: 0, carb: 0 };
        let lunchTotal   = { energy: 0, protein: 0, fat: 0, carb: 0 };
        let dinnerTotal  = { energy: 0, protein: 0, fat: 0, carb: 0 };
        let otherTotal   = { energy: 0, protein: 0, fat: 0, carb: 0 };
        const currentDate = "<?= $date ?>";
        const morningData = '<?= json_encode($morningData) ?>';
        const lunchData = '<?= json_encode($lunchData) ?>';
        const dinnerData = '<?= json_encode($dinnerData) ?>';
        const otherData = '<?= json_encode($otherData) ?>';
        morning = JSON.parse(morningData);
        lunch = JSON.parse(lunchData);
        dinner = JSON.parse(dinnerData);
        other = JSON.parse(otherData);
        console.log(morning);
        console.log(lunch);
        console.log(dinner);
        console.log(other);
        //読み込み
        renderMorning(morning);
        renderLunch(lunch);
        renderDinner(dinner);
        renderOther(other);
        renderDailyTotal();


        function renderMorning(morning) {
            let html = "";

            //合計用の箱
            let totalEnergy = 0;
            let totalProtein = 0;
            let totalFat = 0;
            let totalCarb = 0;

            for (let i = 0; i < morning.length; i++) {
                html += `
                    <div class="mealItem" data-id="${morning[i].id}">
                        <div class="foodName">${morning[i].food}</div>
                        <div class="gram"> <span> ${morning[i].gram} </span>g </div>
                        <div class="energy"> <span> ${morning[i].energy} </span>kcal </div>
                        <div class="protein"> P:<span> ${morning[i].protein} </span>g </div>
                        <div class="fat"> F:<span> ${morning[i].fat} </span>g</div>
                        <div class="carb"> C:<span> ${morning[i].carb} </span>g </div>
                    </div>      
                `;

                //合計計算
                totalEnergy += Number(morning[i].energy ?? 0);
                totalProtein += Number(morning[i].protein ?? 0);
                totalFat += Number(morning[i].fat ?? 0);
                totalCarb += Number(morning[i].carb ?? 0);
            }

            //小数点以下四捨五入
            totalEnergy = Math.round(totalEnergy);
            totalProtein = Math.round(totalProtein);
            totalFat = Math.round(totalFat);
            totalCarb = Math.round(totalCarb);

            $('#morningArea').html(html);


            //合計の表示
            $('#sumMorningEnergy span').html(totalEnergy);
            $('#sumMorningProtein span').html(totalProtein);
            $('#sumMorningFat span').html(totalFat);
            $('#sumMorningCarb span').html(totalCarb);
            
            morningTotal = {
            energy: totalEnergy,
            protein: totalProtein,
            fat: totalFat,
            carb: totalCarb
            };
        }

        //IDを取得
        $('#morningArea').on('click', '.mealItem', function () {
            currentFoodId = $(this).data('id');
            console.log('選択中ID:', currentFoodId);

            $('#morningArea .mealItem').removeClass('selected');
            $(this).addClass('selected');
        });

        //削除アクション
        $('#deleteMorningButton').on('click', function (e) {
            e.preventDefault(); // 

            if (!confirm('この食事を削除しますか？')) return;

            if (!currentFoodId) {
                alert('削除する食事を選択してください');
                return;
            }

            //削除後のID
            const deleteId = currentFoodId; 

            // AjaxでPHPに送る
            $.post('./php/delete.php', { id: deleteId }, function (res) {
                const result = JSON.parse(res);

                if (!result.success) {
                    alert('削除に失敗しました');
                    console.error(result.message);
                    return;
                }

                // DB削除成功 → フロントも消す
                morning = morning.filter(item => item.id !== deleteId);
                renderMorning(morning);
                currentFoodId = null;
                alert('1件削除しました');
            });        
            renderDailyTotal();            
        });


        function renderLunch(lunch) {
            let html = "";

            //合計用の箱
            let totalEnergy = 0;
            let totalProtein = 0;
            let totalFat = 0;
            let totalCarb = 0;

            for (let i = 0; i < lunch.length; i++) {
                html += `
                    <div class="mealItem" data-id="${lunch[i].id}">
                        <div class="foodName">${lunch[i].food}</div>
                        <div class="gram"> <span> ${lunch[i].gram} </span>g </div>
                        <div class="energy"> <span> ${lunch[i].energy} </span>kcal </div>
                        <div class="protein"> P:<span> ${lunch[i].protein} </span>g </div>
                        <div class="fat"> F:<span> ${lunch[i].fat} </span>g</div>
                        <div class="carb"> C:<span> ${lunch[i].carb} </span>g </div>
                    </div>      
                `;

                //合計計算
                totalEnergy += Number(lunch[i].energy ?? 0);
                totalProtein += Number(lunch[i].protein ?? 0);
                totalFat += Number(lunch[i].fat ?? 0);
                totalCarb += Number(lunch[i].carb ?? 0);
            }

            //小数点以下四捨五入
            totalEnergy = Math.round(totalEnergy);
            totalProtein = Math.round(totalProtein);
            totalFat = Math.round(totalFat);
            totalCarb = Math.round(totalCarb);

            $('#lunchArea').html(html);


            //合計の表示
            $('#sumLunchEnergy span').html(totalEnergy);
            $('#sumLunchProtein span').html(totalProtein);
            $('#sumLunchFat span').html(totalFat);
            $('#sumLunchCarb span').html(totalCarb);

            lunchTotal = {
            energy: totalEnergy,
            protein: totalProtein,
            fat: totalFat,
            carb: totalCarb
            };            
        }

        //IDを取得
        $('#lunchArea').on('click', '.mealItem', function () {
            currentFoodId = $(this).data('id');
            console.log('選択中ID:', currentFoodId);

            $('#lunchArea .mealItem').removeClass('selected');
            $(this).addClass('selected');
        });

        //削除アクション
        $('#deleteLunchButton').on('click', function (e) {
            e.preventDefault(); // 

            if (!confirm('この食事を削除しますか？')) return;

            if (!currentFoodId) {
                alert('削除する食事を選択してください');
                return;
            }

            //削除後のID
            const deleteId = currentFoodId; 

            // AjaxでPHPに送る
            $.post('./php/delete.php', { id: deleteId }, function (res) {
                const result = JSON.parse(res);

                if (!result.success) {
                    alert('削除に失敗しました');
                    console.error(result.message);
                    return;
                }

                // DB削除成功 → フロントも消す
                lunch = lunch.filter(item => item.id !== deleteId);
                renderLunch(lunch);
                currentFoodId = null;
                alert('1件削除しました');
            });        
            renderDailyTotal();            
        });


        function renderDinner(dinner) {
            let html = "";

            //合計用の箱
            let totalEnergy = 0;
            let totalProtein = 0;
            let totalFat = 0;
            let totalCarb = 0;

            for (let i = 0; i < dinner.length; i++) {
                html += `
                    <div class="mealItem" data-id="${dinner[i].id}">
                        <div class="foodName">${dinner[i].food}</div>
                        <div class="gram"> <span> ${dinner[i].gram} </span>g </div>
                        <div class="energy"> <span> ${dinner[i].energy} </span>kcal </div>
                        <div class="protein"> P:<span> ${dinner[i].protein} </span>g </div>
                        <div class="fat"> F:<span> ${dinner[i].fat} </span>g</div>
                        <div class="carb"> C:<span> ${dinner[i].carb} </span>g </div>
                    </div>      
                `;

                //合計計算
                totalEnergy += Number(dinner[i].energy ?? 0);
                totalProtein += Number(dinner[i].protein ?? 0);
                totalFat += Number(dinner[i].fat ?? 0);
                totalCarb += Number(dinner[i].carb ?? 0);
            }

            //小数点以下四捨五入
            totalEnergy = Math.round(totalEnergy);
            totalProtein = Math.round(totalProtein);
            totalFat = Math.round(totalFat);
            totalCarb = Math.round(totalCarb);

            $('#dinnerArea').html(html);


            //合計の表示
            $('#sumDinnerEnergy span').html(totalEnergy);
            $('#sumDinnerProtein span').html(totalProtein);
            $('#sumDinnerFat span').html(totalFat);
            $('#sumDinnerCarb span').html(totalCarb);
            
            dinnerTotal = {
            energy: totalEnergy,
            protein: totalProtein,
            fat: totalFat,
            carb: totalCarb
            };
        }

        //IDを取得
        $('#dinnerArea').on('click', '.mealItem', function () {
            currentFoodId = $(this).data('id');
            console.log('選択中ID:', currentFoodId);

            $('#dinnerArea .mealItem').removeClass('selected');
            $(this).addClass('selected');
        });

        //削除アクション
        $('#deleteDinnerButton').on('click', function (e) {
            e.preventDefault(); // 

            if (!confirm('この食事を削除しますか？')) return;

            if (!currentFoodId) {
                alert('削除する食事を選択してください');
                return;
            }

            //削除後のID
            const deleteId = currentFoodId; 

            // AjaxでPHPに送る
            $.post('./php/delete.php', { id: deleteId }, function (res) {
                const result = JSON.parse(res);

                if (!result.success) {
                    alert('削除に失敗しました');
                    console.error(result.message);
                    return;
                }

                // DB削除成功 → フロントも消す
                dinner = dinner.filter(item => item.id !== deleteId);
                renderDinner(dinner);
                currentFoodId = null;
                alert('1件削除しました');
            });  
            renderDailyTotal();                  
        });


        function renderOther(other) {
            let html = "";

            //合計用の箱
            let totalEnergy = 0;
            let totalProtein = 0;
            let totalFat = 0;
            let totalCarb = 0;

            for (let i = 0; i < other.length; i++) {
                html += `
                    <div class="mealItem" data-id="${other[i].id}">
                        <div class="foodName">${other[i].food}</div>
                        <div class="gram"> <span> ${other[i].gram} </span>g </div>
                        <div class="energy"> <span> ${other[i].energy} </span>kcal </div>
                        <div class="protein"> P:<span> ${other[i].protein} </span>g </div>
                        <div class="fat"> F:<span> ${other[i].fat} </span>g</div>
                        <div class="carb"> C:<span> ${other[i].carb} </span>g </div>
                    </div>      
                `;

                //合計計算
                totalEnergy += Number(other[i].energy ?? 0);
                totalProtein += Number(other[i].protein ?? 0);
                totalFat += Number(other[i].fat ?? 0);
                totalCarb += Number(other[i].carb ?? 0);
            }

            //小数点以下四捨五入
            totalEnergy = Math.round(totalEnergy);
            totalProtein = Math.round(totalProtein);
            totalFat = Math.round(totalFat);
            totalCarb = Math.round(totalCarb);

            $('#otherArea').html(html);


            //合計の表示
            $('#sumOtherEnergy span').html(totalEnergy);
            $('#sumOtherProtein span').html(totalProtein);
            $('#sumOtherFat span').html(totalFat);
            $('#sumOtherCarb span').html(totalCarb);
            
            otherTotal = {
            energy: totalEnergy,
            protein: totalProtein,
            fat: totalFat,
            carb: totalCarb
            };
        }

        //IDを取得
        $('#otherArea').on('click', '.mealItem', function () {
            currentFoodId = $(this).data('id');
            console.log('選択中ID:', currentFoodId);

            $('#otherArea .mealItem').removeClass('selected');
            $(this).addClass('selected');
        });

        //削除アクション
        $('#deleteOtherButton').on('click', function (e) {
            e.preventDefault(); // 

            if (!confirm('この食事を削除しますか？')) return;

            if (!currentFoodId) {
                alert('削除する食事を選択してください');
                return;
            }

            //削除後のID
            const deleteId = currentFoodId; 

            // AjaxでPHPに送る
            $.post('./php/delete.php', { id: deleteId }, function (res) {
                const result = JSON.parse(res);

                if (!result.success) {
                    alert('削除に失敗しました');
                    console.error(result.message);
                    return;
                }

                // DB削除成功 → フロントも消す
                other = other.filter(item => item.id !== deleteId);
                renderOther(other);
                currentFoodId = null;
                alert('1件削除しました');
            });        
            renderDailyTotal();            
        });

        //追加ボタンクリックアクション
        $(document).on('click', '.addMeal', function () {          
        const timing = $(this).data('meal');

        location.href = `./php/input.php?timing=${timing}&date=${currentDate}`;
        console.log('表示中の日付:', currentDate);

        });




    function renderDailyTotal() {
        const dailyTotalEnergy =
            morningTotal.energy +
            lunchTotal.energy +
            dinnerTotal.energy +
            otherTotal.energy;

        const dailyTotalProtein =
            morningTotal.protein +
            lunchTotal.protein +
            dinnerTotal.protein +
            otherTotal.protein;

        const dailyTotalFat =
            morningTotal.fat +
            lunchTotal.fat +
            dinnerTotal.fat +
            otherTotal.fat;

        const dailyTotalCarb =
            morningTotal.carb +
            lunchTotal.carb +
            dinnerTotal.carb +
            otherTotal.carb;

        console.log(dailyTotalEnergy);
        console.log(dailyTotalProtein);
        console.log(dailyTotalFat);
        console.log(dailyTotalCarb);


        $('#calorie span').html(dailyTotalEnergy);
        $('#protein span').html(dailyTotalProtein);
        $('#fat span').html(dailyTotalFat);
        $('#carbo span').html(dailyTotalCarb);
    }


    renderDailyTotal();

    </script>
    
    <script>
    console.log('burn js loaded');

    $(document).on('click', '.burn-btn', function () {

        const meal = $(this).data('meal');
        let calories = 0;

        if (meal === 'morning') calories = morningTotal.energy;
        if (meal === 'lunch')   calories = lunchTotal.energy;
        if (meal === 'dinner')  calories = dinnerTotal.energy;
        if (meal === 'other')   calories = otherTotal.energy;

        if (!calories || calories <= 0) {
            alert('カロリーが0です');
            return;
        }

        // 対応する結果エリアを取得
        const $resultBox = $(`.burn-result[data-meal="${meal}"]`);
        const $list = $resultBox.find('.burn-result-list');

        $resultBox.show();
        $list.html('<li>計算中...</li>');

        $.ajax({
            url: './php/caloriesburned_proxy.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ calories }),
            success(res) {
            renderBurnResult(res.results, $list);
            },
            error() {
            $list.html('<li>計算に失敗しました</li>');
            }
        });
    });   

    function renderBurnResult(results, $list) {
    let html = '';

    results.forEach(item => {
        const minutes = Math.round(item.minutes);
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;

        html += `
        <li>
            <strong>${item.activity}</strong>：
            ${h > 0 ? h + '時間' : ''}${m}分
        </li>
        `;
    });

    $list.html(html);
    }


    </script>
    <!-- axiosライブラリの読み込み -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</body>
</html>