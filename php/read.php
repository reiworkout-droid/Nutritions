


<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/nutrition.css">
    <title>MyNutrition</title>
</head>
<body>
    <header>
        <h1>今日何食うたと？</h1>
    </header>

    <main>
        <button onclick="location.href='./input.php'" id="goButton">一覧画面</button>

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
                <button id="addMorningButton" class="addButton">食事追加</button>
                <button id="deleteMorningButton" class="deleteButton">1件削除</button>
            </div>
                <div id="morningArea">
                <div class="mealItem">
                    <div class="foodName"></div>
                    <div class="nutrients">
                    </div>
                    <div id="morningSum"></div>
                </div>
            </div>
            <div id="sumMorningArea">
                <p class="sum">合計：</p> 
                <div id="sumMorning" class="nutrition-summary">
                    <div id="sumMorningEnergy" class="nutri-item">E: <span></span> kcal</div>
                    <div id="sumMorningProtein" class="nutri-item">P: <span></span> g</div>
                    <div id="sumMorningFat" class="nutri-item">F: <span></span> g</div>
                    <div id="sumMorningCarb" class="nutri-item">C: <span></span> g</div>
                </div>            
            </div>
        </fieldset>

         <fieldset id="lunch">
            <legend id="titleLunch">昼食</legend>
            <div class="addButton">
                <button id="addLunchButton" class="addButton">食事追加</button>
                <button id="deleteLunchButton" class="deleteButton">1件削除</button>
            </div>
            <div id="lunchArea">
                <div class="mealItem">
                    <div class="foodName"></div>
                    <div class="nutrients">
                    </div>
                </div>
            </div>
            <div id="sumLunchArea">
                <p class="sum">合計：</p> 
                <div id="sumLunch" class="nutrition-summary">
                    <div id="sumLunchEnergy" class="nutri-item">E: <span></span> kcal</div>
                    <div id="sumLunchProtein" class="nutri-item">P: <span></span> g</div>
                    <div id="sumLunchFat" class="nutri-item">F: <span></span> g</div>
                    <div id="sumLunchCarb" class="nutri-item">C: <span></span> g</div>
                </div>            
            </div>
        </fieldset>

         <fieldset id="dinner">
            <legend id="titleDinner">夕食</legend>
            <div class="addButton">
                <button id="addDinnerButton" class="addButton">食事追加</button>
                <button id="deleteDinnerButton" class="deleteButton">1件削除</button>
            </div>
                <div id="dinnerArea">
                <div class="mealItem">
                    <div class="foodName"></div>
                    <div class="nutrients">
                    </div>
                </div>
            </div>
            <div id="sumDinnerArea">
                <p class="sum">合計：</p> 
                <div id="sumDinner" class="nutrition-summary">
                    <div id="sumDinnerEnergy" class="nutri-item">E: <span></span> kcal</div>
                    <div id="sumDinnerProtein" class="nutri-item">P: <span></span> g</div>
                    <div id="sumDinnerFat" class="nutri-item">F: <span></span> g</div>
                    <div id="sumDinnerCarb" class="nutri-item">C: <span></span> g</div>
                </div>            
            </div>
        </fieldset>

         <fieldset id="other">
            <legend id="titleOther">間食</legend>
            <div class="addButton">
                <button id="addOtherButton" class="addButton">食事追加</button>
                <button id="deleteOtherButton" class="deleteButton">1件削除</button>
            </div>
                <div id="otherArea">
                <div class="mealItem">
                    <div class="foodName"></div>
                    <div class="nutrients">
                    </div>
                </div>
            </div>
            <div id="sumOtherArea">
                <p class="sum">合計：</p> 
                <div id="sumOther" class="nutrition-summary">
                    <div id="sumOtherEnergy" class="nutri-item">E: <span></span> kcal</div>
                    <div id="sumOtherProtein" class="nutri-item">P: <span></span> g</div>
                    <div id="sumOtherFat" class="nutri-item">F: <span></span> g</div>
                    <div id="sumOtherCarb" class="nutri-item">C: <span></span> g</div>
                </div>            
            </div>
        </fieldset>

        
        
    </main>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <!-- axiosライブラリの読み込み -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script type="module" src="../nutrition.js"></script>
</body>
</html>