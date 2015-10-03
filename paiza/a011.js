
window.addEventListener("load", function () {
	console.time("Loading Time") ;
	
	var submitButtonEle = document.getElementById("doItButton") ;
	submitButtonEle.addEventListener("click", function(){
		// console.log("押されました") ;
		var inputAreaEle = document.getElementById("inputArea") ;
		console.log("input = " + inputAreaEle.value) ;
		doIt(inputAreaEle.value) ;
	}, false) ;
	
	function doIt(chunk){					 
		if(chunk === undefined || chunk.search(/[^\s]+/m) === -1 ){
			// 空白以外の文字があるなら、id = "miku" の中身を代入
			if(document.getElementById("miku").textContent.search(/[^\s]+/m) !== -1){
				chunk = document.getElementById("miku").textContent ;
			}else{
				console.log("**Error** no input") ;
				return (-1) ;
			}
		}
		console.log("chunk = " + chunk) ;

		/* 末尾の無駄な半角スペースとTab、無駄な改行は削る */
		chunk = chunk.replace(/([ \t]{1,}|\s)+$/gm, "") ;
		
		/* 入力は入力フォームに入れるか、html の miku div 内に入れる */
		/* 以下をコピーする */
		
		/* 2015/10/1   +   10/03（再挑戦）      *
		 * A011 : うなぎを蒲焼きにしたくない        */
		/* 2d+1 個(d = inputNumber[0])のボックスがあり、真ん中に最初居る。
		 * 指定された回数(inputNumber[1])、
		 * 指定された距離(inputNumber[2~])を移動しても、
		 * ボックスから落ちないようにする */

		var inputNumber = chunk.split(/[ \n]/) ;
		
		for(var i = 0; i < inputNumber.length ; ++i){
			inputNumber[i] = Number(inputNumber[i]) ;
		} ;

		var limitAbsolute = inputNumber[0] ;
		var shouldMoveTimes = inputNumber[1] ; // 動かす回数
		var moveLength = new Array() ;
		for(var i = 0; i < shouldMoveTimes; ++i){
			moveLength[i] = inputNumber[i + 2] ;
		} ;

		var choices = [] ;
		var answer = [] ;

		move(0, 0, shouldMoveTimes) ;
		
		function move(_currentPoint, _currentTimes, _shouldMoveTimes){
			if(answer.length > 0){return 0 ;}  // 解が一つでも出れば今回はおしまい
			if(_currentTimes === _shouldMoveTimes){
				// console.log("END: " + choices ) ;
				answer.push(choices.concat()) ;
				choices.pop() ;
			}else{
				if( checkCanMoveRight(_currentPoint, _currentTimes) ){
					choices.push("R") ;
					move( _currentPoint + moveLength[_currentTimes], _currentTimes + 1, _shouldMoveTimes) ;
				}
				if( checkCanMoveLeft(_currentPoint, _currentTimes) ){
					choices.push("L") ;
					move( _currentPoint - moveLength[_currentTimes], _currentTimes + 1, _shouldMoveTimes) ;
				}
				choices.pop() ;
			}
		} ;
		
		/* 右に動かせるか見る */
		function checkCanMoveRight(_currentPoint, _currentTimes){
			if(_currentPoint + moveLength[_currentTimes] > limitAbsolute){
				return false ;
			}else{
				return true ;
			}
		} ;

		/* 左に動かせるか見る */
		function checkCanMoveLeft(_currentPoint, _currentTimes){
			if(_currentPoint - moveLength[_currentTimes] < limitAbsolute * (-1) ){
				return false ;
			}else{
				return true ;
			}
		} ;

		console.log( answer[0].join("") ) ;

		/* 以上をコピーする */
		var outputElement = document.getElementById("output") ;
		outputElement.innerHTML = answer ;  // outputElementment に出力
		
		console.log("A. " + answer[0] + answer[1]) ;
		console.log("end") ;

		return 0 ;
	} ;
	
	doIt() ;
	console.timeEnd("Loading Time") ;

}, false) ;
