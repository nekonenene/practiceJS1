window.addEventListener("load", function () {
	"use strict" ;

	console.time("windowLoadFunctions") ;

	/* フォームと実行ボタンを HTML に書き込む */
	var inputFormNumberPlaceElement = document.getElementById("inputFormNumberPlace") ;
	var strForm = "" ;
	strForm += "<form name=\"numberPlaceForm\" accept-charset=\"utf-8\" style=\"margin:20px 15px;\">" ;
	for(var i=0; i<9; ++i){
		for(var j=0; j<9; ++j){
			if (navigator.userAgent.indexOf('iPhone') > 0
				|| navigator.userAgent.indexOf('Android') > 0) {
				// for SmartPhone
				strForm += "<input type=\"number\" name=\"numberPlace\" class=\"numberPlace\" \
 maxlength=\"1\" size=\"1\" pattern=\"\\d\" id=\"numberPlaceForm" + (i*9 + j) + "\">" ;
			}else{
				strForm += "<input type=\"text\" name=\"numberPlace\" class=\"numberPlace\" \
 maxlength=\"1\" size=\"1\" pattern=\"[1-9]\" id=\"numberPlaceForm" + (i*9 + j) + "\">" ;
			}
		}
		strForm += "<br>" ;
	}
	/* 82th hidden form
	 strForm += "<input hidden=\"true\" type=\"text\" name=\"numberPlace\" class=\"numberPlace\" \
	 maxlength=\"1\" size=\"1\" pattern=\"[1-9]\" tabIndex=\"" + i*9 + "\">" ;
	 */

	strForm += "<input type=\"button\" id=\"submitNumbersButton\" name=\"button\" value=\"実行\" style=\"margin:3px 0;\">" ;
	strForm += "<input type=\"button\" id=\"deleteNumbersButton\" name=\"button\" value=\"消す\" style=\"margin:3px 0 0 8px;\">" ;
	strForm += "</form>" ;

	inputFormNumberPlaceElement.innerHTML = strForm ;

	/* フォームに入力されたあとにおこなう挙動を登録 */
	for(var i=0; i<9; ++i){
		for(var j=0; j<9; ++j){
			document.numberPlaceForm.numberPlace[i*9 + j].onkeyup = function(){
				nextFrame(this) ;
			} ;
		}
	}

	/* 「実行」ボタンを押された時の挙動の登録 */
	var submitNumbersButtonElement =
			document.getElementById("submitNumbersButton") ;
	submitNumbersButtonElement.addEventListener("click", function(){

		doWhenPushedSubmitNumbersButton() ;

	}, false) ;

	/* 「消す」ボタンを押された時の挙動の登録 */
	var deleteNumbersButtonElement =
			document.getElementById("deleteNumbersButton") ;
	deleteNumbersButtonElement.addEventListener("click", function(){

		doWhenPushedDeleteNumbersButton() ;

	}, false) ;

	console.timeEnd("windowLoadFunctions") ;

}, false) ;


/* フォームを限界文字数まで入力したら次のフレームへ */
function nextFrame(currentForm) {
	if(currentForm.value.length >= currentForm.size){
		// console.log(currentForm) ;
		var currentFormIndex = parseInt( currentForm.id.match(/[0-9]+$/) ) ;
		// console.log(currentFormIndex) ;
		try{
			document.numberPlaceForm.numberPlace[currentFormIndex + 1].focus() ;
		}catch(e){
			console.log("*Warning* can't move next form ") ;
			document.numberPlaceForm.numberPlace[0].focus() ;
		}
	}
} ;

/* 消すボタン */
function doWhenPushedDeleteNumbersButton(){
	var doReally = confirm("すべてのマスの入力を削除します。\n\
よろしいですか？") ;
	if(doReally === true){
		var numberPlaceElements = document.getElementsByClassName("numberPlace") ;
		for(var i = 0; i < numberPlaceElements.length; ++i){
			numberPlaceElements[i].value = "" ;
		}
	}
}

