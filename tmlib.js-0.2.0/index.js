// TODO: ここにコードを書いていく
tm.main(function() {
    // アプリケーションクラスを生成
    var app = tm.display.CanvasApp("#world");
    
    // スターを生成してシーンに追加
    var star = tm.display.StarShape().addChildTo(app.currentScene);
    // 位置をセット
    star.setPosition(150, 75);
    // 更新処理を登録
    star.update = function() {
        // 回転
        this.rotation += 8;
    };
    
    // 実行
    app.run();
});
