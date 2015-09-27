
window.addEventListener("load", function () {
	"use strict" ;
	
	console.time("windowLoadFunctions") ;
	var test = new SolveNumberPlace.Solve() ;
	test.setQuestionArray( [7,,,2,,8,,,3,,8,,,1,,,7,,1,,3,,,,2,,9,,6,,,7,,,3,,5,,,4,3,9,,,1,,2,,,6,,,4,,8,,7,,,,1,,2,,9,,,2,,,6,,6,,,5,,3,,,4] ) ;
	test.mainProcess() ;
	var makeForm = new SolveNumberPlace.MakeForm(3, 5) ;
	makeForm.mainProcess() ;
	var makeForm2 = new SolveNumberPlace.MakeForm(3, 3) ; // ちゃんと作り直されて動くかの確認
	makeForm2.mainProcess() ;
	console.timeEnd("windowLoadFunctions") ;
	
}, false) ;



function SolveNumberPlace(){} ;

/*** SolveNumberPlace.MakeForm   **************************/
/**********************************************************/
/*********************   入力のためのフォームを用意する ***/
SolveNumberPlace.MakeForm = function(regionHeight, regionWidth){
	if(regionHeight === undefined){
		this.regionHeight = 3 ;
	}else{
		this.regionHeight = regionHeight ;
	}
	if(regionWidth === undefined){
		this.regionWidth = 3 ;
	}else{
		this.regionWidth = regionWidth ;
	}

	this.solveObject = new SolveNumberPlace.Solve() ;
	this.solveObject.setRegionHeight(this.regionHeight) ;
	this.solveObject.setRegionWidth(this.regionWidth) ;

	this.wholeBoxSize = this.regionHeight * this.regionWidth ;
	this.wholeBoxAmount = this.wholeBoxSize * this.wholeBoxSize ;
} ;