/* 実行ボタン */
function doWhenPushedSubmitNumbersButton(){
	var inputTextAreaElement = document.getElementById("inputTextArea") ;
	var outputElement = document.getElementById("output") ;
	var str = "" ;
	inputTextAreaElement.value = str ;
	outputElement.innerHTML = str ;

	var inputNumbersArray = submitNumbers() ;
	var answerNumbersArray = solveNumberPlace(inputNumbersArray) ;

	var numberPlaceElements = document.getElementsByClassName("numberPlace") ;

	if(answerNumbersArray[0] !== false){

		/* 答えが導けた場合、フォームやテキストエリアに答えを記入 */
		for(var i = 0; i < numberPlaceElements.length; ++i){
			numberPlaceElements[i].value = answerNumbersArray[i] ;
		}

		/* 9個ごとに分けて出力、出力ごとに改行する */
		for(var i = 0; i < 9; ++i){
			str += answerNumbersArray.slice( (i * 9), ((i+1) * 9) ) ;
			str += "\n" ;
		}
		inputTextAreaElement.value = str ;
		outputElement.innerHTML = str.replace(/[\n]/g, "<br>") ;

	}else{
		if(String(answerNumbersArray[1]).search(/[0-9]/) !== -1){
			var str = "入力された問題は、数字の重複があるため解けません" ;
			console.log("errorPlaceI : " + answerNumbersArray[1]
						+ ", errorPlaceJ : " + answerNumbersArray[2] ) ;
			var problemPlaceElement = numberPlaceElements[ answerNumbersArray[1] * 9 + answerNumbersArray[2] ] ;
			// problemPlaceElement.style.backgroundColor = "#FFD6DD" ;
			// problemPlaceElement.style.backgroundColor = "rgba(255,162,200,0.4)" ;
			problemPlaceElement.focus() ;
		}else{
			var str = "解けませんでした。" ;
		}
		inputTextAreaElement.value = str ;
		document.getElementById("output").innerHTML = str ;
	}

} ;

/* フォームの数字を取得し、配列 numberPlaceNumbers にひとつずつ入れる
 * 1～9 以外の値だったら代入せず、ボックスの中も空白にする */
function submitNumbers(){
	// console.log("押されました") ;
	var numberPlaceElements = document.getElementsByClassName("numberPlace") ;
	var numberPlaceNumbers = [] ;
	for(var i=0; i < numberPlaceElements.length; ++i){
		var pushValue = numberPlaceElements[i].value ;
		if(pushValue.search(/[1-9]/) === -1){
			if(pushValue.search(/[１-９]/) !== -1){  // 全角は直してあげる
				pushValue = pushValue.replace(/[１-９]/g, function(s) {
					return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
				});
				numberPlaceElements[i].value = pushValue ;
			}else{
				numberPlaceElements[i].value = "" ;
				pushValue = "" ;
			}
		}
		numberPlaceNumbers.push(pushValue) ;
	}
	// console.log("input = " + numberPlaceNumbers) ;

	return numberPlaceNumbers ;
} ;


