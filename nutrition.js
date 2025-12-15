// 登録された食べ物データ
let foods = [];

// 現在選択中の食べ物ID
let currentFoodId = null;


$('#searchButton').on('click', function(){
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


  axios.post(`${translateUrl}?key=${apiKey}`,
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
            }
          }
        console.log(elements);

        $('#output').html(elements.join(''));//カンマなし

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
            inputText:inputText,
            elements:elements,
          });
          console.log(morning);

          const json = JSON.stringify(morning);//JSON形式に変換
          console.log(json);

          localStorage.setItem('meal_1', json);//ローカルストレージに保存

          // 朝食エリアを再描画
          renderMorning(morning);
          // $('#morningArea').html(inputText + elements.join(''));//表示

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
            inputText:inputText,
            elements:elements,
          });
          console.log(lunch);

          const json = JSON.stringify(lunch);//JSON形式に変換
          console.log(json);

          localStorage.setItem('meal_2', json);//ローカルストレージに保存

          // 昼食エリアを再描画
          renderLunch(lunch);

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
            inputText:inputText,
            elements:elements,
          });
          console.log(dinner);

          const json = JSON.stringify(dinner);//JSON形式に変換
          console.log(json);

          localStorage.setItem('meal_3', json);//ローカルストレージに保存

          // 夕食エリアを再描画
          renderDinner(dinner);

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
            inputText:inputText,
            elements:elements,
          });
          console.log(other);

          const json = JSON.stringify(other);//JSON形式に変換
          console.log(json);

          localStorage.setItem('meal_4', json);//ローカルストレージに保存

          // おやつエリアを再描画
          renderOther(other);

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

  for (let i = 0; i < morning.length; i++) {
    html += `
      <div class="mealItem" data-id="${morning[i].id}">
        <div class="foodName">${morning[i].inputText}</div>
        <div class="nutrients">
          ${morning[i].elements.join('')}
        </div>
      </div>
    `;        
  }
    $('#morningArea').html(html);

    $('.mealItem').on('click', function () {
    currentFoodId = $(this).data('id');
    console.log('選択中ID:', currentFoodId);

    $('.mealItem').removeClass('selected');
    $(this).addClass('selected');
  });
}

    //   if (localStorage.getItem('meal_1')){
    //     const json = localStorage.getItem('meal_1')
    //     console.log(json);

    //     const morningFood = JSON.parse(json);//オブジェクトに戻す
    //     const summedMorningFood = morningFood.reduce((accumulator,currentItem) => {
    //         if (accumulator[currentItem.name]) {
    //     })
    // }

  //読み込み時にデータの取得
  if (localStorage.getItem('meal_1')){
    const json = localStorage.getItem('meal_1')
    console.log(json);

    const morning = JSON.parse(json);//オブジェクトに戻す
    renderMorning(morning);
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

    // IDが一致しないものだけ残す
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
  }
  });        


//昼
function renderLunch(lunch) {
  let html = ''; // 表示用HTMLを初期化

  for (let i = 0; i < lunch.length; i++) {
    html += `
      <div class="mealItem" data-id="${lunch[i].id}">
        <div class="foodName">${lunch[i].inputText}</div>
        <div class="nutrients">
          ${lunch[i].elements.join('')}
        </div>
      </div>
    `;        
  }
  $('#lunchArea').html(html);
  $('.mealItem').on('click', function () {
    currentFoodId = $(this).data('id');
    console.log('選択中ID:', currentFoodId);

    $('.mealItem').removeClass('selected');
    $(this).addClass('selected');
  });
}

  //読み込み時にデータの取得
  if (localStorage.getItem('meal_2')){
    const json = localStorage.getItem('meal_2')
    console.log(json);

    const lunch = JSON.parse(json);//オブジェクトに戻す
    renderLunch(lunch);
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
  renderMorning(lunch);

  // 選択解除
  currentFoodId = null;
  alert('1件削除しました');
}
});        



function renderDinner(dinner) {
  let html = ''; // 表示用HTMLを初期化

  for (let i = 0; i < dinner.length; i++) {
    html += `
      <div class="mealItem" data-id="${dinner[i].id}">
        <div class="foodName">${dinner[i].inputText}</div>
        <div class="nutrients">
          ${dinner[i].elements.join('')}
        </div>
      </div>
    `;        
  }
  $('#dinnerArea').html(html);
  $('.mealItem').on('click', function () {
    currentFoodId = $(this).data('id');
    console.log('選択中ID:', currentFoodId);

    $('.mealItem').removeClass('selected');
    $(this).addClass('selected');
  });

}

  //読み込み時にデータの取得
  if (localStorage.getItem('meal_3')){
    const json = localStorage.getItem('meal_3')
    console.log(json);

    const dinner = JSON.parse(json);//オブジェクトに戻す
    renderDinner(dinner);
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
  renderMorning(dinner);

  // 選択解除
  currentFoodId = null;
  alert('1件削除しました');
}
});        



  function renderOther(other) {
    let html = ''; // 表示用HTMLを初期化

    for (let i = 0; i < other.length; i++) {
      html += `
        <div class="mealItem" data-id="${other[i].id}">
          <div class="foodName">${other[i].inputText}</div>
          <div class="nutrients">
            ${other[i].elements.join('')}
          </div>
        </div>
      `;        
    }
    $('#otherArea').html(html);
    $('.mealItem').on('click', function () {
      currentFoodId = $(this).data('id');
      console.log('選択中ID:', currentFoodId);

      $('.mealItem').removeClass('selected');
      $(this).addClass('selected');
    });
  }

    //読み込み時にデータの取得
    if (localStorage.getItem('meal_4')){
      const json = localStorage.getItem('meal_4')
      console.log(json);

      const other = JSON.parse(json);//オブジェクトに戻す
      renderOther(other);
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
    renderMorning(other);

    // 選択解除
    currentFoodId = null;
    alert('1件削除しました');
  }
});

