window.addEventListener("load", function () {

	console.time("windowLoadFunctions") ;

	/* フォームと実行ボタンを HTML に書き込む */
	var inputFormNumPlaceEle = document.getElementById("inputFormNumPlace") ;
	var strForm = "" ;
	strForm += "<form name=\"numPlaceForm\" accept-charset=\"utf-8\" style=\"margin:20px 15px;\">" ;
	for(var i=0; i<9; ++i){
	for(var j=0; j<9; ++j){
		if (navigator.userAgent.indexOf('iPhone') > 0
		|| navigator.userAgent.indexOf('Android') > 0) {
		// for SmartPhone
		strForm += "<input type=\"number\" name=\"numPlace\" class=\"numPlace\" \
 maxlength=\"1\" size=\"1\" pattern=\"\\d\" id=\"numPlaceForm" + (i*9 + j) + "\">" ;
		}else{
		strForm += "<input type=\"text\" name=\"numPlace\" class=\"numPlace\" \
 maxlength=\"1\" size=\"1\" pattern=\"[1-9]\" id=\"numPlaceForm" + (i*9 + j) + "\">" ;
		}
	}
	strForm += "<br>" ;
	}
	/* 82th hidden form
	 strForm += "<input hidden=\"true\" type=\"text\" name=\"numPlace\" class=\"numPlace\" \
	 maxlength=\"1\" size=\"1\" pattern=\"[1-9]\" tabIndex=\"" + i*9 + "\">" ;
	 */

	strForm += "<input type=\"button\" id=\"submitNumbersButton\" name=\"button\" value=\"実行\" style=\"margin:3px 0;\">" ;
	strForm += "<input type=\"button\" id=\"deleteNumbersButton\" name=\"button\" value=\"消す\" style=\"margin:3px 0 0 8px;\">" ;
	strForm += "</form>" ;

	inputFormNumPlaceEle.innerHTML = strForm ;

	/* フォームに入力されたあとにおこなう挙動を登録 */
	for(var i=0; i<9; ++i){
	for(var j=0; j<9; ++j){
		document.numPlaceForm.numPlace[i*9 + j].onkeyup = function(){
		nextFrame(this) ;
		} ;
	}
	}

	/* 「実行」ボタンを押された時の挙動の登録 */
	var submitNumbersButtonEle =
		document.getElementById("submitNumbersButton") ;
	submitNumbersButtonEle.addEventListener("click", function(){

	doWhenPushedSubmitNumbersButton() ;

	}, false) ;

	/* 「消す」ボタンを押された時の挙動の登録 */
	var deleteNumbersButtonEle =
		document.getElementById("deleteNumbersButton") ;
	deleteNumbersButtonEle.addEventListener("click", function(){

	doWhenPushedDeleteNumbersButton() ;

	}, false) ;

	console.timeEnd("windowLoadFunctions") ;

}, false) ;


/* フォームを限界文字数まで入力したら次のフレームへ */
function nextFrame(num) {
	if(num.value.length >= num.size){
	// console.log(num) ;
	var numFormIndex = parseInt( num.id.match(/[0-9]+$/) ) ;
	// console.log(numFormIndex) ;
	try{
		document.numPlaceForm.numPlace[numFormIndex + 1].focus() ;
	}catch(err){
		console.log("*Warning* can't move next form ") ;
		document.numPlaceForm.numPlace[0].focus() ;
	}
	}
} ;

/* 消すボタン */
function doWhenPushedDeleteNumbersButton(){
	var doReally = confirm("すべてのマスの入力を削除します。\n\
よろしいですか？") ;
	if(doReally === true){
	var numPlaceEles = document.getElementsByClassName("numPlace") ;
	for(var i = 0; i < numPlaceEles.length; ++i){
		numPlaceEles[i].value = "" ;
	}
	}
}

