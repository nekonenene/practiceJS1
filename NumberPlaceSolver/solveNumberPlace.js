window.addEventListener("load", function () {
	"use strict" ;
	
	console.time("windowLoadFunctions") ;
	var snp = new SolveNumberPlace.Solve() ;
	snp.mainProcess() ;
	console.log("---------------------------------") ;
	var makeForm = new SolveNumberPlace.MakeForm(3, 3) ;
	makeForm.mainProcess() ;
	console.log("=================================") ;
	console.timeEnd("windowLoadFunctions") ;
	
}, false) ;


/****************************************
	 package name : SolveNumberPlace 
	
		2015/9/12 - 2015/9/20
 ***************************************/
function SolveNumberPlace(){} ;

/******** SolveNumberPlace.Solve Object ********/
/*** 与えられた配列から、ナンバープレースを解く ***/
SolveNumberPlace.Solve = function(questionArray){
	if(questionArray === undefined){
		this.questionArray = undefined ;
	}else{
		this.questionArray = questionArray.concat() ;
	}
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


SolveNumberPlace.Solve.prototype = {
	/****  メイン部分、ここを実行することで答えを求め始める  ****/
	mainProcess : function(){
		console.log("Question : " + this.questionArray) ;
		this.completeAnswerFlag = false ;
		this.adjustQuestionArray() ;
		this.putInTwoDimensionalArray() ;
		if( this.isLegalNumberPlace() ){
			this.reduceCandidates() ;
		}

		/* 答えを配列にして入れる */
		this.answeredArray = this.outputTwoDimensionalQuestionArray().concat() ;

		console.log("answeredArray = " + this.answeredArray) ;
		console.log("complete? : " + this.completeAnswerFlag) ;
	} ,

	/* 要求された １領域のタテヨコの長さに合わせて、questionArray を調整 */
	adjustQuestionArray : function(){
		/* ボックス全体の長さ、フォームの数を規定 */
		this.wholeBoxSize = this.getRegionWidth() * this.getRegionHeight() ;
		this.wholeBoxAmount = this.wholeBoxSize * this.wholeBoxSize ;

		/* 与えられた配列の数が、全体のフォーム数より少ないならエラー処理 */
		if(this.questionArray === undefined || this.questionArray.length < this.wholeBoxAmount){
			console.log("*Error* Question array is NOT legal. test mode starts now.") ;
			/* テスト配列を代入（エラー時） */
			this.assignTestArray() ;
		}else if(this.questionArray.length > this.wholeBoxAmount){
			/* 逆に多いなら、フォーム数の数だけ切り取る */
			this.questionArray = this.questionArray.slice(0, this.wholeBoxAmount) ;
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
						this.overlappedNumberProblemPlace = [ i, j ] ;
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
						this.overlappedNumberProblemPlace = [ i, j ] ;
						return false ;
					}
				}
				/* 縦について */
				if(this.twoDimensionalQuestionArray[j][i].done === true){
					if( this.isExistInArray(this.twoDimensionalQuestionArray[j][i].number, rowNumbers) === false ){
						rowNumbers.push(this.twoDimensionalQuestionArray[j][i].number) ;
					}else{
						console.log("row Error") ;
						this.overlappedNumberProblemPlace = [ j, i ] ;
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
			console.log("難しい問題だね・・・") ;
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
					this.twoDimensionalQuestionArray[i][j].number
						= Number(this.twoDimensionalQuestionArray[i][j].candidates[0]) ;
					this.twoDimensionalQuestionArray[i][j].done = true ;
					this.twoDimensionalQuestionArray[i][j].candidates = undefined ;
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
				if( this.twoDimensionalQuestionArray[i][j].done === false ){
					if( this.twoDimensionalQuestionArray[i][j].candidates.length === targetFormCandidatesAmount ){
						for(var k = 0; k < targetFormCandidatesAmount; ++k){
							/* 候補を入れてみる前に、一時的に配列を保存しておく */
							var saveArray = [] ;
							saveArray.push(this.twoDimensionalQuestionArray[i][j].number) ;
							saveArray.push(this.twoDimensionalQuestionArray[i][j].done) ;
							saveArray.push(this.twoDimensionalQuestionArray[i][j].candidates) ;
							// console.log("saveArray = " + saveArray) ;

							this.twoDimensionalQuestionArray[i][j].number
								= this.twoDimensionalQuestionArray[i][j].candidates[k] ;
							this.twoDimensionalQuestionArray[i][j].done = true ;
							this.twoDimensionalQuestionArray[i][j].candidates = undefined ;
							this.lookOverlapForReduceCandidates() ;
							// console.log(this.twoDimensionalQuestionArray[i][j].number) ;
							if( this.isCompleteAnswer(this.twoDimensionalQuestionArray) === true ){
								return true ;
							}else{
								/* 上手く解けないようなら一時保存の配列に姿を戻す */
								this.twoDimensionalQuestionArray[i][j].number = saveArray[0] ;
								this.twoDimensionalQuestionArray[i][j].done = saveArray[1] ;
								this.twoDimensionalQuestionArray[i][j].candidates = saveArray[2] ;
							}
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

/*** SolveNumberPlace.MakeForm   **************************/
/**********************************************************/
/*********************   入力のためのフォームを用意する ***/
SolveNumberPlace.MakeForm = function(regionWidth, regionHeight){
	if(regionWidth === undefined){
		this.regionWidth = 3 ;
	}else{
		this.regionWidth = regionWidth ;
	}
	if(regionHeight === undefined){
		this.regionHeight = 3 ;
	}else{
		this.regionHeight = regionHeight ;
	}
	this.wholeBoxSize = this.regionWidth * this.regionHeight ;
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
		this.whenInputIntoForm() ;
		/* 「実行」ボタンを押された時の挙動の登録 */
		this.whenPushSubmitButton() ;
		/* 「消す」ボタンを押された時の挙動の登録 */
		this.whenPushDeleteButton() ;
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
	whenInputIntoForm : function(){
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
			/* BackSpace 押したら、左のマスを消しつつそのマスへ */
			else if(pushedKeyCode === 8 && currentForm.value.length === 0 ){
				var nextFormIndex = (currentFormIndex - 1 + 81) % 81 ;
				document.numberPlaceFormArea.numberPlaceForm[nextFormIndex].value = "" ;
			}
			/* フォームを限界文字数まで入力していたら次のフレームへ */
			else if(currentForm.value.length >= currentForm.size){
				var nextFormIndex = (currentFormIndex + 1) % 81 ;
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
		} ;

		for(var i = 0; i < this.wholeBoxSize; ++i){
			for(var j = 0; j < this.wholeBoxSize; ++j){
				document.numberPlaceFormArea.numberPlaceForm[i * this.wholeBoxSize + j].onkeyup = function(pushedKey){
					moveSideForm(pushedKey.keyCode, this) ;
				} ;
			}
		}
	} ,

	/* キーが押されたときに隣のフォームへ移動 */
	moveSideForm : function(pushedKeyCode, currentForm){
		var currentFormIndex = Number( currentForm.id ) ;
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
		/* もしエラーで動けなかった時は、現在のフォームにとどまる */
		try{
			document.numberPlaceFormArea.numberPlaceForm[nextFormIndex].focus() ;
		}catch(e){
			console.log("*Warning* can't move the direction you pushed. ") ;
			document.numberPlaceFormArea.numberPlaceForm[currentFormIndex].focus() ;
		}
		return true ;
	} ,

	/* 実行ボタンの挙動を登録する */
	whenPushSubmitButton : function(){
		var submitFormsNumberButtonElement = document.getElementById("submitFormsNumberButton") ;
		submitFormsNumberButtonElement.addEventListener("click", doSubmit(this), false) ;
		function doSubmit(makeFormObject){
			makeFormObject.submitFormNumbersToSolve() ;
		} ;
	} ,
	
	/* フォームの入力状態を読み取って、一次元配列にして SolveNumberPlace.Solve に渡す */
	/* makeFormObject は、この関数外で言うところの this (= MakeForm Object 自身) */
	submitFormNumbersToSolve : function(){
		var questionArray = [] ;
		var numberPlaceInputFormsElements = document.getElementsByClassName("numberPlaceForm") ;
		for(var i = 0; i < numberPlaceInputFormsElements.length; ++i){
			questionArray.push(numberPlaceInputFormsElements[i].value) ;
		}
		var solveObject = new SolveNumberPlace.Solve(questionArray) ;
		solveObject.setRegionWidth(this.regionWidth) ;
		solveObject.setRegionHeight(this.regionHeight) ;
		solveObject.mainProcess(questionArray) ;

		this.answeredArray = solveObject.answeredArray.concat() ;
		this.outputAnswerToForms(solveObject) ;
	} ,
	
	/* 解答を、テキストエリアやフォームに出力する */
	outputAnswerToForms : function(solveObject){
		var numberPlaceInputFormsElements = document.getElementsByClassName("numberPlaceForm") ;
		var inputTextAreaElement = document.getElementById("inputTextArea") ;
		var outputElement = document.getElementById("output") ;
		/* 出力エリアを空白で初期化 */
		var outputString = "" ;
		inputTextAreaElement.value = outputString ;
		outputElement.innerHTML = outputString ;

		console.log("makeFormObject.answeredArray : " + this.answeredArray) ;			
		/* 答えが導けた場合、フォームやテキストエリアに答えを記入 */
		if(solveObject.completeAnswerFlag === true){
			/* フォームに出力 */
			for(var i = 0; i < numberPlaceInputFormsElements.length; ++i){
				if(this.answeredArray[i] !== undefined){
					numberPlaceInputFormsElements[i].value = this.answeredArray[i] ;
				}else{
					numberPlaceInputFormsElements[i].value = "" ;
				}
			}
			
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
			if(solveObject.overlappedNumberProblemPlace !== undefined){
				outputString = "入力された問題は、数字の重複があるため解けませんでした" ;
				console.log("errorPlaceI : " + solveObject.overlappedNumberProblemPlace[0]
							+ ", errorPlaceJ : " + solveObject.overlappedNumberProblemPlace[1] ) ;
				var problemPlaceElement = numberPlaceInputFormsElements[ solveObject.overlappedNumberProblemPlace[0] * this.wholeBoxSize + solveObject.overlappedNumberProblemPlace[1] ] ;
				console.log(problemPlaceElement) ;
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
	
	whenPushDeleteButton : function(){
		var deleteFormsNumberButtonElement = document.getElementById("deleteFormsNumberButton") ;
		deleteFormsNumberButtonElement.addEventListener("click", doDelete(this), false) ;
		function doDelete(makeFormObject){
			makeFormObject.deleteFormsInput() ;
		}
	} ,
	
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
