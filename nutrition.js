// 登録された食べ物データ
let foods = [];

// 現在選択中の食べ物ID
let currentFoodId = null;


$('#searchButton').on('click', async function(){

  //検索中・・・の表示
  $('#searchButton').text('検索中・・・');

  //入力内容の取得
  const inputText = $('#form').val().trim();
  if(!inputText) return;

  // 日本語表記用対応表
  const NUTRIENT_LABELS_JA = {
    'Energy': 'エネルギー',
    'Protein': 'P',
    'Total lipid (fat)': 'F',
    'Carbohydrate, by difference': 'C'
  };

  // 三大栄養素＋カロリーのみ入れる箱
  const TARGET_NUTRIENTS = [
  'Energy',
  'Protein',
  'Total lipid (fat)',
  'Carbohydrate, by difference'
  ];


  // 日本語→英語
  const translateUrl = 'https://translation.googleapis.com/language/translate/v2'
  // APIキー
  // food APIキー

  await axios.post(`${translateUrl}?key=${apiKey}`,
      {
      q: inputText,
      target: 'en'
    })
  .then(function (translateRes){
    const translatedText = translateRes.data.data.translations[0].translatedText;
    console.log('Translated:', translatedText);

  // 英語で食品検索(APIキー)
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(translatedText)}&api_key=`;

    return axios.get(searchUrl);
  })
      .then(function (response){//うまくいったら実装
        console.log(response.data);
        const elements = [];

          //計算用の箱
        const nutrientValues = {};


        if (!Array.isArray(response.data.foods)|| response.data.foods.length === 0) {
          $('#output').html('<p>見つかりませんでした</p>');
          return;
        };

          //最初の１つのみ表示
          const nutrients = response.data.foods[0].foodNutrients;
          if (!Array.isArray(nutrients) || nutrients.length === 0) return;

          for (let j = 0; j < nutrients.length; j++) {
            const n = nutrients[j];
            if (!n) continue;
            
            // ★ここでTARGET_NUTRIENTSを使って抽出★
            if (TARGET_NUTRIENTS.includes(n.nutrientName)) {
              const label = NUTRIENT_LABELS_JA[n.nutrientName] || n.nutrientName;
              elements.push(
                `<p>${label}: ${n.value}${n.unitName}</p>`
              );

              //計算用の数値
              nutrientValues[n.nutrientName] = n.value;
            }
          }
        console.log(elements);

        $('#output').html(elements.join(''));//カンマなし

        //検索ボタンを戻す
        $('#searchButton').text('検索');

          // 朝食に保存
        $('#morningButton').off('click').on('click', function(){

          // すでに保存されている朝食データを取得
          const savedMorning = localStorage.getItem('meal_1');

          // 保存データがあれば配列に戻す、なければ空配列
          let morning;
          
          if(savedMorning) {
            morning = JSON.parse(savedMorning);
          } else {
            morning = [];
          }

          morning.push({
            id: Date.now(), //削除用の一意ID 
            inputText: inputText,//表示用
            elements: [...elements],
            nutrients: { ...nutrientValues }//計算用
          });
          console.log(morning);

          //合計カロリー処理の箱
          let totalEnergy = 0;

          for (let i = 0; i < morning.length; i++) {
            if (morning[i].nutrients?.Energy) {
              totalEnergy = totalEnergy + morning[i].nutrients.Energy;
            }
          }

          totalEnergy = Math.round(totalEnergy);

          console.log('合計エネルギー:', totalEnergy);
          $('#sumMorningEnergy span').html('E:', totalEnergy, 'KCAL'); 

          //合計たんぱく質の箱
          let totalProtein = 0;

          for (let i = 0; i < morning.length; i++) {
            if (morning[i].nutrients?.Protein) {
              totalProtein = totalProtein + morning[i].nutrients.Protein;
            }
          }

          totalProtein = Math.round(totalProtein);

          console.log('合計P:', totalProtein);
          $('#sumMorningProtein span').html('P:', totalProtein,'G'); 

          //合計脂質の箱
          let totalFat = 0;

          for (let i = 0; i < morning.length; i++) {
            if (morning[i].nutrients?.['Total lipid (fat)']) {
              totalFat = totalFat + morning[i].nutrients['Total lipid (fat)'];
            }
          }

          totalFat = Math.round(totalFat);

          console.log('合計F:', totalFat);
          $('#sumMorningFat span').html('F:', totalFat, 'G'); 

          // 合計炭水化物の箱
          let totalCarbohydrate = 0;

          for (let i = 0; i < morning.length; i++) {
            if (morning[i].nutrients?.['Carbohydrate, by difference']) {
              totalCarbohydrate = totalCarbohydrate + morning[i].nutrients['Carbohydrate, by difference'];
            }
          }

          totalCarbohydrate = Math.round(totalCarbohydrate);

          console.log('合計C:', totalCarbohydrate);
          $('#sumMorningCarb span').html('C:', totalCarbohydrate, 'G'); 

          const json = JSON.stringify(morning);//JSON形式に変換
          console.log(json);

          localStorage.setItem('meal_1', json);//ローカルストレージに保存

          // 朝食エリアを再描画
          renderMorning(morning);

          //呼び出し
          calculateDailyTotal();

          alert('朝食を保存しました');

        });

          // 昼食に保存
        $('#lunchButton').off('click').on('click', function(){

          // すでに保存されている昼食データを取得
          const savedLunch = localStorage.getItem('meal_2');

          // 保存データがあれば配列に戻す、なければ空配列
          let lunch;
          
          if(savedLunch) {
            lunch = JSON.parse(savedLunch);
          } else {
            lunch = [];
          }

          lunch.push({
            id: Date.now(), //削除用の一意ID 
            inputText: inputText,//表示用
            elements: [...elements],
            nutrients: { ...nutrientValues }//計算用
          });
          console.log(lunch);

          //合計カロリー処理の箱
          let totalEnergy = 0;

          for (let i = 0; i < lunch.length; i++) {
            if (lunch[i].nutrients?.Energy) {
              totalEnergy = totalEnergy + lunch[i].nutrients.Energy;
            }
          }

          totalEnergy = Math.round(totalEnergy);

          console.log('合計エネルギー:', totalEnergy);
          $('#sumLunchEnergy span').html('E:', totalEnergy, 'KCAL'); 

          //合計たんぱく質の箱
          let totalProtein = 0;

          for (let i = 0; i < lunch.length; i++) {
            if (lunch[i].nutrients?.Protein) {
              totalProtein = totalProtein + lunch[i].nutrients.Protein;
            }
          }

          totalProtein = Math.round(totalProtein);

          console.log('合計P:', totalProtein);
          $('#sumLunchProtein span').html('P:', totalProtein,'G'); 

          //合計脂質の箱
          let totalFat = 0;

          for (let i = 0; i < lunch.length; i++) {
            if (lunch[i].nutrients?.['Total lipid (fat)']) {
              totalFat = totalFat + lunch[i].nutrients['Total lipid (fat)'];
            }
          }

          totalFat = Math.round(totalFat);

          console.log('合計F:', totalFat);
          $('#sumLunchFat span').html('F:', totalFat, 'G'); 

          // 合計炭水化物の箱
          let totalCarbohydrate = 0;

          for (let i = 0; i < lunch.length; i++) {
            if (lunch[i].nutrients?.['Carbohydrate, by difference']) {
              totalCarbohydrate = totalCarbohydrate + lunch[i].nutrients['Carbohydrate, by difference'];
            }
          }

          totalCarbohydrate = Math.round(totalCarbohydrate);

          console.log('合計C:', totalCarbohydrate);
          $('#sumLunchCarb span').html('C:', totalCarbohydrate, 'G'); 

          const json = JSON.stringify(lunch);//JSON形式に変換
          console.log(json);

          localStorage.setItem('meal_2', json);//ローカルストレージに保存

          // 昼食エリアを再描画
          renderLunch(lunch);

          //呼び出し
          calculateDailyTotal();

          alert('昼食を保存しました');

        });

          // 夕食に保存
        $('#dinnerButton').off('click').on('click', function(){

          // すでに保存されている夕食データを取得
          const savedDinner = localStorage.getItem('meal_3');

          // 保存データがあれば配列に戻す、なければ空配列
          let dinner;
          
          if(savedDinner) {
            dinner = JSON.parse(savedDinner);
          } else {
            dinner = [];
          }

          dinner.push({
            id: Date.now(), //削除用の一意ID 
            inputText: inputText,//表示用
            elements: [...elements],
            nutrients: { ...nutrientValues }//計算用
          });
          console.log(dinner);

          //合計カロリー処理の箱
          let totalEnergy = 0;

          for (let i = 0; i < dinner.length; i++) {
            if (dinner[i].nutrients?.Energy) {
              totalEnergy = totalEnergy + dinner[i].nutrients.Energy;
            }
          }

          totalEnergy = Math.round(totalEnergy);

          console.log('合計エネルギー:', totalEnergy);
          $('#sumDinnerEnergy span').html('E:', totalEnergy, 'KCAL'); 

          //合計たんぱく質の箱
          let totalProtein = 0;

          for (let i = 0; i < dinner.length; i++) {
            if (dinner[i].nutrients?.Protein) {
              totalProtein = totalProtein + dinner[i].nutrients.Protein;
            }
          }

          totalProtein = Math.round(totalProtein);

          console.log('合計P:', totalProtein);
          $('#sumDinnerProtein span').html('P:', totalProtein,'G'); 

          //合計脂質の箱
          let totalFat = 0;

          for (let i = 0; i < dinner.length; i++) {
            if (dinner[i].nutrients?.['Total lipid (fat)']) {
              totalFat = totalFat + dinner[i].nutrients['Total lipid (fat)'];
            }
          }

          totalFat = Math.round(totalFat);

          console.log('合計F:', totalFat);
          $('#sumDinnerFat span').html('F:', totalFat, 'G'); 

          // 合計炭水化物の箱
          let totalCarbohydrate = 0;

          for (let i = 0; i < dinner.length; i++) {
            if (dinner[i].nutrients?.['Carbohydrate, by difference']) {
              totalCarbohydrate = totalCarbohydrate + dinner[i].nutrients['Carbohydrate, by difference'];
            }
          }

          totalCarbohydrate = Math.round(totalCarbohydrate);

          console.log('合計C:', totalCarbohydrate);
          $('#sumDinnerCarb span').html('C:', totalCarbohydrate, 'G'); 

          const json = JSON.stringify(dinner);//JSON形式に変換
          console.log(json);

          localStorage.setItem('meal_3', json);//ローカルストレージに保存

          // 夕食エリアを再描画
          renderDinner(dinner);

          //呼び出し
          calculateDailyTotal();

          alert('夕食を保存しました');

        });

          // おやつに保存
        $('#otherButton').off('click').on('click', function(){

          // すでに保存されている夕食データを取得
          const savedOther = localStorage.getItem('meal_4');

          // 保存データがあれば配列に戻す、なければ空配列
          let other;
          
          if(savedOther) {
            other = JSON.parse(savedOther);
          } else {
            other = [];
          }

          other.push({
            id: Date.now(), //削除用の一意ID 
            inputText: inputText,//表示用
            elements: [...elements],
            nutrients: { ...nutrientValues }//計算用
          });
          console.log(other);

          //合計カロリー処理の箱
          let totalEnergy = 0;

          for (let i = 0; i < other.length; i++) {
            if (other[i].nutrients?.Energy) {
              totalEnergy = totalEnergy + other[i].nutrients.Energy;
            }
          }

          totalEnergy = Math.round(totalEnergy);

          console.log('合計エネルギー:', totalEnergy);
          $('#sumOtherEnergy span').html('E:', totalEnergy, 'KCAL'); 

          //合計たんぱく質の箱
          let totalProtein = 0;

          for (let i = 0; i < other.length; i++) {
            if (other[i].nutrients?.Protein) {
              totalProtein = totalProtein + other[i].nutrients.Protein;
            }
          }

          totalProtein = Math.round(totalProtein);

          console.log('合計P:', totalProtein);
          $('#sumOtherProtein span').html('P:', totalProtein,'G'); 

          //合計脂質の箱
          let totalFat = 0;

          for (let i = 0; i < other.length; i++) {
            if (other[i].nutrients?.['Total lipid (fat)']) {
              totalFat = totalFat + other[i].nutrients['Total lipid (fat)'];
            }
          }

          totalFat = Math.round(totalFat);

          console.log('合計F:', totalFat);
          $('#sumOtherFat span').html('F:', totalFat, 'G'); 

          // 合計炭水化物の箱
          let totalCarbohydrate = 0;

          for (let i = 0; i < other.length; i++) {
            if (other[i].nutrients?.['Carbohydrate, by difference']) {
              totalCarbohydrate = totalCarbohydrate + other[i].nutrients['Carbohydrate, by difference'];
            }
          }

          totalCarbohydrate = Math.round(totalCarbohydrate);

          console.log('合計C:', totalCarbohydrate);
          $('#sumOtherCarb span').html('C:', totalCarbohydrate, 'G'); 


          const json = JSON.stringify(other);//JSON形式に変換
          console.log(json);

          localStorage.setItem('meal_4', json);//ローカルストレージに保存

          // おやつエリアを再描画
          renderOther(other);

          //呼び出し
          calculateDailyTotal();

          alert('おやつを保存しました');
        });


      })
      .catch(function(error) {//うまくいかんかったら
        console.log(error);
        console.log('status:', error.response?.status);
        console.log('data:', error.response?.data);
      });
    });  

function renderMorning(morning) {
  let html = ''; // 表示用HTMLを初期化

  //合計用の箱
  let totalEnergy = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbohydrate = 0;

  for (let i = 0; i < morning.length; i++) {
    html += `
      <div class="mealItem" data-id="${morning[i].id}">
        <div class="foodName">${morning[i].inputText}</div>
        <div class="nutrients">
          ${morning[i].elements.join('')}
        </div>
      </div>
    `;        
    // 合計計算 
    const n = morning[i].nutrients;

    if (n?.Energy) totalEnergy += n.Energy;
    if (n?.Protein) totalProtein += n.Protein;
    if (n?.['Total lipid (fat)']) totalFat += n['Total lipid (fat)'];
    if (n?.['Carbohydrate, by difference']) {
      totalCarbohydrate += n['Carbohydrate, by difference'];
    }
  }

  // 小数点以下四捨五入
  totalEnergy = Math.round(totalEnergy);
  totalProtein = Math.round(totalProtein);
  totalFat = Math.round(totalFat);
  totalCarbohydrate = Math.round(totalCarbohydrate);

  $('#morningArea').html(html);

  //合計の表示
  $('#sumMorningEnergy span').html(totalEnergy);
  $('#sumMorningProtein span').html(totalProtein);
  $('#sumMorningFat span').html(totalFat);
  $('#sumMorningCarb span').html(totalCarbohydrate);
  
  $('#morningArea .mealItem').on('click', function () {
    currentFoodId = $(this).data('id');
    console.log('選択中ID:', currentFoodId);

    $('#morningArea .mealItem').removeClass('selected');
    $(this).addClass('selected');
  });
}

  //読み込み時にデータの取得
  if (localStorage.getItem('meal_1')){
    const json = localStorage.getItem('meal_1')
    console.log(json);

    const morning = JSON.parse(json);//オブジェクトに戻す
    renderMorning(morning);
    
    //呼び出し
    calculateDailyTotal();

  }

  //削除ボタンクリックアクション
  $('#deleteMorningButton').on('click', function () {
    if (currentFoodId == null) {
      alert('削除する食べ物を選択してください');
      return;
    }

    if (!confirm('選択した食べ物を削除しますか？')) {
      return;
    }

    let morning;

    // localStorage から取得
    if (localStorage.getItem('meal_1')){
      morning = JSON.parse(localStorage.getItem('meal_1'));

    // IDが一致しないものだけ残す=一致したものだけ取り出す
    morning = morning.filter(
      (food) => food.id !== Number(currentFoodId)
    );

    // 保存し直す
    localStorage.setItem('meal_1', JSON.stringify(morning));

    // 再描画
    renderMorning(morning);

    // 選択解除
    currentFoodId = null;
    alert('1件削除しました');

    //呼び出し
    calculateDailyTotal();
  }
  });        


//昼
function renderLunch(lunch) {
  let html = ''; // 表示用HTMLを初期化

  //合計用の箱
  let totalEnergy = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbohydrate = 0;

  for (let i = 0; i < lunch.length; i++) {
    html += `
      <div class="mealItem" data-id="${lunch[i].id}">
        <div class="foodName">${lunch[i].inputText}</div>
        <div class="nutrients">
          ${lunch[i].elements.join('')}
        </div>
      </div>
    `;        
    // 合計計算 
    const n = lunch[i].nutrients;

    if (n?.Energy) totalEnergy += n.Energy;
    if (n?.Protein) totalProtein += n.Protein;
    if (n?.['Total lipid (fat)']) totalFat += n['Total lipid (fat)'];
    if (n?.['Carbohydrate, by difference']) {
      totalCarbohydrate += n['Carbohydrate, by difference'];
    }
  }

  // 小数点以下四捨五入
  totalEnergy = Math.round(totalEnergy);
  totalProtein = Math.round(totalProtein);
  totalFat = Math.round(totalFat);
  totalCarbohydrate = Math.round(totalCarbohydrate);

  $('#lunchArea').html(html);

  //合計の表示
  $('#sumLunchEnergy span').html(totalEnergy);
  $('#sumLunchProtein span').html(totalProtein);
  $('#sumLunchFat span').html(totalFat);
  $('#sumLunchCarb span').html(totalCarbohydrate);

  $('#lunchArea .mealItem').on('click', function () {
    currentFoodId = $(this).data('id');
    console.log('選択中ID:', currentFoodId);

    $('#lunchArea .mealItem').removeClass('selected');
    $(this).addClass('selected');
  });
}

  //読み込み時にデータの取得
  if (localStorage.getItem('meal_2')){
    const json = localStorage.getItem('meal_2')
    console.log(json);

    const lunch = JSON.parse(json);//オブジェクトに戻す
    renderLunch(lunch);

    //呼び出し
    calculateDailyTotal();

  }

  //削除ボタンクリックアクション
$('#deleteLunchButton').on('click', function () {
  if (currentFoodId == null) {
    alert('削除する食べ物を選択してください');
    return;
  }

  if (!confirm('選択した食べ物を削除しますか？')) {
    return;
  }

  let lunch;

  // localStorage から取得
  if (localStorage.getItem('meal_2')){
    lunch = JSON.parse(localStorage.getItem('meal_2'));

  // IDが一致しないものだけ残す
  lunch = lunch.filter(
    (food) => food.id !== Number(currentFoodId)
  );

  // 保存し直す
  localStorage.setItem('meal_2', JSON.stringify(lunch));

  // 再描画
  renderLunch(lunch);

  // 選択解除
  currentFoodId = null;
  alert('1件削除しました');

  //呼び出し
  calculateDailyTotal();
}
});        



function renderDinner(dinner) {
  let html = ''; // 表示用HTMLを初期化

  //合計用の箱
  let totalEnergy = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbohydrate = 0;

  for (let i = 0; i < dinner.length; i++) {
    html += `
      <div class="mealItem" data-id="${dinner[i].id}">
        <div class="foodName">${dinner[i].inputText}</div>
        <div class="nutrients">
          ${dinner[i].elements.join('')}
        </div>
      </div>
    `;        
    // 合計計算 
    const n = dinner[i].nutrients;

    if (n?.Energy) totalEnergy += n.Energy;
    if (n?.Protein) totalProtein += n.Protein;
    if (n?.['Total lipid (fat)']) totalFat += n['Total lipid (fat)'];
    if (n?.['Carbohydrate, by difference']) {
      totalCarbohydrate += n['Carbohydrate, by difference'];
    }
  }

  // 小数点以下四捨五入
  totalEnergy = Math.round(totalEnergy);
  totalProtein = Math.round(totalProtein);
  totalFat = Math.round(totalFat);
  totalCarbohydrate = Math.round(totalCarbohydrate);

  $('#dinnerArea').html(html);

  //合計の表示
  $('#sumDinnerEnergy span').html(totalEnergy);
  $('#sumDinnerProtein span').html(totalProtein);
  $('#sumDinnerFat span').html(totalFat);
  $('#sumDinnerCarb span').html(totalCarbohydrate);

  $('#dinnerArea .mealItem').on('click', function () {
    currentFoodId = $(this).data('id');
    console.log('選択中ID:', currentFoodId);

    $('#dinnerArea .mealItem').removeClass('selected');
    $(this).addClass('selected');
  });

}

  //読み込み時にデータの取得
  if (localStorage.getItem('meal_3')){
    const json = localStorage.getItem('meal_3')
    console.log(json);

    const dinner = JSON.parse(json);//オブジェクトに戻す
    renderDinner(dinner);

    //呼び出し
    calculateDailyTotal();
 
  }

  //削除ボタンクリックアクション
$('#deleteDinnerButton').on('click', function () {
  if (currentFoodId == null) {
    alert('削除する食べ物を選択してください');
    return;
  }

  if (!confirm('選択した食べ物を削除しますか？')) {
    return;
  }

  let dinner;

  // localStorage から取得
  if (localStorage.getItem('meal_3')){
    dinner = JSON.parse(localStorage.getItem('meal_3'));

  // IDが一致しないものだけ残す
  dinner = dinner.filter(
    (food) => food.id !== Number(currentFoodId)
  );

  // 保存し直す
  localStorage.setItem('meal_3', JSON.stringify(dinner));

  // 再描画
  renderDinner(dinner);

  // 選択解除
  currentFoodId = null;
  alert('1件削除しました');

  //呼び出し
  calculateDailyTotal();
}
});        



function renderOther(other) {
  let html = ''; // 表示用HTMLを初期化
  
  //合計用の箱
  let totalEnergy = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbohydrate = 0;


  for (let i = 0; i < other.length; i++) {
    html += `
      <div class="mealItem" data-id="${other[i].id}">
        <div class="foodName">${other[i].inputText}</div>
        <div class="nutrients">
          ${other[i].elements.join('')}
        </div>
      </div>
    `;        

    // 合計計算 
    const n = other[i].nutrients;

    if (n?.Energy) totalEnergy += n.Energy;
    if (n?.Protein) totalProtein += n.Protein;
    if (n?.['Total lipid (fat)']) totalFat += n['Total lipid (fat)'];
    if (n?.['Carbohydrate, by difference']) {
      totalCarbohydrate += n['Carbohydrate, by difference'];
    }
  }

  // 小数点以下四捨五入
  totalEnergy = Math.round(totalEnergy);
  totalProtein = Math.round(totalProtein);
  totalFat = Math.round(totalFat);
  totalCarbohydrate = Math.round(totalCarbohydrate);

  $('#otherArea').html(html);

  //合計の表示
  $('#sumOtherEnergy span').html(totalEnergy);
  $('#sumOtherProtein span').html(totalProtein);
  $('#sumOtherFat span').html(totalFat);
  $('#sumOtherCarb span').html(totalCarbohydrate);

  $('#otherArea .mealItem').on('click', function () {
    currentFoodId = $(this).data('id');
    console.log('選択中ID:', currentFoodId);

    $('#otherArea .mealItem').removeClass('selected');
    $(this).addClass('selected');
  });
}

  //読み込み時にデータの取得
  if (localStorage.getItem('meal_4')){
    const json = localStorage.getItem('meal_4')
    console.log(json);

    const other = JSON.parse(json);//オブジェクトに戻す
    renderOther(other);

    //呼び出し
    calculateDailyTotal();

  }

    //削除ボタンクリックアクション
  $('#deleteOtherButton').on('click', function () {
    if (currentFoodId == null) {
      alert('削除する食べ物を選択してください');
      return;
    }

    if (!confirm('選択した食べ物を削除しますか？')) {
      return;
    }

    let other;

    // localStorage から取得
    if (localStorage.getItem('meal_4')){
      other = JSON.parse(localStorage.getItem('meal_4'));

    // IDが一致しないものだけ残す
    other = other.filter(
      (food) => food.id !== Number(currentFoodId)
    );

    // 保存し直す
    localStorage.setItem('meal_4', JSON.stringify(other));

    // 再描画
    renderOther(other);

    // 選択解除
    currentFoodId = null;
    alert('1件削除しました');

    //呼び出し
    calculateDailyTotal();
  }
});

function calculateDailyTotal() {
  //ローカルストレージのKeyを配列に入れる
  const mealKeys = ['meal_1', 'meal_2', 'meal_3', 'meal_4'];

  //合計用の箱
  let totalEnergy = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbohydrate = 0;

  //mealKeysの中身（meal_1~4）を順番に取ってローカルストレージの中身（文字列）を取得
  for (const key of mealKeys) {
    const json = localStorage.getItem(key);
    if (!json) continue;//jsonがない時は次へ進む

    //オブジェクトに戻す
    const meals = JSON.parse(json);

    //オブジェクト内のnutrientsをnに入れる
    for (const meal of meals) {
      const n = meal.nutrients;
      if (!n) continue;//nがない時は次へ進む

      //()が0,null,undefinedじゃないときに実行
      if (n.Energy) totalEnergy += n.Energy;//Energyがあれば合計する
      if (n.Protein) totalProtein += n.Protein;//Proteinがあれば合計する
      if (n['Total lipid (fat)']) totalFat += n['Total lipid (fat)'];//Total lipid (fat)があれば合計する
      if (n['Carbohydrate, by difference']) {
        totalCarbohydrate += n['Carbohydrate, by difference'];//Carbohydrate, by differenceがあれば合計する
      }
    }
  }

  // 四捨五入
  totalEnergy = Math.round(totalEnergy);
  totalProtein = Math.round(totalProtein);
  totalFat = Math.round(totalFat);
  totalCarbohydrate = Math.round(totalCarbohydrate);

  // 表示
  $('#calorie span').html(totalEnergy);
  $('#protein span').html(totalProtein);
  $('#fat span').html(totalFat);
  $('#carbo span').html(totalCarbohydrate);
}

//呼び出し
calculateDailyTotal();