/* 実行ボタン */
function doWhenPushedSubmitNumbersButton(){
	var inputTextAreaEle = document.getElementById("inputTextArea") ;
	var outputEle = document.getElementById("output") ;
	var str = "" ;
	inputTextAreaEle.value = str ;
	outputEle.innerHTML = str ;

	var inputNumbersArray = submitNumbers() ;
	var answerNumbersArray = solveNumberPlace(inputNumbersArray) ;

	var numPlaceEles = document.getElementsByClassName("numPlace") ;

	if(answerNumbersArray[0] !== false){

	/* 答えが導けた場合、フォームやテキストエリアに答えを記入 */
	for(var i = 0; i < numPlaceEles.length; ++i){
		numPlaceEles[i].value = answerNumbersArray[i] ;
	}

	for(var i = 0; i < 9; ++i){
		str += answerNumbersArray.slice( (i * 9), ((i+1) * 9) ) ;
		str += "\n" ;
	}
	inputTextAreaEle.value = str ;
	outputEle.innerHTML = str.replace(/[\n]/g, "<br>") ;

	}else{
	if(String(answerNumbersArray[1]).search(/[0-9]/) !== -1){
		var str = "入力された問題は、数字の重複があるため解けません" ;
		console.log("errorI : " + answerNumbersArray[1]
			+ ", errorJ : " + answerNumbersArray[2] ) ;
		var problemPlaceEle = numPlaceEles[ answerNumbersArray[1] * 9 + answerNumbersArray[2] ] ;
		// problemPlaceEle.style.backgroundColor = "#FFD6DD" ;
		// problemPlaceEle.style.backgroundColor = "rgba(255,162,200,0.4)" ;
		problemPlaceEle.focus() ;
	}else{
		var str = "解けませんでした。" ;
	}
	inputTextAreaEle.value = str ;
	document.getElementById("output").innerHTML = str ;
	}

} ;

/* フォームの数字を取得し、配列 numPlaceNumbers にひとつずつ入れる
 * 1～9 以外の値だったら代入せず、ボックスの中も空白にする */
function submitNumbers(){
	// console.log("押されました") ;
	var numPlaceEles = document.getElementsByClassName("numPlace") ;
	var numPlaceNumbers = [] ;
	for(var i=0; i < numPlaceEles.length; ++i){
	var pushValue = numPlaceEles[i].value ;
	if(pushValue.search(/[1-9]/) === -1){
		if(pushValue.search(/[１-９]/) !== -1){  // 全角は直してあげる
		pushValue = pushValue.replace(/[１-９]/g, function(s) {
			return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
		});
		numPlaceEles[i].value = pushValue ;
		}else{
		numPlaceEles[i].value = "" ;
		pushValue = "" ;
		}
	}
	numPlaceNumbers.push(pushValue) ;
	}
	// console.log("input = " + numPlaceNumbers) ;

	return numPlaceNumbers ;
} ;


/* 与えられた 81 個の数列から、ナンバープレースを解く */
function solveNumberPlace(arr){
	console.time("solveNumberPlaceTimer") ;
	console.log("solve start") ;

	var numbersDoubleArray = new Array(9) ;
	for(var i=0; i<numbersDoubleArray.length; ++i){
	numbersDoubleArray[i] = new Array(9) ;
	}

	// test array
	if(arr === undefined){
	// arr = [
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
	arr = [
		7, , ,2, ,8, , ,3,
		 ,8, , ,1, , ,7, ,
		1, ,3, , , ,2, ,9,
		 ,6, , ,7, , ,3, ,
		5, , ,4,3,9, , ,1,
		 ,2, , ,6, , ,4, ,
		8, ,7, , , ,1, ,2,
		 ,9, , ,2, , ,6, ,
		6, , ,5, ,3, , ,4 ] ;
	}
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
		numbersDoubleArray[i][j] = { num : arr[i*9 + j], done : false } ;
		if(numbersDoubleArray[i][j].num !== undefined && numbersDoubleArray[i][j].num != ""){
		numbersDoubleArray[i][j].done = true ;
		// console.log( (i*9+j) + " : " + numbersDoubleArray[i][j].num) ;
		}else{
		numbersDoubleArray[i][j].candidate = "123456789" ;
		}
	}
	}

	/* function isTrueNumberPlace を使い、ちゃんと解ける問題なのかチェック */
	var isLegal = isTrueNumberPlace(numbersDoubleArray) ;
	if(isLegal.result === false){
	var resultArray = [ isLegal.result, isLegal.errorI, isLegal.errorJ] ;
	return resultArray ;
	}

	/* 重複を見て候補を絞る */
	reduceCandidates(numbersDoubleArray) ;

	/* 答えが出ないときは、試しに i 個の候補から数値を入れてみてどうなるか試行する */
	var i = 2 ;
	while(isComplete(numbersDoubleArray) === false){
	numbersDoubleArray = tryChoiceCandidate(numbersDoubleArray, i++) ;

	if(i === 4){ break; }
	}
	
	// arr に入れて送り返してあげる
	if(isComplete(numbersDoubleArray) === true){
	for(var i=0; i<9; ++i){
		for(var j=0; j<9; ++j){
		arr[i*9 +j] = numbersDoubleArray[i][j].num ;
		// console.log(numbersDoubleArray[i][j].num) ;
		// console.log(arr) ;
		}
	}
	}else{
	// 解けなかった時は arr[0]~[2] に false を入れて送り返す
	arr[0] = false ;
	arr[1] = false ;
	arr[2] = false ;
	}
	
	console.timeEnd("solveNumberPlaceTimer") ;
	
	return arr ;
} ;



