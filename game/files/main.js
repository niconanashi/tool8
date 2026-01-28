module.exports={assets:{"main": {type:"script",path:"script/main.js",global:true,execute: rv => {
'use strict';
const module = rv.module;const exports = module.exports;const require = module.require;const __dirname = rv.dirname;const __filename = rv.filename;
function main(param) {
  var TOTAL_MUSIC_DURATION = 90000; // ★音楽の総時間をミリ秒で入力（例: 60秒なら 60000）
  var MAX_IMAGES = 20; // 使用する画像の枚数
  var FADE_SPEED = 0.02; // フェードインのスピード
  var FADE_SPEED2 = 0.1; // 下画像のフェードアウトのスピード
  var IMAGE_IDS = ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20"];

  // ==========================================
  // 1枚あたりの割り当て時間
  var timePerImage = TOTAL_MUSIC_DURATION / MAX_IMAGES;
  var fps = 30;
  var fadeTimeMs = 1 / FADE_SPEED * (1000 / fps);

  // 1枚あたりの時間からフェード時間を引く
  var calculatedDuration = timePerImage - fadeTimeMs;

  // 万が一計算結果がマイナス（フェード速度が遅すぎる場合）は最小値を設定
  if (calculatedDuration < 0) calculatedDuration = 0;
  g.game.audio.music.volume = 0.9;
  var scene = new g.Scene({
    game: g.game,
    assetPaths: ["/**/*"]
  });
  var font = new g.DynamicFont({
    game: g.game,
    fontFamily: "sans-serif",
    fontColor: "white",
    strokeColor: "black",
    strokeWidth: 5,
    size: 60
  });
  scene.onLoad.add(function () {
    if (scene.asset.getAudioById("bgm")) {
      scene.asset.getAudioById("bgm").play();
    }
    var currentIndex = 0;
    var currentSprite = null;
    function showNextSlide() {
      if (currentIndex >= MAX_IMAGES || currentIndex >= IMAGE_IDS.length) {
        showEndMessage();
        return;
      }
      var nextSprite = new g.Sprite({
        scene: scene,
        src: scene.asset.getImageById(IMAGE_IDS[currentIndex]),
        opacity: currentIndex === 0 ? 1 : 0,
        parent: scene
      });
      if (currentIndex === 0) {
        // 1枚目は最初から表示されているので、丸々1枚分の時間を待つ
        currentSprite = nextSprite;
        startTimer(timePerImage);
      } else {
        var prevSprite = currentSprite;
        nextSprite.onUpdate.add(function () {
          if (nextSprite.opacity < 1) {
            nextSprite.opacity += FADE_SPEED;
            if (nextSprite.opacity > 1) nextSprite.opacity = 1;
            nextSprite.modified();
          } else {
            // フェード完了
            nextSprite.onUpdate.removeAll();
            prevSprite.onUpdate.add(function () {
              prevSprite.opacity -= FADE_SPEED2;
              if (prevSprite.opacity <= 0) {
                prevSprite.destroy();
              } else {
                prevSprite.modified();
              }
            });
            currentSprite = nextSprite;
            // 静止時間の待機を開始
            startTimer(calculatedDuration);
          }
        });
      }
    }

    // 指定時間待機してから次の画像へ
    function startTimer(duration) {
      scene.setTimeout(function () {
        currentIndex++;
        showNextSlide();
      }, duration);
    }
    function showEndMessage() {
      var label = new g.Label({
        scene: scene,
        font: font,
        text: "ご視聴ありがとうございました。",
        x: g.game.width / 2,
        y: g.game.height / 2,
        anchorX: 0.5,
        anchorY: 0.5,
        fontSize: 60,
        parent: scene
      });
    }
    showNextSlide();
  });
  g.game.pushScene(scene);
}
module.exports = main;
return module.exports;
},
},"data": {type:"text",path:"text/data.json",data: `{}`,
},}}
