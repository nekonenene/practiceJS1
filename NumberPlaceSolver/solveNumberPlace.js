window.addEventListener("load", function () {
	"use strict" ;
	
	console.time("windowLoadFunctions") ;
	var snp = new SolveNumberPlace() ;
	snp.mainProcess() ;

	var getJson = new SolveNumberPlace.GetJson("numberPlaceArray.json") ;
	getJson.callJson() ;
	
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
			document.numberPlaceForm.numberPlace[i*9 + j].onkeyup = function(pushedKey){
				moveSideForm(pushedKey.keyCode, this) ;
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


/* キーが押されたときに隣のフォームへ移動 */
function moveSideForm(pushedKeyCode, currentForm){
	var currentFormIndex = parseInt( currentForm.id.match(/[0-9]+$/) ) ;
	/* 上下左右キーが押されたとき、その方向へ移動 */
	if(37 <= pushedKeyCode && pushedKeyCode <= 40){
		switch(pushedKeyCode){
		case 37 :  // left
			var nextFormIndex = (currentFormIndex - 1 + 81) % 81 ;
			break ;
		case 38 :  // up
			var nextFormIndex = (currentFormIndex - 9 + 81) % 81 ;
			break ;
		case 39 :  // right
			var nextFormIndex = (currentFormIndex + 1) % 81 ;
			break ;
		case 40 :  // down
			var nextFormIndex = (currentFormIndex + 9) % 81 ;
			break ;
		}
	}
	/* フォームを限界文字数まで入力していたら次のフレームへ */
	else if(currentForm.value.length >= currentForm.size){
		var nextFormIndex = (currentFormIndex + 1) % 81 ;
	}else{
		return false ;
	}
	
	try{
		document.numberPlaceForm.numberPlace[nextFormIndex].focus() ;
	}catch(e){
		console.log("*Warning* can't move the direction you pushed. ") ;
		document.numberPlaceForm.numberPlace[currentFormIndex].focus() ;
	}
	return true ;
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
} ;

/* 実行ボタン */
function doWhenPushedSubmitNumbersButton(){
	var inputTextAreaElement = document.getElementById("inputTextArea") ;
	var outputElement = document.getElementById("output") ;
	var str = "" ;
	inputTextAreaElement.value = str ;
	outputElement.innerHTML = str ;
	
	var inputNumbersArray = submitNumbers() ;
	var answerNumbersArray = solveNumberPlace(inputNumbersArray) ;

	var sssss = new SolveNumberPlace() ;
	sssss.questionArray = inputNumbersArray ;
	sssss.mainProcess() ;
	
	var numberPlaceElements = document.getElementsByClassName("numberPlace") ;

	if(answerNumbersArray[0] !== false){
		/* 答えが導けた場合、フォームやテキストエリアに答えを記入 */
		for(var i = 0; i < numberPlaceElements.length; ++i){
			if(answerNumbersArray[i] !== undefined){
				numberPlaceElements[i].value = answerNumbersArray[i] ;
			}else{
				numberPlaceElements[i].value = "" ;
			}
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


/* フォームの数字を取得し、配列 numberPlaceNumbers にひとつずつ入れる
 * 1～9 以外の値だったら undefined を代入、ボックスの中は空白にする */
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
				pushValue = undefined ;
			}
		}
		numberPlaceNumbers.push(pushValue) ;
	}
	// console.log("input = " + numberPlaceNumbers) ;
	
	return numberPlaceNumbers ;
} ;


/******** SolveNumberPlace Object ********/
var SolveNumberPlace = function(questionArray){
	this.questionArray = questionArray ;
	var _regionWidth   = 3 ;
	var _regionHeight  = 3 ;

	this.setRegionWidth = function(regionWidth){
		if(0 < regionWidth){
			_regionWidth = parseInt(regionWidth) ;
		}
	} ;
	this.getRegionWidth = function(){
		return _regionWidth ;
	} ;

	this.setRegionHeight = function(regionHeight){
		if(0 < regionHeight){
		_regionHeight = parseInt(regionHeight) ;
		}
	} ;
	this.getRegionHeight = function(){
		return _regionHeight ;
	} ;
} ;
		

SolveNumberPlace.prototype = {
	mainProcess : function(){
		console.log("Question : " + this.questionArray) ;
		this.completeAnswerFlag = false ;
		this.adjustQuestionArray() ;
		this.putInTwoDimensionalArray() ;
		if( this.isLegalNumberPlace() ){
			this.reduceCandidates() ;
			// 答えを見てみる
			console.log("Answer : " + this.outputTwoDimensionalQuestionArray()) ;
		}
		console.log("complete? : " + this.completeAnswerFlag) ;
	} ,

	/* 要求された １領域のタテヨコの長さに合わせて、questionArray を調整 */
	adjustQuestionArray : function(){
		/* ボックス全体の長さ、フォームの数を規定 */
		this.wholeBoxSize = this.getRegionWidth() * this.getRegionHeight() ;
		this.wholeBoxAmount = this.wholeBoxSize * this.wholeBoxSize ;

		/* 与えられた配列の数が、全体のフォーム数より少ないならエラー処理 */
		if(this.questionArray === undefined || this.questionArray.length < this.wholeBoxAmount){
			console.log("*Error* Question array is not legal.") ;
			console.log("start running test mode now.") ;
			/* テスト配列を代入（エラー時） */
			this.assignTestArray() ;
		}else if(this.questionArray.length > this.wholeBoxAmount){
			/* 逆に多いなら、フォーム数の数だけ切り取る */
			this.questionArray = this.questionArray(0, this.wholeBoxAmount) ;
		}

		/* 配列の中身が ボックスに入力する番号 以外の値なら、 undefined を代入する */
		for(var i=0; i < this.questionArray.length; ++i){
			var pushValue = this.questionArray[i] ;
			pushValue = String(pushValue).replace(/[０-９]/g, function(em){ // 全角は直す
				return String.fromCharCode(em.charCodeAt(0) - 0xFEE0);
			});
			pushValue = parseInt(pushValue) ; // 整数に直す

			
			if( (0 < pushValue) && (pushValue <= this.wholeBoxSize) ){
				this.questionArray[i] = pushValue ;
			}else{
				this.questionArray[i] = undefined ;
			}
		}
	} ,

	assignTestArray : function(){
		this.setRegionWidth(3)  ;
		this.setRegionHeight(3) ;
		this.wholeBoxSize = this.getRegionWidth() * this.getRegionHeight() ;
		this.wholeBoxAmount = this.wholeBoxSize * this.wholeBoxSize ;
		// テスト用の配列 を代入する
		this.questionArray = [
			 , ,8,2, ,3,1, , ,
			 , ,6,1, ,5,8, , ,
			1,5, , , , , ,3,9,
			4,1, ,6, ,9, ,5,8,
			 , , , ,2, , , , ,
			6,9, ,5, ,1, ,2,4,
			8,3, , , , , ,7,6,
			 , ,5,3, ,4,9, , ,
			 , ,9,7, ,8,5, ,  ] ;
	} ,

	/* questionArray は一次元配列なので、扱いやすいよう二次元配列に整え、代入 */
	putInTwoDimensionalArray : function(){
		this.twoDimensionalQuestionArray = [] ;
		
		for(var i=0; i < this.wholeBoxSize; ++i){
			this.twoDimensionalQuestionArray[i] = [] ;
			for(var j=0; j < this.wholeBoxSize; ++j){
				this.twoDimensionalQuestionArray[i][j] = {
					number : this.questionArray[i * this.wholeBoxSize + j],
					done : false,
					candidates : []
				} ;
				if(this.twoDimensionalQuestionArray[i][j].number !== undefined){
					this.twoDimensionalQuestionArray[i][j].done = true ;
					this.twoDimensionalQuestionArray[i][j].candidates = undefined ;
				}else{
					/* 値の入っていないマスは、1~wholeBoxSize を候補値として入れる */
					for(var k=1; k <= this.wholeBoxSize; ++k){
						this.twoDimensionalQuestionArray[i][j].candidates.push(k) ;
					}
				}
			}
			// console.log(this.twoDimensionalQuestionArray[i][0].candidates) ;
		}
	} ,

	/* １列・１行・１領域内に数値の重複がないか調べる */
	isLegalNumberPlace : function(){
		var oneRegion   = [] ;
		for(var i=0; i<this.wholeBoxSize; ++i){
			var lineNumbers = [] ;
			var rowNumbers  = [] ;
			
			for(var j=0; j<this.wholeBoxSize; j++){
				if(this.twoDimensionalQuestionArray[i][j].done === true){
					/* 横について */
					if( this.isExistInArray(this.twoDimensionalQuestionArray[i][j].number, lineNumbers) === false ){
						lineNumbers.push(this.twoDimensionalQuestionArray[i][j].number) ;
						// console.log(lineNumbers) ;
					}else{
						console.log("line Error") ;
						this.overlapNumberPlace = [ i, j ] ;
						return false ;
					}

					/* ここで １領域内の重複について調べる */
					var region = Math.floor(i / this.getRegionHeight()) * this.getRegionHeight()  + Math.floor(j / this.getRegionWidth()) ;
					// TODO: この上の一行、どっちが Width で どっちが Height なのか自信ないので確認
					oneRegion[region] = [] ;
					if( this.isExistInArray(this.twoDimensionalQuestionArray[i][j].number, oneRegion[region]) === false ){
						oneRegion[region].push(this.twoDimensionalQuestionArray[i][j].number) ;
						// console.log(oneRegion[region]) ;
					}else{
						console.log("Box Error") ;
						this.overlapNumberPlace = [ i, j ] ;
						return false ;
					}
				}
				/* 縦について */
				if(this.twoDimensionalQuestionArray[j][i].done === true){
					if( this.isExistInArray(this.twoDimensionalQuestionArray[j][i].number, rowNumbers) === false ){
						rowNumbers.push(this.twoDimensionalQuestionArray[j][i].number) ;
					}else{
						console.log("row Error") ;
						this.overlapNumberPlace = [ j, i ] ;
						return false ;
					}
				}
			}
		}
		return true ;
	} ,

	/* 与えられた変数が、与えられた配列のいずれかと一致するか */
	isExistInArray : function(targetVariable, array){
		if(targetVariable === undefined || array === undefined){return undefined ;}
		for(var i=0; i<array.length; ++i){
			if(targetVariable === array[i]){
				return true ;
			}
		}
		return false ;
	} ,

	/*** 候補を消していく ***
	 *** アルゴリズム的にはメイン部分 ***/
	reduceCandidates : function(){
		this.completeAnswerFlag = false ;
		do{
			this.numberOfTimesChangedCandidates = 0 ;
			this.numberOfTimesPutCandidate = 0 ;  // 一意に絞られて代入したら +1

			/* 各フォームごとに、タテヨコ領域内の重複している値を調べ、取り除く */
			this.lookOverlapForReduceCandidates() ;
			/* 各フォームごとに、候補が１つに絞られたとき .number に値を代入 */
			this.putUniqueCandidateNumber() ;
		}while(this.numberOfTimesPutCandidate > 0) ;

		/* 値の重複を消すだけでは解決できなかった場合、候補の値の１つを入れてみる */
		if(this.isCompleteAnswer() === true){
			this.completeAnswerFlag = true ;
		}else{
			console.log("戦いは続く") ;
			/* 経験上、候補は上の段階で最小２個まで絞られるはずだが、いちおう4まで */
			var FIRST_CHOICE_FROM_X_CANDIDATE = 2 ;
			var LAST_CHOICE_FROM_X_CANDIDATE = 4 ;
			
			for(var i = FIRST_CHOICE_FROM_X_CANDIDATE; i <= LAST_CHOICE_FROM_X_CANDIDATE; ++i){
				if( this.tryChoiceCandidate(i) === true ){
					this.completeAnswerFlag = true ;
					break ;
				}
			}
		}
		return this.completeAnswerFlag ;
	} ,

	/* 周辺フォームの自分自身との重複を見る */
	lookOverlapForReduceCandidates : function(){
		do{
			this.numberOfTimesChangedCandidates = 0 ;  // 候補が削られたとき +1
			for(var i = 0; i < this.wholeBoxSize; ++i){
				 // console.log(this.twoDimensionalQuestionArray[i][0].candidates) ;

				for(var j = 0; j < this.wholeBoxSize; ++j){
					if(this.twoDimensionalQuestionArray[i][j].done === false){
						var aroundNumbers = [] ;
						/* 縦・横・領域内で重複する値を、候補から削る */
						for(var m = 0; m < this.wholeBoxSize; ++m){
							/* 横行を見る */
							if( (this.twoDimensionalQuestionArray[i][m].done === true) && (m !== j) ){
								if(this.isExistInArray( this.twoDimensionalQuestionArray[i][m].number, aroundNumbers) === false){
									aroundNumbers.push(this.twoDimensionalQuestionArray[i][m].number) ;
								}
							}
							/* 縦列を見る */
							if( (this.twoDimensionalQuestionArray[m][j].done === true) && (m !== i) ){
								if(this.isExistInArray( this.twoDimensionalQuestionArray[m][j].number, aroundNumbers) === false){
									aroundNumbers.push(this.twoDimensionalQuestionArray[m][j].number) ;
								}
							}
						}
						/* 領域内を見る */
						var mStart = Math.floor(i / this.getRegionHeight() ) * this.getRegionHeight() ;
						var nStart = Math.floor(j / this.getRegionWidth()  ) * this.getRegionWidth() ;
						for(var m = mStart; m < ( mStart + this.getRegionHeight() ); ++m){
							for(var n = nStart; n < ( nStart + this.getRegionWidth() ); ++n){
								if( (this.twoDimensionalQuestionArray[m][n].done === true) && (m !== i) && (n !== j) ){
									if(this.isExistInArray( this.twoDimensionalQuestionArray[m][n].number, aroundNumbers) === false){
										aroundNumbers.push(this.twoDimensionalQuestionArray[m][n].number) ;
									}
								}
							}
						}
						/* 候補の値一覧から、aroundNumbers にある値は消去する */
						// console.log("aroundNumbers : " + aroundNumbers) ;
						this.twoDimensionalQuestionArray[i][j].candidates =
							this.dropArray( this.twoDimensionalQuestionArray[i][j].candidates, aroundNumbers ) ;
					}
				}
			}
		}while(this.numberOfTimesChangedCandidates > 0) ;
	} ,

	/* targetArray から dropperArray と重複する値を引き抜く */
	dropArray : function(targetArray, dropperArray){
		// console.log("#" + targetArray) ; <- ヤバイ
		// console.log(dropperArray) ;
		var filteredArray = [] ;
		for(var i = 0; i < targetArray.length; ++i){
			var equalFlag = false ;
			for(var j = 0; j < dropperArray.length; ++j){
				/* 重複する値があったら this.numberOfTimesChangedCandidates を１増やす */
				if(targetArray[i] === dropperArray[j]){
					++this.numberOfTimesChangedCandidates ;
					equalFlag = true ;
				}
			}
			if(equalFlag === false){
				filteredArray.push(targetArray[i]) ;
			}
		}
		return filteredArray ;
	} ,

	/* 候補の値が１つに絞られたら、その値を代入 */
	putUniqueCandidateNumber : function(){
		for(var i = 0; i < this.wholeBoxSize; ++i){
			for(var j = 0; j < this.wholeBoxSize; ++j){
				if( (this.twoDimensionalQuestionArray[i][j].done === false) &&
					(this.twoDimensionalQuestionArray[i][j].candidates.length === 1) ){
					++this.numberOfTimesPutCandidate ;
					this.twoDimensionalQuestionArray[i][j] =
						{ number : Number(this.twoDimensionalQuestionArray[i][j].candidates[0]),
						  done : true,
						  candidates : undefined } ;
				}
			}
		}
	} ,

	/* 全てが done か調べる */
	isCompleteAnswer : function(){
		for(var i=0; i<9; ++i){
			for(var j=0; j<9; ++j){
				if(this.twoDimensionalQuestionArray[i][j].done !== true){
					return false ;
				}
			}
		}
		return true ;
	} ,

	/* targetCandidatesAmount 個に候補が絞れてる場合は、ためしに入れてみる */
	tryChoiceCandidate : function(targetFormCandidatesAmount){
		for(var i = 0; i < this.wholeBoxSize; ++i){
			for(var j = 0; j < this.wholeBoxSize; ++j){
				if( this.twoDimensionalQuestionArray[i][j].candidates.length === targetFormCandidatesAmount ){
					for(var k=0; k < i; ++k){
						/* 候補を入れてみる前に、一時的に配列を保存しておく */
						var saveArray = this.twoDimensionalQuestionArray ;
						this.twoDimensionalQuestionArray[i][j] = {
							number : this.twoDimensionalQuestionArray[i][j].candidates[k],
							done : true,
							candidates : undefined
						} ;

						this.lookOverlapForReduceCandidates() ;
						if( isComplete(this.twoDimensionalQuestionArray) === true ){
							return true ;
						}else{
							/* 上手く解けないようなら一時保存の配列に姿を戻す */
							this.twoDimensionalQuestionArray = saveArray ;
						}
					}
				}
			}
		}
		return false ;
	} ,
	
	/* テスト時に配列を簡単に出せるための機構 */
	outputTwoDimensionalQuestionArray : function(){
		var outputArray = [] ;
		for(var i = 0; i < this.wholeBoxSize; ++i){
			for(var j = 0; j < this.wholeBoxSize; ++j){
				outputArray.push(this.twoDimensionalQuestionArray[i][j].number) ;
			}
		}
		return outputArray ;
	}
} ;


/* JSON ファイルの中の配列を取ってくる */
SolveNumberPlace.GetJson = function(filename){
	this.filename = filename ;

	var _fetchJsonArray = [] ;
	this.setFetchJsonArray = function(jsonArray){
		_fetchJsonArray = jsonArray ;
	} ;
	this.getFetchJsonArray = function(){
		return _fetchJsonArray ;
	} ;
} ;

SolveNumberPlace.GetJson.prototype = {
	callJson : function(){
		if(this.filename === undefined){
			return false ;
		}
		var fetchJsonArray = [] ;
		var gj = new SolveNumberPlace.GetJson(this.filename) ;
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open( "GET", this.filename, true) ;
		xmlHttpRequest.responseType = "json" ;
		xmlHttpRequest.onreadystatechange = function(){
			var READYSTATE_COMPLETED = 4;
			var HTTP_STATUS_OK = 200;
			if( this.readyState === READYSTATE_COMPLETED &&
				this.status === HTTP_STATUS_OK ){
					// console.log(this) ;
					fetchJsonArray = xmlHttpRequest.response ;
					// console.log("child.jsonArray : " + fetchJsonArray ) ;

					var data = eval(xmlHttpRequest.response) ;
					gj.setFetchJsonArray(data) ;
			}
		} ;
		xmlHttpRequest.send( null );
		
		// console.log("parent.jsonArray = " + fetchJsonArray ) ;
		return fetchJsonArray ;
	}
} ;


/* 与えられた 81 個の数列から、ナンバープレースを解く */
function solveNumberPlace(questionArray){
	console.time("solveNumberPlaceTimer") ;
	console.log("solve start") ;
	
	var numbersDoubleArray = new Array(9) ;
	for(var i=0; i<numbersDoubleArray.length; ++i){
		numbersDoubleArray[i] = new Array(9) ;
	}

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
			if(doubleArr[i][j].done === true){
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
			if(doubleArr[j][i].done === true){
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