/* 正しく 1~9 の組み合わせがおこなわれてるかチェックする */
function isTrueNumberPlace(doubleArr){

	var resultArray = [] ;

	/* 縦もしくは横に数値の重複がないか調べる */
	var nineBox = new Array(9) ;
	for(var i=0; i<9; ++i){
	var line = "" ;
	var row  = "" ;
	for(var j=0; j<9; j++){
		if(doubleArr[i][j].num !== undefined){
		if(  line === "" ||
			 String(doubleArr[i][j].num).search(RegExp("[" + line + "]")) === -1 ){
			 line += String(doubleArr[i][j].num) ;
			 // console.log(line) ;
			 }else{
			 console.log("line Error") ;
			 resultArray.result = false ;
			 resultArray.errorI = i ;
			 resultArray.errorJ = j ;
			 
			 return resultArray ;
			 }

		/* ここで 3x3 マスの重複について調べる */
		var region = Math.floor(i / 3) * 3 + Math.floor(j / 3) ;
		if( nineBox[region] === undefined ||
			String(doubleArr[i][j].num).search(RegExp("[" + nineBox[region] + "]")) === -1 ){
			nineBox[region] += String(doubleArr[i][j].num) ;
			// console.log(nineBox[region]) ;
			}else{
			console.log("Box Error") ;
			resultArray.result = false ;
			resultArray.errorI = i ;
			resultArray.errorJ = j ;
			
			return resultArray ;
			}
		
		}
		if(doubleArr[j][i].num !== undefined){
		if( row === "" ||
			String(doubleArr[j][i].num).search(RegExp("[" + row + "]")) === -1 ){
			row += String(doubleArr[j][i].num) ;
			}else{
			console.log("row Error") ;
			resultArray.result = false ;
			resultArray.errorI = j ;
			resultArray.errorJ = i ;

			return resultArray ;
			}
		}
	}
	}
	
	resultArray.result = true ;
	return resultArray ;
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
				&& (doubleArr[i][j].candidate.search(doubleArr[i][m].num) !== -1)
				&& (m !== j) ){
				doubleArr[i][j].candidate =
				doubleArr[i][j].candidate.replace( RegExp(doubleArr[i][m].num), "" ) ;
				++changeCandidate ;
			}
			if( (doubleArr[m][j].done === true)
				&& (doubleArr[i][j].candidate.search(doubleArr[m][j].num) !== -1)
				&& (m !== i) ){
				doubleArr[i][j].candidate =
				doubleArr[i][j].candidate.replace( RegExp(doubleArr[m][j].num), "" ) ;
				++changeCandidate ;
			}
			}
			/* nineBox ごとの重複を候補から外す */
			var mStart = Math.floor(i / 3) * 3 ;
			var nStart = Math.floor(j / 3) * 3 ;
			for(var m = mStart; m < mStart + 3; ++m){
			for(var n = nStart; n < nStart + 3; ++n){
				if( (doubleArr[m][n].done === true)
				&& (doubleArr[i][j].candidate.search(doubleArr[m][n].num) !== -1)
				&& (m !== i && n !== j) ){
				doubleArr[i][j].candidate =
					doubleArr[i][j].candidate.replace
				( RegExp(doubleArr[m][n].num), "" ) ;
				++changeCandidate ;
				}
			}
			}

			doubleArr[i][j].num =
				parseInt(doubleArr[i][j].candidate) ;
			
			// 候補が削られ、一意に定まったならそれを代入
			if(String(doubleArr[i][j].candidate).length === 1){
			doubleArr[i][j].num =
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
			doubleArr[i][j].num = parseInt( String(doubleArr[i][j].candidate).charAt(k) ) ;
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
function isComplete(doubleArr){
	for(var i=0; i<9; ++i){
		for(var j=0; j<9; ++j){
			if(doubleArr[i][j].done !== true){
		return false ;
			}
		}
	}
	return true ;
} ;
