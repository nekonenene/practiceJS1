
window.addEventListener("load", function () {
	"use strict" ;

	console.time("windowLoadFunctions") ;
/*	var test = new SolveNumberPlace.Solve() ;
	test.setQuestionArray( [7,,,2,,8,,,3,,8,,,1,,,7,,1,,3,,,,2,,9,,6,,,7,,,3,,5,,,4,3,9,,,1,,2,,,6,,,4,,8,,7,,,,1,,2,,9,,,2,,,6,,6,,,5,,3,,,4] ) ;
	test.mainProcess() ;
*/
	this.makeForm = new SolveNumberPlace.MakeForm(3, 3) ;
	this.makeForm.mainProcess() ;

	this.handleEvent = function(event){
		// console.log(this) ;
		switch(event.type){
		case "click" :
			/* ここの parseInt が超大事 */
			var regionWidth  = parseInt(document.getElementById("setRegionWidth").value) ;
			var regionHeight = parseInt(document.getElementById("setRegionHeight").value) ;
			this.makeForm.setRegionSize(regionWidth, regionHeight) ;
			this.makeForm.mainProcess() ;
			break ;
		}
	} ;

	var remakeFormsButtonEle = document.getElementById("makeFormsButton") ;
	remakeFormsButtonEle.addEventListener("click", this, false) ;

	console.timeEnd("windowLoadFunctions") ;
	
}, false) ;



/****************************************
	 package name : SolveNumberPlace 
	
		2015/9/12 - 2015/9/28
 ***************************************/
function SolveNumberPlace(){} ;

/******** SolveNumberPlace.Solve Object ********/
/*** 与えられた配列から、ナンバープレースを解く ***/
SolveNumberPlace.Solve = function(_questionArray, _regionWidth, _regionHeight){
	this.setQuestionArray(_questionArray, _regionWidth, _regionHeight) ;
} ;

SolveNumberPlace.Solve.ProgressStatus = function(){
	this.complete = false ;
	this.error = false ;
	this.errorPlace = [] ;
	this.changedTimes = 0 ;
} ;

SolveNumberPlace.Solve.AFormStatus = function(_length){
	this.length = _length ;
	this.done = [] ;
	this.number = [] ;
	this.candidates = [] ;
	// console.log(this) ; 

	for(var i = 0; i < _length; ++i){
		this.done[i] = false ;
		this.number[i] = undefined ;
		this.candidates[i] = [] ;
	}
} ;
	