SolveNumberPlace.MakeForm.prototype = {
	mainProcess : function(){
		this.writeHtml() ;
	} ,

	/* フォームと実行ボタンを HTML に書き込む */
	writeHtml : function(){
		var formsAreaElement = document.getElementById("inputFormNumberPlace") ;
		var stringsInFormsArea = "" ;

		stringsInFormsArea += "<form name=\"numberPlaceFormArea\" accept-charset=\"utf-8\">" ;

		/* wholeBoxSize が何桁か見て、それを入力できる桁数とする */
		this.digitOfWholeBoxSize = this.countDigit(this.wholeBoxSize) ;
		for(var i = 0; i < this.wholeBoxSize; ++i){
			for(var j = 0; j < this.wholeBoxSize; ++j){
				if(this.isSmartPhone() === true){
					// for SmartPhone
					stringsInFormsArea += "<input type=\"number\" " ;
				}else{
					stringsInFormsArea += "<input type=\"text\" " ;
				}
				stringsInFormsArea += ("name=\"numberPlaceForm\" class=\"numberPlaceForm\" maxlength=\""
									   + this.digitOfWholeBoxSize + "\" size=\""
									   + this.digitOfWholeBoxSize + "\" pattern=\"\\d{"
									   + this.digitOfWholeBoxSize + "}\" id=\"numberPlaceForm"
									   + (i * this.wholeBoxSize + j) + "\">") ;
			}
			stringsInFormsArea += "<br>" ;
		}
		
		stringsInFormsArea += "<input type=\"button\" id=\"submitFormsNumberButton\" name=\"button\" value=\"実行\">" ;
		stringsInFormsArea += "<input type=\"button\" id=\"deleteFormsNumberButton\" name=\"button\" value=\"消す\">" ;
		stringsInFormsArea += "</form>" ;
		
		formsAreaElement.innerHTML = stringsInFormsArea ;

		/* フォームに入力をおこなったときの挙動を登録 */
		this.whenInputIntoForm(this) ;
		/* 「実行」ボタンを押された時の挙動の登録 */
		this.whenPushSubmitButton(this) ;
		/* 「消す」ボタンを押された時の挙動の登録 */
		this.whenPushDeleteButton(this) ;
	} ,

	/* スマホ判定、参考 : https://w3g.jp/blog/js_browser_sniffing2015 */
	isSmartPhone : function(){
		var userAgent = window.navigator.userAgent.toLowerCase() ;
		if( (userAgent.indexOf("windows") != -1 && userAgent.indexOf("phone") != -1)
			|| userAgent.indexOf("iphone") != -1
			|| userAgent.indexOf("ipod") != -1
			|| (userAgent.indexOf("android") != -1 && userAgent.indexOf("mobile") != -1)
			|| (userAgent.indexOf("firefox") != -1 && userAgent.indexOf("mobile") != -1)
			|| userAgent.indexOf("blackberry") != -1 ){
				return true ;
			}else{
				return false ;
			}
	} ,

	/* 何桁かを見る */
	countDigit : function(inputNumber){
		var number = inputNumber ;
		var counter = 0 ;
		do{
			number = parseInt(number / 10) ;
			++counter ;
		}while(number !== 0) ;
		return counter ;
	} ,

	/* 入力があったときに自動で別のフォームへフォーカスが移るよう、各フォームに設定 */
	whenInputIntoForm : function(targetObject){
		for(var i = 0; i < this.wholeBoxSize; ++i){
			for(var j = 0; j < this.wholeBoxSize; ++j){
				/* 英数字・記号を入力したとき */
				document.numberPlaceFormArea.numberPlaceForm[i * this.wholeBoxSize + j].addEventListener("keyup", function(pushedKey){
					var pushedKeyCode = pushedKey.keyCode ;
					if( (pushedKeyCode === 32) // space key
						|| (48 <= pushedKeyCode && pushedKeyCode <= 90) // a-z0-9
						|| (96 <= pushedKeyCode && pushedKeyCode <= 111) // ten key
						|| (186 <= pushedKeyCode && pushedKeyCode <= 191) ){ // symbol
						targetObject.moveSideForm(pushedKey.keyCode, this) ;
					}
				} ) ;
				/* 矢印キー、BackSpaceキーを押したとき */
				document.numberPlaceFormArea.numberPlaceForm[i * this.wholeBoxSize + j].addEventListener("keydown", function(pushedKey){
					var pushedKeyCode = pushedKey.keyCode ;
					if( (pushedKey.keyCode === 8) // BackSpace
						|| (37 <= pushedKeyCode && pushedKeyCode <= 40) ){ // arrow key
						targetObject.moveSideForm(pushedKey.keyCode, this) ;
					}
				} ) ;
			}
		}
	} ,

	/* キーが押されたときに隣のフォームへ移動 */
	moveSideForm : function(pushedKeyCode, currentForm){
		var currentFormIndex = parseInt( currentForm.id.match(/[0-9]+$/) ) ;
		/* 上下左右キーが押されたとき、その方向へ移動 */
		var leftSideIndex  = (currentFormIndex - 1 + this.wholeBoxAmount) % this.wholeBoxAmount ;
		var upperSideIndex = (currentFormIndex - this.wholeBoxSize + this.wholeBoxAmount) % this.wholeBoxAmount ;
		var rightSideIndex = (currentFormIndex + 1) % this.wholeBoxAmount ;
		var lowerSideIndex = (currentFormIndex + this.wholeBoxSize) % this.wholeBoxAmount ;
		/* 矢印キーを押されたら、指定方向へ移動 */
		if(37 <= pushedKeyCode && pushedKeyCode <= 40){
			switch(pushedKeyCode){
			case 37 :  // left
				var nextFormIndex = leftSideIndex ;
				break ;
			case 38 :  // up
				var nextFormIndex = upperSideIndex ;
				break ;
			case 39 :  // right
				var nextFormIndex = rightSideIndex ;
				break ;
			case 40 :  // down
				var nextFormIndex = lowerSideIndex ;
				break ;
			}
		}
		/* BackSpace 押したら、左のマスを消しつつそのマスへ */
		else if(pushedKeyCode === 8){
			if(currentForm.value.length === 0){
				var nextFormIndex = leftSideIndex ;
				document.numberPlaceFormArea.numberPlaceForm[nextFormIndex].value = "" ;
			}else{
				return false ;
			}
		}
		/* フォームを限界文字数まで入力していたら次のフレームへ */
		else if(currentForm.value.length >= currentForm.size){
			var nextFormIndex = rightSideIndex ;
		}else{
			return false ;
		}
		
		try{
			document.numberPlaceFormArea.numberPlaceForm[nextFormIndex].focus() ;
		}catch(e){
			console.log("*Warning* can't move the direction you pushed. ") ;
			document.numberPlaceFormArea.numberPlaceForm[currentFormIndex].focus() ;
		}
		return true ;
	} ,

	/* 実行ボタンの挙動を登録する */
	whenPushSubmitButton : function(targetObject){
		var submitFormsNumberButtonElement = document.getElementById("submitFormsNumberButton") ;
		submitFormsNumberButtonElement.addEventListener("click", function(){
			// console.log("「実行」が押されました") ;
			// console.log(targetObject) ;
			targetObject.submitFormNumbersToSolve() ;
		}, false ) ;
	} ,
	
	/* フォームの入力状態を読み取って、一次元配列にして SolveNumberPlace.Solve に渡す */
	/* makeFormObject は、この関数外で言うところの this (= MakeForm Object 自身) */
	submitFormNumbersToSolve : function(){
		// console.log("Solve に送ります") ;
		var questionArray = [] ;
		var numberPlaceInputFormsElements = document.getElementsByClassName("numberPlaceForm") ;
		for(var i = 0; i < numberPlaceInputFormsElements.length; ++i){
			questionArray.push(numberPlaceInputFormsElements[i].value) ;
		}

		/* 今作った questionArray を solveObject._questionArray にセットしたのち Solve させる */
		this.solveObject.setQuestionArray(questionArray) ;
		this.solveObject.mainProcess() ;

		/* 扱いやすいよう、解答配列を読み取って this.answeredArray に渡す */
		this.answeredArray = this.solveObject.answeredArray.concat() ;
		this.outputAnswerToForms() ;
	} ,
	
	/* 解答を、テキストエリアやフォームに出力する */
	outputAnswerToForms : function(){
		var numberPlaceInputFormsElements = document.getElementsByClassName("numberPlaceForm") ;
		var inputTextAreaElement = document.getElementById("inputTextArea") ;
		var outputElement = document.getElementById("output") ;
		/* 出力エリアを空白で初期化 */
		var outputString = "" ;
		inputTextAreaElement.value = outputString ;
		outputElement.innerHTML = outputString ;

		/* 解けたとこまでフォームに出力 */
		for(var i = 0; i < numberPlaceInputFormsElements.length; ++i){
			if(this.answeredArray[i] !== undefined){
				numberPlaceInputFormsElements[i].value = this.answeredArray[i] ;
			}else{
				numberPlaceInputFormsElements[i].value = "" ;
			}
		}
		/* 答えが導けた場合、フォームやテキストエリアに答えを記入 */
		if(this.solveObject.completeAnswerFlag === true){
			/* テキストエリアへの出力 */
			/* 見やすいよう、最大桁より小さい桁数なら、そのぶん左に空白 */
			for(var i = 0; i < this.answeredArray.length; ++i){
				this.answeredArray[i] = String(this.answeredArray[i]) ;
				if(this.answeredArray[i].length < this.digitOfWholeBoxSize){
					this.answeredArray[i] = ( " " * (this.digitOfWholeBoxSize - this.answeredArray[i].length) + this.answeredArray[i] ) ;
				}
			}
			/* 見やすいよう、 boxSize 個ごとに改行する */
			for(var i = 0; i < this.wholeBoxSize; ++i){
				outputString += this.answeredArray.slice( (i * this.wholeBoxSize), ((i+1) * this.wholeBoxSize) ) ;
				outputString += "\n" ;
			}
			inputTextAreaElement.value = outputString ;
			outputElement.innerHTML = outputString.replace(/[\n]/g, "<br>") ;
		}else{
			if(this.solveObject.overlappedNumberProblemPlace !== undefined){
				outputString = "入力された問題は、数字の重複があるため解けませんでした" ;
				console.log("errorPlaceI : " + this.solveObject.overlappedNumberProblemPlace[0]
							+ ", errorPlaceJ : " + this.solveObject.overlappedNumberProblemPlace[1] ) ;
				/* 重複のある問題箇所のフォームへフォーカス */
				numberPlaceInputFormsElements[ this.solveObject.overlappedNumberProblemPlace[0] * this.wholeBoxSize + this.solveObject.overlappedNumberProblemPlace[1] ].focus() ;
			}else{
				outputString = "解けませんでした。" ;
				/* フォームに出力 */
				for(var i = 0; i < numberPlaceInputFormsElements.length; ++i){
					if(this.answeredArray[i] !== undefined){
						numberPlaceInputFormsElements[i].value = this.answeredArray[i] ;
					}else{
						numberPlaceInputFormsElements[i].value = "" ;
					}
				}
			}
			inputTextAreaElement.value = outputString ;
			document.getElementById("output").innerHTML = outputString ;
		}
	} ,

	/* 消すボタンの挙動を登録する */
	whenPushDeleteButton : function(targetObject){
		var deleteFormsNumberButtonElement = document.getElementById("deleteFormsNumberButton") ;
		deleteFormsNumberButtonElement.addEventListener("click", function(){
			// console.log("「消す」が押されました") ;
			// console.log(targetObject) ;
			targetObject.deleteFormsInput() ;
		}, false ) ;
	} ,
		
	/* 確認後、Yesならフォーム内を全消去 */
	deleteFormsInput : function(){
		var doReally = confirm("すべてのマスの入力を削除します。\n\
	よろしいですか？") ;
		if(doReally === true){
			var numberPlaceElements = document.getElementsByClassName("numberPlaceForm") ;
			for(var i = 0; i < numberPlaceElements.length; ++i){
				numberPlaceElements[i].value = "" ;
			}
		}
	}
} ;


