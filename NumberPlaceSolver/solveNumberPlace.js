window.addEventListener("load", function () {

    console.time("windowLoadFunctions") ;
    console.log(parseInt("")) ;

    /* フォームと実行ボタンを HTML に書き込む */
    var inputFormNumPlaceEle = document.getElementById("inputFormNumPlace") ;
    var strForm = "" ;
    strForm += "<form name=\"numPlaceForm\" accept-charset=\"utf-8\" style=\"margin:20px 15px;\">" ;
    for(var i=0; i<9; ++i){
	for(var j=0; j<9; ++j){
	    strForm += "<input type=\"text\" name=\"numPlace\" class=\"numPlace\" maxlength=\"1\" size=\"1\" pattern=\"[1-9]?\" id=\"numPlaceForm" + (i*9 + j) + "\">" ;
	}
	strForm += "<br>" ;
    }
    /* 82th hidden form */
    // strForm += "<input hidden=\"true\" type=\"text\" name=\"numPlace\" class=\"numPlace\" maxlength=\"1\" size=\"1\" pattern=\"[1-9]?\" tabIndex=\"" + i*9 + "\">" ;

    strForm += "<input type=\"button\" id=\"submitNumbersButton\" name=\"button\" value=\"実行\" style=\"margin:3px 0;\">" ;
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

    /* 実行ボタンを押された時の挙動の登録 */
    var submitNumbersButtonEle =
	    document.getElementById("submitNumbersButton") ;
    submitNumbersButtonEle.addEventListener("click", function(){

	doWhenPushedSubmitNumbersButton() ;

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

/* 実行ボタンを押されたら、フォームから値を受け取り配列にし、
 * 答えを answerNumbersArray に入れて、フォームに突っ込んで返す。 */
function doWhenPushedSubmitNumbersButton(){
    var inputNumbersArray = submitNumbers() ;
    var answerNumbersArray = solveNumberPlace(inputNumbersArray) ;
    // console.log("answerNumbersArray = " + answerNumbersArray) ;

    if(answerNumbersArray !== false){

	var numPlaceEles = document.getElementsByClassName("numPlace") ;
	for(var i=0; i<81; ++i){
	    numPlaceEles[i].value = answerNumbersArray[i] ;
	}

	/* ついでに、コピーしやすいようテキストエリアにも答えを入れてあげる */
	var inputTextAreaEle = document.getElementById("inputTextArea") ;
	var str = "" ;
	for(var i = 0; i < 9; ++i){
	    str += answerNumbersArray.slice( (i * 9), (i * 9 + 8) ) ;
	    str += "\n" ;
	}
	inputTextAreaEle.value = str ;

	var outputEle = document.getElementById("output") ;
	outputEle.innerHTML = str.replace(/[\n]/g, "<br>") ;

    }else{
	var str = "解けませんでした。" ;
	console.log(str) ;
	document.getElementById("inputTextArea").value = str ;
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
    arr = [
    	, ,8,2, ,3,1, , ,
    	, ,6,1, ,5,8, , ,
    	1,5, , , , , ,3,9,
    	4,1, ,6, ,9, ,5,8,
    	, , , ,2, , , , ,
    	6,9, ,5, ,1, ,2,4,
    	8,3, , , , , ,7,6,
    	, ,5,3, ,4,9, , ,
    	, ,9,7, ,8,5, ,  ] ;
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
	console.log("入力された問題は、数字の重複があるため解けません"
		    + "; i : " + isLegal.errorI
		    + ", j : " + isLegal.errorJ ) ;
	return false ;
    }

    /* 候補をしぼっていき、候補が２個に定まったら、試しにどちらかを置いて進める。 *
     * ダメだったら違う方の数値を置いてやり直す。 */
    var changeCandidate = -1 ;
    while(changeCandidate !== 0){
	changeCandidate = 0 ;  // 候補が削られたとき ++changeCandidate
	
	for(var i=0; i<9; ++i){
	    for(var j=0; j<9; ++j){
		if(numbersDoubleArray[i][j].done === false){
		    for(var m=0; m<9; ++m){
			/* タテ・ヨコの重複する数値は候補 candidate から消す */
			if( (numbersDoubleArray[i][m].done === true) && (m !== j) ){
			    numbersDoubleArray[i][j].candidate =
				numbersDoubleArray[i][j].candidate.replace( RegExp(numbersDoubleArray[i][m].num), "" ) ;
			    ++changeCandidate ;
			}
			if( (numbersDoubleArray[m][j].done === true) && (m !== i) ){
			    numbersDoubleArray[i][j].candidate =
				numbersDoubleArray[i][j].candidate.replace( RegExp(numbersDoubleArray[m][j].num), "" ) ;
			    ++changeCandidate ;
			}
		    }
		    /* nineBox ごとの重複を候補から外す */
		    var mStart = Math.floor(i / 3) * 3 ;
		    var nStart = Math.floor(j / 3) * 3 ;
		    for(var m = mStart; m < mStart + 3; ++m){
			for(var n = nStart; n < nStart + 3; ++n){
			    if( (numbersDoubleArray[m][n].done === true) && (m !== i && n !== j) ){
				numbersDoubleArray[i][j].candidate =
				    numbersDoubleArray[i][j].candidate.replace
				( RegExp(numbersDoubleArray[m][n].num), "" ) ;
				++changeCandidate ;
			    }
			}
		    }

		    // numbersDoubleArray[i][j].num =
		    // 	parseInt(numbersDoubleArray[i][j].candidate) ;
		    
		    // 候補が削られ、一意に定まったならそれを代入
		    if(String(numbersDoubleArray[i][j].candidate).length === 1){
			numbersDoubleArray[i][j].num =
			    parseInt(numbersDoubleArray[i][j].candidate) ;
			numbersDoubleArray[i][j].done = true ;
			// console.log("decide One: " + numbersDoubleArray[i][j].candidate + ", i: " + i + ", j: " + j + " " + numbersDoubleArray[i][j].done) ;
		    }
		}

	    }
	}
    }

    /* コンソールに結果を出力 */
    var doneAmount = 0 ;
    for(var i=0; i<9; ++i){
	for(var j=0; j<9; ++j){
	    if(numbersDoubleArray[i][j].done === true){
		++doneAmount ;
		// console.log( "i : " + i + ", j : " + j
		// 		+ " ::: " + numbersDoubleArray[i][j].num
		// 		+ " : " + numbersDoubleArray[i][j].done ) ;
	    }else{
		numbersDoubleArray[i][j].num =
		    parseInt(numbersDoubleArray[i][j].candidate) ;
	    }
	}
    }

    // arr に入れて送り返してあげる
    if(doneAmount === 81){
	var arr = [] ;
	for(var i=0; i<9; ++i){
	    for(var j=0; j<9; ++j){
		arr[i*9 +j] = numbersDoubleArray[i][j].num ;
		// console.log(numbersDoubleArray[i][j].num) ;
		// console.log(arr) ;
	    }
	}
    }else{
	return false ;
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