SolveNumberPlace.Solve.prototype = {
	/****  メイン部分、ここを実行することで答えを求め始める  ****/
	mainProcess : function(){
		"use strict" ;
		this.progress = new SolveNumberPlace.Solve.ProgressStatus() ;
		this.isNumberInArray() ;  // this.questionArray の中身をチェックし、数値でないなら undefined を代入
		this.putInProgressObject(this.questionArray) ;  // this.questionArray を拡張させたものを this.questionArrayObject へ

		if( this.isLegalNumberPlace(this.questionArrayObject) === false ){
			return false ;
		}else{
			this.reduceCandidates() ;
		}

		/* 答えを配列にして入れる */
		this.answerArray = [] ;
		this.answerArray = this.answerArray.concat(this.questionArrayObject.number) ;
		
		console.log("Question : " + this.questionArray) ;
		console.log("Answer   : " + this.answerArray) ;
		console.log("complete?: " + this.progress.complete) ;
		return true ;
	} ,

	/* この関数で問題配列を設定することができる */
	setQuestionArray : function(_questionArray, _regionWidth, _regionHeight){
		if( (_regionWidth !== undefined) && (0 < _regionWidth) && (_regionWidth < 10) ){
			this.regionWidth  = _regionWidth ;
		}else{
			this.regionWidth = 3 ;
		} ;

		if( (_regionHeight !== undefined) && (0 < _regionHeight) && (_regionHeight < 10) ){
			this.regionHeight  = _regionHeight ;
		}else{
			this.regionHeight = 3 ;
		} ;

		this.wholeBoxSize = this.regionWidth * this.regionHeight ;  // 縦or横に並ぶフォームの数
		this.wholeBoxAmount = this.wholeBoxSize * this.wholeBoxSize ;  // フォームの全体個数

		this.questionArray = [] ;
		if(_questionArray === undefined){
			console.log("*Error* Question array is NOT exist. test mode starts now.") ;
			/* テスト配列を代入（エラー時） */
			this.assignTestArray() ;
		}else{
			/* this.questionArray に引数の配列を入れる */
			this.questionArray = this.questionArray.concat(_questionArray) ;
		}
		if(this.questionArray.length === this.wholeBoxAmount){
		/* 与えられた配列個数がフォームの個数より多いなら、フォーム数の数だけ切り取る */
		}else if(this.questionArray.length > this.wholeBoxAmount){
			console.log(this.questionArray.length) ;
			this.questionArray = this.questionArray.slice(0, this.wholeBoxAmount) ;
		/* 逆に少ないなら、その数ぶんだけ undefined を配列に入れてあげる */
		}else if(this.questionArray.length < this.wholeBoxAmount){
			for(var i = 0; i < (this.wholeBoxAmount - this.questionArray.length); ++i){
				this.questionArray.push(undefined) ;
			}
		}
		// console.log(this.questionArray.length) ;
	} ,

	/* テスト用の配列 を代入する */
	assignTestArray : function(){
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

	/* 配列の中身がボックスに入力すべき以外の値なら、undefined を代入する */
	isNumberInArray : function(){
		for(var i=0; i < this.wholeBoxAmount; ++i){
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

	/* AFormStatus オブジェクトに入れて、様々なパラメータを持たせる */
	putInProgressObject : function(){
		this.questionArrayObject = new SolveNumberPlace.Solve.AFormStatus(this.wholeBoxAmount) ;
		// console.log(this.questionArrayObject) ;
		for(var i=0; i < this.wholeBoxAmount; ++i){
			if(this.questionArray[i] !== undefined){
				this.questionArrayObject.done[i] = true ;
				this.questionArrayObject.number[i] = this.questionArray[i] ;
				this.questionArrayObject.candidates[i] = undefined ;
			}else{
				/* 値の入っていないマスは、1~wholeBoxSize を候補値として入れる */
				for(var k=1; k <= this.wholeBoxSize; ++k){
					this.questionArrayObject.candidates[i].push(k) ;
				}
			}
		}
	} ,

	/* 二次元配列風に配列を取得したいとき */
	getTwoDimensionalArray : function(_x, _y, _array){
		try{
			return _array[(_x + _y * this.wholeBoxSize)] ;
		}catch(e){
			console.log("Error in getTwoDimensionalArray function. x = " + _x + ", y = " + _y) ;
			return -1 ;  // エラー時はとりあえず -1 を渡す
		}
	} ,

	/* １列・１行・１領域内に数値の重複がないか調べる */
	isLegalNumberPlace : function(_formStatusObject){
		/* 初期化 */
		var oneRegion   = [] ;
		for(var i = 0; i < this.wholeBoxSize; ++i){
			oneRegion[i] = [] ;
		}

		for(var y = 0; y < this.wholeBoxSize; ++y){
			var lineNumbers = [] ;
			var rowNumbers  = [] ;
			for(var x = 0; x < this.wholeBoxSize; x++){
				if(this.getTwoDimensionalArray(x, y, _formStatusObject.done) === true){
					/* 横行の重複について調べる */
					if( this.isExistInArray(this.getTwoDimensionalArray(x, y, _formStatusObject.number), lineNumbers) === false ){
						lineNumbers.push(this.getTwoDimensionalArray(x, y, _formStatusObject.number)) ;
						// console.log(lineNumbers) ;
					}else{
						console.log("line overlap Error") ;
						this.progress.error = true ;
						this.progress.errorPlace = [ x, y ] ;
						return false ;
					}

					/* ここで １領域内の重複について調べる */
					var region = Math.floor(x / this.regionWidth) + Math.floor(y / this.regionHeight) * this.regionHeight ;
					if( this.isExistInArray(this.getTwoDimensionalArray(x, y, _formStatusObject.number), oneRegion[region]) === false ){
						oneRegion[region].push(this.getTwoDimensionalArray(x, y, _formStatusObject.number)) ;
						// console.log(oneRegion[region]) ;
					}else{
						console.log("region overlap Error") ;
						this.progress.error = true ;
						this.progress.errorPlace = [ x, y ] ;
						return false ;
					}
				}
				/* 縦列の重複について調べる */
				if(this.getTwoDimensionalArray(y, x, _formStatusObject.done) === true){
					if( this.isExistInArray(this.getTwoDimensionalArray(y, x, _formStatusObject.number), rowNumbers) === false ){
						rowNumbers.push(this.getTwoDimensionalArray(y, x, _formStatusObject.number)) ;
					}else{
						console.log("row overlap Error") ;
						this.progress.error = true ;
						this.progress.errorPlace = [ y, x ] ;
						return false ;
					}
				}
			}
		}
		return true ;
	} ,

	/* 与えられた変数が、与えられた配列のいずれかと一致するか */
	isExistInArray : function(_targetVariable, _array){
		if(_targetVariable === undefined || _array === undefined){return undefined ;}
		for(var i=0; i < _array.length; ++i){
			if(_targetVariable === _array[i]){
				return true ;
			}
		}
		return false ;
	} ,

	/*** 候補を消していく ***
	 *** アルゴリズム的にはメイン部分 ***/
	reduceCandidates : function(){
		/* 各フォームごとに、タテヨコ領域内の重複している値を調べ、取り除く */
		this.lookOverlapForReduceCandidates() ;

		/* すべてが done なら処理は終わり */
		if(this.progress.complete === true){
			return true ;
		}else{
			/* 解決できていなかった場合、候補の値の１つを入れてみる */
			/* 経験上、候補は上の段階で最小２個まで絞られるはずだが、いちおう4まで */
			var FIRST_CHOICE_FROM_X_CANDIDATE = 2 ;
			var LAST_CHOICE_FROM_X_CANDIDATE  = 4 ;
			
			// console.log("難しい問題だね・・・") ;
			for(var i = FIRST_CHOICE_FROM_X_CANDIDATE; i <= LAST_CHOICE_FROM_X_CANDIDATE; ++i){
				if( this.tryChoiceCandidate(i) === true ){
					this.progress.complete = true ;
					break ;
				}
			}
		}
		return true ;
	} ,

	/* 周辺フォームの自分自身との重複を見る */
	lookOverlapForReduceCandidates : function(){
		do{
			console.log(this.questionArrayObject.candidates) ;  // 経過を表示してみる
			var someChanged = false ;
			for(var y = 0; y < this.wholeBoxSize; ++y){
				for(var x = 0; x < this.wholeBoxSize; ++x){
					if(this.getTwoDimensionalArray(x, y, this.questionArrayObject.done) === false){
						var aroundNumbers = [] ;
						/* 縦・横・領域内で重複する値を、候補から削る */
						for(var k = 0; k < this.wholeBoxSize; ++k){
							/* 横行を見る */
							if( (this.getTwoDimensionalArray(k, y, this.questionArrayObject.done) === true) && (k !== x) ){
								if(this.isExistInArray( this.getTwoDimensionalArray(k, y, this.questionArrayObject.number), aroundNumbers) === false){
									aroundNumbers.push(this.getTwoDimensionalArray(k, y, this.questionArrayObject.number)) ;
								}
							}
							/* 縦列を見る */
							if( (this.getTwoDimensionalArray(x, k, this.questionArrayObject.done) === true) && (k !== y) ){
								if(this.isExistInArray( this.getTwoDimensionalArray(x, k, this.questionArrayObject.number), aroundNumbers) === false){
									aroundNumbers.push(this.getTwoDimensionalArray(x, k, this.questionArrayObject.number)) ;
								}
							}
						}
						// console.log(aroundNumbers) ;
						/* 領域内を見る */
						var x2Start = Math.floor(x / this.regionWidth  ) * this.regionWidth ;
						var y2Start = Math.floor(y / this.regionHeight ) * this.regionHeight ;
						for(var y2 = y2Start; y2 < ( y2Start + this.regionHeight ); ++y2){
							for(var x2 = x2Start; x2 < ( x2Start + this.regionWidth ); ++x2){
								if( (this.getTwoDimensionalArray(x2, y2, this.questionArrayObject.done) === true) && (x2 !== x) && (y2 !== y) ){
									if(this.isExistInArray( this.getTwoDimensionalArray(x2, y2, this.questionArrayObject.number), aroundNumbers) === false){
										aroundNumbers.push(this.getTwoDimensionalArray(x2, y2, this.questionArrayObject.number)) ;
									}
								}
							}
						}
						/* 候補の値一覧から、aroundNumbers にある値は消去する */
						// console.log("aroundNumbers : " + aroundNumbers) ;
						this.questionArrayObject.candidates[x + y * this.wholeBoxSize] = this.dropArray( this.getTwoDimensionalArray(x, y, this.questionArrayObject.candidates), aroundNumbers ) ;
						/* 一意に絞られた値があるかチェック、あったら代入 */
						if(this.putUniqueCandidateNumber() === true){
							someChanged = true ;
						}
					}
				}
			}
		}while(someChanged === true) ;

		if(this.isCompleteAnswer() === true){
			this.progress.complete = true ;
		}
		return this.progress.complete ;
	} ,

	/* targetArray から dropperArray と重複する値を引き抜く */
	dropArray : function(_targetArray, _dropperArray){
		var filteredArray = [] ;
		for(var i = 0; i < _targetArray.length; ++i){
			var equalFlag = false ;
			for(var j = 0; j < _dropperArray.length; ++j){
				if(_targetArray[i] === _dropperArray[j]){
					equalFlag = true ;
				}
			}
			if(equalFlag === false){
				filteredArray.push(_targetArray[i]) ;
			}
		}
		return filteredArray ;
	} ,

	/* 候補の値が１つに絞られたら、その値を代入し、changedTimes を +1 */
	putUniqueCandidateNumber : function(){
		var pushedFlag = false ;
		for(var i = 0; i < this.wholeBoxAmount; ++i){
			if((this.questionArrayObject.done[i] === false) && (this.questionArrayObject.candidates[i].length === 1)){
				this.questionArrayObject.number[i] = Number(this.questionArrayObject.candidates[i][0]) ;
				this.questionArrayObject.done[i] = true ;
				this.questionArrayObject.candidates[i] = undefined ;
				++this.progress.changedTimes ;
				pushedFlag = true ;
			}
		}
		return pushedFlag ;
	} ,

	/* 全てが done か調べる */
	isCompleteAnswer : function(){
		for(var i = 0; i < this.wholeBoxAmount; ++i){
			if(this.questionArrayObject.done[i] !== true){
				return false ;
			}
		}
		return true ;
	} ,

	/* targetCandidatesAmount 個に候補が絞れてる場合は、ためしに入れてみる */
	tryChoiceCandidate : function(targetFormCandidatesAmount){
		console.log(targetFormCandidatesAmount + " 個の候補から選ぶ") ;
		do{
			var previousChangedTimes = this.progress.changedTimes ;

			for(var i = 0; i < this.wholeBoxAmount; ++i){
				if( this.questionArrayObject.done[i] === false ){
					var candidatesLength = this.questionArrayObject.candidates[i].length ;
					if( candidatesLength <= targetFormCandidatesAmount ){
						var saveArray = this.copyFormStatusObject(this.questionArrayObject) ;
						// console.log("save = " + saveArray) ;
						for(var k = 0; k < candidatesLength; ++k){
							console.log(k + " 番目の候補値を入れてみる") ;
							/* 候補を入れてみる前に、一時的に配列を保存しておく */
							/* 候補のうちのひとつ、 k 番目の候補を入れてみる */
							++this.progress.changedTimes ;
							this.questionArrayObject.number[i] = this.questionArrayObject.candidates[i][k] ;
							this.questionArrayObject.done[i] = true ;
							this.questionArrayObject.candidates[i] = undefined ;
							this.lookOverlapForReduceCandidates() ;
							if( this.progress.complete === false ){
								/* 上手く解けないなら一時保存の配列に姿を戻す */
								console.log("解けない!!!!!戻す!!!!") ;
								this.questionArrayObject = this.copyFormStatusObject(saveArray) ;
								--this.progress.changedTimes ;
								this.progress.error = false ;
								this.progress.errorPlace = [] ;
							}else{
								return true ;
							}
						}
					}
				}
			}
		}while( previousChangedTimes - this.progress.changedTimes > 0 ) ;
		return false ;
	} ,

	/* AFormStatus Object のコピーを作る */
	copyFormStatusObject : function(_formStatusObject){
		var saveArray = new SolveNumberPlace.Solve.AFormStatus(this.wholeBoxAmount) ;
		for(var i = 0; i < this.wholeBoxAmount; ++i){
			saveArray.done[i]       = _formStatusObject.done[i] ;
			saveArray.number[i]     = _formStatusObject.number[i] ;
			saveArray.candidates[i] = _formStatusObject.candidates[i] ;
		}
		return saveArray ;
	}
} ;



/*** SolveNumberPlace.MakeForm   **************************/
/**********************************************************/
/*********************   入力のためのフォームを用意する ***/
SolveNumberPlace.MakeForm = function(_regionWidth, _regionHeight){
	this.setRegionSize(_regionWidth, _regionHeight) ;
} ;

SolveNumberPlace.MakeForm.prototype = {
	mainProcess : function(){
		"use strict" ;
		var outputTextAreaElement = document.getElementById("outputTextArea") ;
		outputTextAreaElement.value = "" ;
		this.writeHtml() ;
	} ,

	setRegionSize : function(_regionWidth, _regionHeight){
		if(_regionWidth === undefined){
			this.regionWidth = 3 ;
		}else{
			this.regionWidth = _regionWidth ;
		}
		if(_regionHeight === undefined){
			this.regionHeight = 3 ;
		}else{
			this.regionHeight = _regionHeight ;
		}
		this.wholeBoxSize = this.regionHeight * this.regionWidth ;
		this.wholeBoxAmount = this.wholeBoxSize * this.wholeBoxSize ;
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
									   + (i * this.wholeBoxSize + j) + "\" "
									   + "value=\"\">") ;
			}
			stringsInFormsArea += "<br>" ;
		}
		
		stringsInFormsArea += "<input type=\"button\" id=\"submitFormsNumberButton\" name=\"buttonBelowNumberPlaceForms\" value=\"実行\">" ;
		stringsInFormsArea += "<input type=\"button\" id=\"deleteFormsNumberButton\" name=\"buttonBelowNumberPlaceForms\" value=\"消す\">" ;
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
						|| (pushedKey.keyCode ===13) // Enter
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
		/* Enter キーは、右矢印キーと同じ効果 */
		else if(pushedKeyCode === 13){
			var nextFormIndex = rightSideIndex ;
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
		this.solveObject = new SolveNumberPlace.Solve(questionArray, this.regionWidth, this.regionHeight) ;
		console.time("Solve Time") ;
		this.solveObject.mainProcess() ;
		console.timeEnd("Solve Time") ;

		/* 扱いやすいよう、解答配列を読み取って this.answeredArray に渡す */
		this.answeredArray = [] ;
		this.answeredArray = this.answeredArray.concat(this.solveObject.answerArray) ;
		this.outputAnswerToForms() ;
	} ,
	
	/* 解答を、テキストエリアやフォームに出力する */
	outputAnswerToForms : function(){
		var numberPlaceInputFormsElements = document.getElementsByClassName("numberPlaceForm") ;
		var outputTextAreaElement = document.getElementById("outputTextArea") ;
		var outputElement = document.getElementById("output") ;
		/* 出力エリアを空白で初期化 */
		var outputString = "" ;
		outputTextAreaElement.value = outputString ;
		outputElement.innerHTML = outputString ;

		/* 解けたところ、もしくはユーザーが入力した値をフォームに出力 */
		for(var i = 0; i < numberPlaceInputFormsElements.length; ++i){
			if(this.answeredArray[i] !== undefined){
				numberPlaceInputFormsElements[i].value = this.answeredArray[i] ;
			}else if(this.solveObject.questionArray[i] !== undefined){
				numberPlaceInputFormsElements[i].value = this.solveObject.questionArray[i] ;
			}else{
				numberPlaceInputFormsElements[i].value = "" ;
			}
		}
		/* 答えが導けた場合、フォームやテキストエリアに答えを記入 */
		if(this.solveObject.progress.complete === true){
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
			outputTextAreaElement.value = outputString ;
			outputElement.innerHTML = outputString.replace(/[\n]/g, "<br>") ;
		}else{
			if(this.solveObject.progress.error === true){
				outputString = "入力された問題は、数字の重複があるため解けませんでした" ;
				console.log("errorPlaceI : " + this.solveObject.progress.errorPlace[0]
							+ ", errorPlaceJ : " + this.solveObject.progress.errorPlace[1] ) ;
				/* 重複のある問題箇所のフォームへフォーカス */
				numberPlaceInputFormsElements[ this.solveObject.progress.errorPlace[0] + this.solveObject.progress.errorPlace[1] * this.wholeBoxSize ].focus() ;
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
			outputTextAreaElement.value = outputString ;
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


/* 未完成 :::: JSON ファイルの中の配列を取ってくる */
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
