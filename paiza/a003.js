
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
		// console.log("chunk = " + chunk) ;

		/* 末尾の無駄な半角スペースとTab、無駄な改行は削る */
		chunk = chunk.replace(/([ \t]{1,}|\s)+$/gm, "") ;
		
		/* 入力は入力フォームに入れるか、html の miku div 内に入れる */
		/* 以下をコピーする */
		
		/* 2015/10/03             *
		 * A003 : リバーシ        */
		/* 8x8 の盤面上でのオセロ、ログからどっちが勝ったか見る */
		var inputNumber = chunk.split(/[ \n]/) ;
		
		for(var i = 0; i < inputNumber.length ; ++i){
			if(i % 3 !== 1){
				inputNumber[i] = Number(inputNumber[i]) ;
			}
		} ;

		var logQuantity = inputNumber[0] ;

		var logProperties = [] ;
		for(var i = 0; i < logQuantity; ++i){
			logProperties[i] = new LogProperty(inputNumber[i*3 +1], inputNumber[i*3 +2], inputNumber[i*3 +3]) ;
		}

		var squareProperty = [] ;
		for(var x = 1; x <= 8; ++x){
			squareProperty[x] = [] ;
			for(var y = 1; y <= 8; ++y){
				squareProperty[x][y] = 0 ; // 0 means None
			}
		}

		/* 初期状態 */
		squareProperty[4][4] = 1 ; // 1 means White
		squareProperty[4][5] = -1 ; // (-1) means Black
		squareProperty[5][4] = -1 ;
		squareProperty[5][5] = 1 ;
		// console.log(squareProperty) ;

		var targetSquare = [] ;

		for(var logId = 0; logId < logQuantity; ++logId){
			squareProperty[ logProperties[logId].x ][ logProperties[logId].y ] = logProperties[logId].color ;
			for(var direction = 0; direction < 8; ++direction){
				searchAround(logProperties[logId].color, logProperties[logId].x, logProperties[logId].y, direction) ;
			}
		}

		function searchAround(_myColor, _x, _y, _direction){
			switch(_direction){  // 時計回りで 12時を 0 とした 8 方向
			case 0 :
				controlTargets(_myColor, _x, (_y - 1), _direction) ;
				break ;
			case 1 :
				controlTargets(_myColor, (_x + 1), (_y - 1), _direction) ;
				break ;
			case 2 :
				controlTargets(_myColor, (_x + 1), _y, _direction) ;
				break ;
			case 3 :
				controlTargets(_myColor, (_x + 1), (_y + 1), _direction) ;
				break ;
			case 4 :
				controlTargets(_myColor, _x, (_y + 1), _direction) ;
				break ;
			case 5 :
				controlTargets(_myColor, (_x - 1), (_y + 1), _direction) ;
				break ;
			case 6 :
				controlTargets(_myColor, (_x - 1), _y, _direction) ;
				break ;
			case 7 :
				controlTargets(_myColor, (_x - 1), (_y - 1), _direction) ;
				break ;
			}
		} ;

		function controlTargets(_myColor, _x, _y, _direction){
			if(_x < 1 || _x >8 || _y < 1 || _y > 8){
				targetSquare = [] ;
				return false ;
			}
			switch(squareProperty[_x][_y]){
			case _myColor :
				if(targetSquare[0] !== undefined){
					changeColor(_myColor) ;
				}
				targetSquare = [] ;
				break ;
			case (_myColor * -1) :
				targetSquare.push([_x, _y]) ;
				// console.log(targetSquare) ;
				searchAround(_myColor, _x, _y, _direction) ;
				break ;
			case 0 :
				targetSquare = [] ;
				break ;
			}
			return true ;
		} ;

		function changeColor(_myColor){
			for(var i = 0; i < targetSquare.length; ++i){
				// console.log(targetSquare[i]) ;
				squareProperty[ targetSquare[i][0] ][ targetSquare[i][1] ] = _myColor ;
			}
		} ;
		
		function LogProperty(_color, _x, _y){
			if(_color === "W"){
				this.color = 1 ;
			}else if(_color === "B"){
				this.color = -1 ;
			}else if(_color === "N"){
				this.color = 0 ;
			}
			this.x = _x ;
			this.y = _y ;
		} ;

		function countPiece(_myColor){
			var myPiece = 0 ;
			var enemyPiece = 0 ;
			var blankSquare = 0 ;
			
			for(var x = 1; x <= 8; ++x){
				for(var y = 1; y <= 8; ++y){
					switch(squareProperty[x][y]){
					case _myColor :
						++myPiece ;
						break ;
					case 0 :
						++blankSquare ;
						break ;
					case (_myColor * -1) :
						++enemyPiece ;
						break ;
					}
				}
			}
			// console.log("mine: " + myPiece + ", enemy: " + enemyPiece + ", blank: " + blankSquare ) ;

			return { mine : myPiece, enemy : enemyPiece, blank : blankSquare } ;
		} ;

		function fillZero(_value, _digits){
			var addZero = _digits - String(_value).length ;
			var string = "" ;
			for(var i = 0; i < addZero; ++i){
				string += '0' ;
			}
			string += _value ;

			return string ;
		} ;

		var resultProperty = [] ;
		resultProperty = countPiece(/*Black =*/-1) ;

		var answer = fillZero(resultProperty.mine, 2) + "-" + fillZero(resultProperty.enemy, 2) ;
		if(resultProperty.mine > resultProperty.enemy){
			answer += " The black won!" ;
		}else if(resultProperty.enemy > resultProperty.mine){
			answer += " The white won!" ;
		}else{
			answer += " Draw!" ;
		}

		console.log(answer) ;

		
		/* 以上をコピーする */
		var outputElement = document.getElementById("output") ;
		outputElement.innerHTML = answer ;  // outputElementment に出力
		
		console.log(inputNumber) ;
		console.log("end") ;

		return 0 ;
	} ;
	
	doIt() ;
	console.timeEnd("Loading Time") ;

}, false) ;
