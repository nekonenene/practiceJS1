
window.addEventListener("load", function () {
	console.time("Loading Time") ;
	
	var submitButtonEle = document.getElementById("doItButton") ;
	submitButtonEle.addEventListener("click", function(){
		// console.log("押されました") ;
		var inputAreaEle = document.getElementById("inputArea") ;
		// console.log("input = " + inputAreaEle.value) ;
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

		/* 末尾の無駄な半角スペースとTab、無駄な改行は削る */
		chunk = chunk.replace(/([ \t]{1,}|\s)+$/gm, "") ;
		/* 行頭の空白成分を削る */
		chunk = chunk.replace(/^\s+/gm, "") ;
		// console.log("chunk = " + chunk) ;
		
		/* 入力は入力フォームに入れるか、html の miku div 内に入れる */
		console.time("Solving Time") ;
		/* 以下をコピーする */
		
		/* 2015/10/03 Sat        *
		 * A008 : パレードを制覇せよ        */
		var inputNumber = chunk.split(/[ \n]/) ;
		
		for(var i = 0; i < inputNumber.length ; ++i){
			inputNumber[i] = Number(inputNumber[i]) ;
		} ;

		var paradeAmount = inputNumber[0] ;
		var paradeDays = inputNumber[1] ;

		var paradeIdADay = [] ;
		for(var i = 0 ; i < paradeDays; ++i){
			paradeIdADay[i] = inputNumber[i + 2] ;
		}

		var visitedParade = [] ;

		if(paradeAmount <300){}else
		{
		var flag = false ;
		for(var holidayLimit = paradeAmount; holidayLimit <= paradeDays; ++holidayLimit){
			for(var holidayStartDay = 0 ; holidayStartDay <=  (paradeDays - holidayLimit); ++holidayStartDay){
				flag = visit(holidayStartDay, holidayLimit-300, paradeAmount-300) ;
				if(flag){break;}
			}
			if(flag){break;}
		}
		console.log(holidayLimit-500 + " L | START " + holidayStartDay) ;
		}

		for(var holidayLimit = paradeAmount; holidayLimit <= paradeDays; ++holidayLimit){
			for(var holidayStartDay = 0 ; holidayStartDay <=  (paradeDays - holidayLimit); ++holidayStartDay){
				flag = visit(holidayStartDay, holidayLimit, paradeAmount) ;
				if(flag){break;}
			}
			if(flag){break;}
		}
		console.log(holidayLimit + " L | START " + holidayStartDay) ;
		
		function visit(_currentDay, _holidayRemain, _paradeAmount){
			/* あと行かなければいけないパレードの数が、残り日数より多いのならムリ。終了 */
			if( (_paradeAmount - visitedParade.length) > _holidayRemain ){
				visitedParade = [] ;
				return false ;
			}else{
				if(visitedParade.length === _paradeAmount){
					console.log(visitedParade) ;
					// console.log("END") ;
					visitedParade = [] ;
					return true ;
				}else{
					if( isInArray(paradeIdADay[_currentDay], visitedParade) === false ){
						visitedParade.push( paradeIdADay[_currentDay] ) ;
					}
					return visit( _currentDay + 1, _holidayRemain - 1, _paradeAmount) ;
				}
			}
		} ;


		function isInArray(_value, _array){
			for(var i = 0; i < _array.length; ++i){
				if(_value === _array[i]){
					return true ;
				}
			}
			return false ;
		} ;
		
		var answer = holidayLimit ;
		console.log(answer) ;
		
		/* 以上をコピーする */
		var outputElement = document.getElementById("output") ;
		outputElement.innerHTML = answer ;  // outputElementment に出力
		
		// console.log(inputNumber) ;
		// console.log("end") ;
		console.timeEnd("Solving Time") ;

		return 0 ;
	} ;
	
	doIt() ;
	console.timeEnd("Loading Time") ;

}, false) ;