/* 与えられた 81 個の数列から、ナンバープレースを解く */
function solveNumberPlace(questionArray){
	console.time("solveNumberPlaceTimer") ;
	console.log("solve start") ;

	var numbersDoubleArray = new Array(9) ;
	for(var i=0; i<numbersDoubleArray.length; ++i){
		numbersDoubleArray[i] = new Array(9) ;
	}

	// test array
	// if(questionArray === undefined){
		// questionArray = [
		//      , ,8,2, ,3,1, , ,
		//      , ,6,1, ,5,8, , ,
		//     1,5, , , , , ,3,9,
		//     4,1, ,6, ,9, ,5,8,
		//      , , , ,2, , , , ,
		//     6,9, ,5, ,1, ,2,4,
		//     8,3, , , , , ,7,6,
		//      , ,5,3, ,4,9, , ,
		//      , ,9,7, ,8,5, ,  ] ;

		// 重複を見るだけでは解けない高度な問題
		// questionArray = [
		// 	7, , ,2, ,8, , ,3,
		// 	 ,8, , ,1, , ,7, ,
		// 	1, ,3, , , ,2, ,9,
		// 	 ,6, , ,7, , ,3, ,
		// 	5, , ,4,3,9, , ,1,
		// 	 ,2, , ,6, , ,4, ,
		// 	8, ,7, , , ,1, ,2,
		// 	 ,9, , ,2, , ,6, ,
		// 	6, , ,5, ,3, , ,4 ] ;
// 	}
	// var answer = [
	// 	[9,7,8,2,4,3,1,6,5],
	// 	[3,2,6,1,9,5,8,4,7],
	// 	[1,5,4,8,7,6,2,3,9],
	// 	[4,1,2,6,3,9,7,5,8],
	// 	[5,8,3,4,2,7,6,9,1],
	// 	[6,9,7,5,8,1,3,2,4],
	// 	[8,3,1,9,5,2,4,7,6],
	// 	[7,6,5,3,1,4,9,8,2],
	// 	[2,4,9,7,6,8,5,1,3] ] ;

	for(var i=0; i<9; ++i){
		for(var j=0; j<9; ++j){
			numbersDoubleArray[i][j] = { number : questionArray[i*9 + j], done : false } ;
			if(numbersDoubleArray[i][j].number !== undefined && numbersDoubleArray[i][j].number != ""){
				numbersDoubleArray[i][j].done = true ;
				// console.log( (i*9+j) + " : " + numbersDoubleArray[i][j].number) ;
			}else{
				numbersDoubleArray[i][j].candidate = "123456789" ;
			}
		}
	}

	/* function isTrueNumberPlace を使い、ちゃんと解ける問題なのかチェック */
	var isLegal = isTrueNumberPlace(numbersDoubleArray) ;
	if(isLegal.result === false){
		var resultArray = [ isLegal.result, isLegal.errorPlaceI, isLegal.errorPlaceJ] ;
		return resultArray ;
	}

	/* 重複を見て候補を絞る */
	reduceCandidates(numbersDoubleArray) ;

	/* 答えが出ないときは、試しに i 個の候補から数値を入れてみてどうなるか試行する */
	var FIRST_CHOICE_FROM_X_CANDIDATE = 2 ;
	var LAST_CHOICE_FROM_X_CANDIDATE = 4 ;  // 経験上、候補は２個まで絞られるはずなので、4までやるのは少し大げさ
	var i = FIRST_CHOICE_FROM_X_CANDIDATE ;
	while(isComplete(numbersDoubleArray) === false){
		numbersDoubleArray = tryChoiceCandidate(numbersDoubleArray, i++) ;

		if(i === LAST_CHOICE_FROM_X_CANDIDATE){ break; }
	}
	
	// questionArray に入れて送り返してあげる
	if(isComplete(numbersDoubleArray) === true){
		for(var i=0; i<9; ++i){
			for(var j=0; j<9; ++j){
				questionArray[i*9 +j] = numbersDoubleArray[i][j].number ;
				// console.log(numbersDoubleArray[i][j].number) ;
				// console.log(questionArray) ;
			}
		}
	}else{
		// 解けなかった時は questionArray[0]~[2] に false を入れて送り返す
		questionArray[0] = false ;
		questionArray[1] = false ;
		questionArray[2] = false ;
	}
	
	console.timeEnd("solveNumberPlaceTimer") ;
	
	return questionArray ;
} ;



/* 正しく 1~9 の組み合わせがおこなわれてるかチェックする */
function isTrueNumberPlace(doubleArr){

	var resultArray = [] ;

	/* 縦もしくは横に数値の重複がないか調べる */
	var nineBoxNumbers = new Array(9) ;
	for(var i=0; i<9; ++i){
		var lineNumbers = [] ;
		var rowNumbers  = [] ;

			
		for(var j=0; j<9; j++){
			if(doubleArr[i][j].number !== undefined){
				if( isExistInArray(doubleArr[i][j].number, lineNumbers) === false ){
					lineNumbers.push(doubleArr[i][j].number) ;
					// console.log(lineNumbers) ;
				}else{
					console.log("line Error") ;
					resultArray.result = false ;
					resultArray.errorPlaceI = i ;
					resultArray.errorPlaceJ = j ;
					
					return resultArray ;
				}

				/* ここで 3x3 マスの重複について調べる */
				var region = Math.floor(i / 3) * 3 + Math.floor(j / 3) ;
				nineBoxNumbers[region] = [] ;
				if( isExistInArray(doubleArr[i][j].number, nineBoxNumbers[region]) === false ){
					nineBoxNumbers[region].push(doubleArr[i][j].number) ;
						// console.log(nineBoxNumbers[region]) ;
					}else{
						console.log("Box Error") ;
						resultArray.result = false ;
						resultArray.errorPlaceI = i ;
						resultArray.errorPlaceJ = j ;
						
						return resultArray ;
					}
				
			}
			if(doubleArr[j][i].number !== undefined){
				console.log(rowNumbers) ;
				if( isExistInArray(doubleArr[j][i].number, rowNumbers) === false ){
					rowNumbers.push(doubleArr[j][i].number) ;
					}else{
						console.log("row Error") ;
						resultArray.result = false ;
						resultArray.errorPlaceI = j ;
						resultArray.errorPlaceJ = i ;

						return resultArray ;
					}
			}
		}
	}
	
	resultArray.result = true ;
	return resultArray ;
} ;


