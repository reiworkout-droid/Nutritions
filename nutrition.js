


$('#searchButton').on('click', function(){
//入力内容の取得
  const inputText = $('#form').val().trim();
  if(!inputText) return;

  // 日本語表記用対応表
  const NUTRIENT_LABELS_JA = {
    'Energy': 'エネルギー',
    'Protein': 'たんぱく質',
    'Total lipid (fat)': '脂質',
    'Carbohydrate, by difference': '炭水化物'
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
      })
      .catch(function(error) {//うまくいかんかったら
        console.log(error);
        console.log('status:', error.response?.status);
        console.log('data:', error.response?.data);
      });
    });  

  // 朝食に保存
