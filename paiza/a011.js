
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

		
		/* 入力は入力フォームに入れるか、html の miku div 内に入れる */
		/* 以下をコピーする */
		
		/* 2015/ 10/ 1        *
		 * A011 : うなぎを蒲焼きにしたくない        */
		/* 2d+1 個(d = inputNumber[0])のボックスがあり、真ん中に最初居る。
		 * 指定された回数(inputNumber[1])、
		 * 指定された距離(inputNumber[2~])を移動しても、
		 * ボックスから落ちないようにする */

		/* 末尾の無駄な半角スペースとTab、無駄な改行は削る */
		chunk = chunk.replace(/([ \t]{1,}|\s)+$/gm, "") ;
		var inputNumber = chunk.toString().split(/[ \n]/) ;
		
		for(var i = 0; i < inputNumber.length ; ++i){
			inputNumber[i] = parseFloat(inputNumber[i].match(/[0-9]+/)) ;
		} ;

		var limitAbsolute = inputNumber[0] ;
		var shouldMoveTimes = inputNumber[1] ;
		var moveLength = new Array() ;
		for(var i = 0; i < shouldMoveTimes; ++i){
			moveLength[i] = inputNumber[i + 2] ;
		} ;

		this.currentPoint = 0 ; // -limitAbsolute ~ limitAbsolute 移動できる
		this.answer = [] ;

		/* はじっこにいるとき、逆方向に動くしかない */
		function ifEdge(_moveLength){
			if(this.currentPoint > 0){
				this.currentPoint -= _moveLength ;
				return "L" ;
			}else{
				this.currentPoint += _moveLength ;
				return "R" ;
			}
		} ;

		/* 右に動かせるか見る */
		function checkCanMoveRight(_currentPoint, _moveLength){
			var currentPoint = _currentPoint ;
			var moveLength  = _moveLength ;
			if(this.currentPoint + moveLength > limitAbsolute){
				return false ;
			}else{
				return true ;
			}
		} ;

		/* 左に動かせるか見る */
		function checkCanMoveLeft(_currentPoint, _moveLength){
			var currentPoint = _currentPoint ;
			var moveLength  = _moveLength ;
			if(currentPoint - moveLength < limitAbsolute * (-1) ){
				return false ;
			}else{
				return true ;
			}
		} ;

		function backUntilCannotMove(_oldPointArray, _progress, _endProgress){
			var memoryOldPoint = new Array() ;
			memoryOldPoint = memoryOldPoint.concat(_oldPointArray) ;
			console.log(memoryOldPoint) ;
			var currentProgress = _progress - 1 ;
			var endProgress = _endProgress ;
			for(var i = 0; i < memoryOldPoint.length; ++i){
				while(currentProgress < endProgress){
					if( test(memoryOldPoint, currentProgress) ){
						++currentProgress ;
					}else{
						--currentProgress ;
					}
				}
			}
			return memoryOldPoint ;
		} ;

		function test(_oldPointArray, _progress){
			var memoryOldPoint = new Array() ;
			memoryOldPoint = memoryOldPoint.concat(_oldPointArray) ;
			var currentProgress = _progress ;
			var currentPoint = memoryOldPoint[0] ;
			memoryOldPoint.shift() ;
			console.log("現位置：" + currentPoint + ", progress= " + currentProgress) ;
			console.log("currentProgress= " + currentProgress + ", currentPoint= " + currentPoint) ;
			if( checkCanMoveLeft(currentPoint, moveLength[currentProgress]) ){
				currentPoint -= moveLength[currentProgress++] ;
				this.answer.pop() ;
				this.answer.push("L") ;
				memoryOldPoint.unshift(currentPoint) ;
				if( checkCanMoveRight(currentPoint, moveLength[currentProgress]) ){
					currentPoint += moveLength[currentProgress++] ;
					this.answer.push("R") ;
					memoryOldPoint.unshift(currentPoint) ;
				}else if( checkCanMoveLeft(currentPoint, moveLength[currentProgress]) ){
					currentPoint -= moveLength[currentProgress++] ;
					this.answer.push("L") ;
					memoryOldPoint.unshift(currentPoint) ;
				}else{
					/* 右にも左にも動かせないとき */
					return false ;
				}
			}else{
				return false ;
			}

			return true ;
				
			console.log(memoryOldPoint) ;
		} ;
		
		var progress = 0 ;
		var canMoveRight = new Array ;
		var memoryOldPoint = new Array() ;
		while(progress < shouldMoveTimes){
			// console.log(progress) ;
			memoryOldPoint.unshift(this.currentPoint) ;
			if(Math.abs(this.currentPoint) === limitAbsolute){
				this.answer.push( ifEdge(moveLength[progress++]) ) ;
			}else{

				/* TODO: 肝心の、端っこじゃないときの移動法アルゴリズムが設計できず断念 */
				if( checkCanMoveRight(this.currentPoint, moveLength[progress]) ){
					this.currentPoint += moveLength[progress++] ;
					this.answer.push("R") ;
				}else if( checkCanMoveLeft(this.currentPoint, moveLength[progress]) ){
					this.currentPoint -= moveLength[progress++] ;
					this.answer.push("L") ;
				}else{
						console.log("###") ;
					/* 右にも左にも動かせないとき */
					memoryOldPoint = backUntilCannotMove(memoryOldPoint, progress, progress) ;
				}
			}
			console.log(memoryOldPoint) ;
		} ;
		
		/* 以上をコピーする */
		var outputElement = document.getElementById("output") ;
		outputElement.innerHTML = "something" ;  // outputElementment に出力
		
		console.log(moveLength) ;
		console.log("end") ;
		console.log("A. " + this.answer) ;

		return 0 ;
	} ;
	
	doIt() ;
	console.timeEnd("Loading Time") ;

}, false) ;