/* 与えられた変数が、与えられた配列のいずれかと一致するか */
function isExistInArray(targetVariable, array){
	if(targetVariable === undefined || array === undefined){return undefined ;}
	for(var i=0; i<array.length; ++i){
		if(targetVariable === array[i]){
			return true ;
		}
	}
	return false ;
} ;

/* タテ・ヨコ・3x3 ボックス を見て、重複する値を候補から消すことを繰り返す */
function reduceCandidates(doubleArr){

	var changeCandidate = -1 ;
	while(changeCandidate !== 0){
		// console.log(changeCandidate) ;
		changeCandidate = 0 ;  // 候補が削られたとき ++changeCandidate
		
		for(var i=0; i<9; ++i){
			for(var j=0; j<9; ++j){
				if(doubleArr[i][j].done === false){
					for(var m=0; m<9; ++m){
						/* タテ・ヨコの重複する数値は候補 candidate から消す */
						if( (doubleArr[i][m].done === true)
							&& (doubleArr[i][j].candidate.search(doubleArr[i][m].number) !== -1)
							&& (m !== j) ){
							doubleArr[i][j].candidate =
								doubleArr[i][j].candidate.replace( RegExp(doubleArr[i][m].number), "" ) ;
							++changeCandidate ;
						}
						if( (doubleArr[m][j].done === true)
							&& (doubleArr[i][j].candidate.search(doubleArr[m][j].number) !== -1)
							&& (m !== i) ){
							doubleArr[i][j].candidate =
								doubleArr[i][j].candidate.replace( RegExp(doubleArr[m][j].number), "" ) ;
							++changeCandidate ;
						}
					}
					/* nineBoxNumbers ごとの重複を候補から外す */
					var mStart = Math.floor(i / 3) * 3 ;
					var nStart = Math.floor(j / 3) * 3 ;
					for(var m = mStart; m < mStart + 3; ++m){
						for(var n = nStart; n < nStart + 3; ++n){
							if( (doubleArr[m][n].done === true)
								&& (doubleArr[i][j].candidate.search(doubleArr[m][n].number) !== -1)
								&& (m !== i && n !== j) ){
								doubleArr[i][j].candidate =
									doubleArr[i][j].candidate.replace
								( RegExp(doubleArr[m][n].number), "" ) ;
								++changeCandidate ;
							}
						}
					}

					doubleArr[i][j].number =
						parseInt(doubleArr[i][j].candidate) ;
					
					// 候補が削られ、一意に定まったならそれを代入
					if(String(doubleArr[i][j].candidate).length === 1){
						doubleArr[i][j].number =
							parseInt(doubleArr[i][j].candidate) ;
						doubleArr[i][j].done = true ;
						// console.log("decide One: " + doubleArr[i][j].candidate + ", i: " + i + ", j: " + j + " " + doubleArr[i][j].done) ;
					}
				}

			}
		}
	}
	return doubleArr ;
} ;


/* i 個に候補が絞れてる場合は、ためしに入れてみる */
function tryChoiceCandidate(doubleArr, i){

	for(var i=0; i<9; ++i){
		for(var j=0; j<9; ++j){
			if( String(doubleArr[i][j].candidate).length === i ){
				for(var k=0; k<i; ++k){
					doubleArr[i][j].number = parseInt( String(doubleArr[i][j].candidate).charAt(k) ) ;
					doubleArr[i][j].done = true ;
					doubleArr[i][j].candidate = undefined ;

					doubleArr = reduceCandidates(doubleArr) ;
					if( isComplete(doubleArr) === true ){
						return doubleArr ;
					}
				}
			}
			
		}
	}

	return doubleArr ;
} ;


/* 全てが done か調べる */
function isComplete(answeredArray){
	for(var i=0; i<9; ++i){
		for(var j=0; j<9; ++j){
			if(answeredArray[i][j].done !== true){
				return false ;
			}
		}
	}
	return true ;
} ;