// /* JSON ファイルの中の配列を取ってくる */
// SolveNumberPlace.GetJson = function(filename){
// 	this.filename = filename ;

// 	var _fetchJsonArray = [] ;
// 	this.setFetchJsonArray = function(jsonArray){
// 		_fetchJsonArray = jsonArray ;
// 	} ;
// 	this.getFetchJsonArray = function(){
// 		return _fetchJsonArray ;
// 	} ;
// } ;

// SolveNumberPlace.GetJson.prototype = {
// 	callJson : function(){
// 		if(this.filename === undefined){
// 			return false ;
// 		}
// 		var fetchJsonArray = [] ;
// 		var gj = new SolveNumberPlace.GetJson(this.filename) ;
// 		var xmlHttpRequest = new XMLHttpRequest();
// 		xmlHttpRequest.open( "GET", this.filename, true) ;
// 		xmlHttpRequest.responseType = "json" ;
// 		xmlHttpRequest.onreadystatechange = function(){
// 			var READYSTATE_COMPLETED = 4;
// 			var HTTP_STATUS_OK = 200;
// 			if( this.readyState === READYSTATE_COMPLETED &&
// 				this.status === HTTP_STATUS_OK ){
// 					// console.log(this) ;
// 					fetchJsonArray = xmlHttpRequest.response ;
// 					// console.log("child.jsonArray : " + fetchJsonArray ) ;

// 					var data = eval(xmlHttpRequest.response) ;
// 					gj.setFetchJsonArray(data) ;
// 			}
// 		} ;
// 		xmlHttpRequest.send( null );
		
// 		// console.log("parent.jsonArray = " + fetchJsonArray ) ;
// 		return fetchJsonArray ;
// 	}
// } ;

/* JSON ファイルの中の配列を取ってくる */
function getJson(filename){
	this.filename = filename ;
	this.xmlHttpRequest = new XMLHttpRequest();
	this.xmlHttpRequest.open( "GET", filename, true) ;
	this.xmlHttpRequest.responseType = "json" ;
	this.xmlHttpRequest.onreadystatechange = function(){
		this.jsonArray = [] ;
		var READYSTATE_COMPLETED = 4;
		var HTTP_STATUS_OK = 200;
		if( this.readyState === READYSTATE_COMPLETED
			&& this.status === HTTP_STATUS_OK ){
				console.log(this);
				this.jsonArray = this.response ;
				console.log("jsonArray : " + this.jsonArray) ;
			}else{
			}
	} ;
	this.xmlHttpRequest.send( null );
	
	console.log(this.xmlHttpRequest.jsonArray) ;
	return this.xmlHttpRequest.jsonArray ;
} ;
