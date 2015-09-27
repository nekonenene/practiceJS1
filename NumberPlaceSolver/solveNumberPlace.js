
/****************************************
	 package name : SolveNumberPlace 
	
		2015/9/12 - 2015/9/20
 ***************************************/
function SolveNumberPlace(){} ;

/******** SolveNumberPlace.Solve Object ********/
/*** 与えられた配列から、ナンバープレースを解く ***/
SolveNumberPlace.Solve = function(regionHeight, regionWidth){
	"use strict" ;
	var questionArray = undefined ;

	if( (regionHeight !== undefined) && (0 < regionHeight) && (regionHeight < 10) ){
		this.regionHeight  = regionHeight ;
	}else{
		this.regionHeight = 3 ;
	} ;

	if( (regionWidth !== undefined) && (0 < regionWidth) && (regionWidth < 10) ){
		this.regionWidth  = regionWidth ;
	}else{
		this.regionWidth = 3 ;
	} ;

	this.wholeBoxSize = regionHeight * regionWidth ;  // 縦or横に並ぶフォームの数
	this.wholeBoxAmount = this.wholeBoxSize * this.wholeBoxSize ;  // フォームの全体個数
} ;


SolveNumberPlace.Solve.prototype = {
	/****  メイン部分、ここを実行することで答えを求め始める  ****/
	mainProcess : function(){
		this.completeAnswerFlag = false ;
		this.adjustQuestionArray() ;
		/* questionArray を 二次元配列 twoDimensionalQuestionArray に矯正する */
		this.putInTwoDimensionalArray() ;
		if( this.isLegalNumberPlace(this.twoDimensionalQuestionArray) ){
			this.reduceCandidates() ;
		}

		/* 答えを配列にして入れる */
		this.answeredArray = this.outputTwoDimensionalQuestionArray().concat() ;

		console.log("Question : " + this.getQuestionArray()) ;
		console.log("Answer   : " + this.answeredArray) ;
		// console.log("complete? : " + this.completeAnswerFlag) ;
	} ,

	/* 要求された １領域のタテヨコの長さに合わせて、questionArray を調整 */
	adjustQuestionArray : function(){
		/* _questionArray が未定義のときのエラー処理 */
		if(this.getQuestionArray() === undefined){
			console.log("*Error* Question array is NOT legal. test mode starts now.") ;
			/* テスト配列を代入（エラー時） */
			this.regionHeight = 3 ;
			this.regionWidth  = 3 ;
			this.assignTestArray() ;
		}else if(this.getQuestionArray().length > this.wholeBoxAmount){
			/* 与えられた配列個数がフォームの個数より多いなら、フォーム数の数だけ切り取る */
			this.getQuestionArray() = this.getQuestionArray().slice(0, this.wholeBoxAmount) ;
		}

		/* 配列の中身が ボックスに入力する番号 以外の値なら、 undefined を代入する */
		for(var i=0; i < this.getQuestionArray().length; ++i){
			var pushValue = this.getQuestionArray()[i] ;
			pushValue = String(pushValue).replace(/[０-９]/g, function(em){ // 全角は直す
				return String.fromCharCode(em.charCodeAt(0) - 0xFEE0);
			});
			pushValue = parseInt(pushValue) ; // 整数に直す
			
			if( (0 < pushValue) && (pushValue <= this.wholeBoxSize) ){
				this.getQuestionArray()[i] = pushValue ;
			}else{
				this.getQuestionArray()[i] = undefined ;
			}
		}
	} ,

	assignTestArray : function(){
		this.setRegionWidth(3)  ;
		this.setRegionHeight(3) ;
		this.wholeBoxSize = this.regionHeight * this.regionWidth ;
		this.wholeBoxAmount = this.wholeBoxSize * this.wholeBoxSize ;
		// テスト用の配列 を代入する
		this.setQuestionArray( [
			 , ,8,2, ,3,1, , ,
			 , ,6,1, ,5,8, , ,
			1,5, , , , , ,3,9,
			4,1, ,6, ,9, ,5,8,
			 , , , ,2, , , , ,
			6,9, ,5, ,1, ,2,4,
			8,3, , , , , ,7,6,
			 , ,5,3, ,4,9, , ,
			 , ,9,7, ,8,5, ,  ] ) ;
	} ,

	/* questionArray は一次元配列なので、扱いやすいよう二次元配列に整え、代入 */
	putInTwoDimensionalArray : function(){
		this.twoDimensionalQuestionArray = [] ;
		
		for(var i=0; i < this.wholeBoxSize; ++i){
			this.twoDimensionalQuestionArray[i] = [] ;
			for(var j=0; j < this.wholeBoxSize; ++j){
				this.twoDimensionalQuestionArray[i][j] = {
					number : this.getQuestionArray()[i * this.wholeBoxSize + j],
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
	isLegalNumberPlace : function(targetTwoDimensionalArray){
		/* 初期化 */
		this.overlappedNumberProblemPlace = undefined ;
		var oneRegion   = [] ;
		for(var i = 0; i < this.wholeBoxSize; ++i){
			oneRegion[i] = [] ;
		}
		for(var i=0; i<this.wholeBoxSize; ++i){
			var lineNumbers = [] ;
			var rowNumbers  = [] ;
			
			for(var j=0; j<this.wholeBoxSize; j++){
				if(targetTwoDimensionalArray[i][j].done === true){
					/* 横行の重複について調べる */
					if( this.isExistInArray(targetTwoDimensionalArray[i][j].number, lineNumbers) === false ){
						lineNumbers.push(targetTwoDimensionalArray[i][j].number) ;
						// console.log(lineNumbers) ;
					}else{
						console.log("line overlap Error") ;
						this.overlappedNumberProblemPlace = [ i, j ] ;
						return false ;
					}

					/* ここで １領域内の重複について調べる */
					var region = Math.floor(i / this.regionHeight) * this.regionHeight  + Math.floor(j / this.regionWidth) ;
					if( this.isExistInArray(targetTwoDimensionalArray[i][j].number, oneRegion[region]) === false ){
						oneRegion[region].push(targetTwoDimensionalArray[i][j].number) ;
						// console.log(oneRegion[region]) ;
					}else{
						console.log("region overlap Error") ;
						this.overlappedNumberProblemPlace = [ i, j ] ;
						return false ;
					}
				}
				/* 縦列の重複について調べる */
				if(targetTwoDimensionalArray[j][i].done === true){
					if( this.isExistInArray(targetTwoDimensionalArray[j][i].number, rowNumbers) === false ){
						rowNumbers.push(targetTwoDimensionalArray[j][i].number) ;
					}else{
						console.log("row overlap Error") ;
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
		this.numberOfTimesPutCandidate = 0 ;  // 一意に絞られて代入したら +1

		/* 各フォームごとに、タテヨコ領域内の重複している値を調べ、取り除く */
		this.lookOverlapForReduceCandidates() ;

		/* 値の重複を消すだけでは解決できなかった場合、候補の値の１つを入れてみる */
		if(this.isCompleteAnswer() === true){
			this.completeAnswerFlag = true ;
		}else{
			// console.log("難しい問題だね・・・") ;
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
			var previousNumberOfTimes = this.numberOfTimesPutCandidate ;
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
						var mStart = Math.floor(i / this.regionHeight ) * this.regionHeight ;
						var nStart = Math.floor(j / this.regionWidth  ) * this.regionWidth ;
						for(var m = mStart; m < ( mStart + this.regionHeight ); ++m){
							for(var n = nStart; n < ( nStart + this.regionWidth ); ++n){
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
						/* 一意に絞られた値があるかチェック、あったら代入 */
						this.putUniqueCandidateNumber() ;
					}
				}
			}
			console.log(this.outputTwoDimensionalQuestionArray()) ;
		}while(previousNumberOfTimes - this.numberOfTimesPutCandidate > 0) ;
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

	/* 候補の値が１つに絞られたら、その値を代入し、 numberOfTimesPutCandidate を +1 */
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
		console.log("targetCandidates : " + targetFormCandidatesAmount) ;
		do{
			var previousNumberOfTimes = this.numberOfTimesPutCandidate ;

			for(var i = 0; i < this.wholeBoxSize; ++i){
				for(var j = 0; j < this.wholeBoxSize; ++j){
					if( this.twoDimensionalQuestionArray[i][j].done === false ){
						var candidatesLength = this.twoDimensionalQuestionArray[i][j].candidates.length ;
						if( candidatesLength <= targetFormCandidatesAmount ){
							for(var k = 0; k < candidatesLength; ++k){
								console.log("k = " + k) ;
								/* 候補を入れてみる前に、一時的に配列を保存しておく */
								var saveArray = this.saveTwoDimensionalQuestionArray() ;
								console.log(saveArray) ;
								/* 候補のうちのひとつ、 k 番目の候補を入れてみる */
								++this.numberOfTimesPutCandidate ;
								this.twoDimensionalQuestionArray[i][j].number
									= this.twoDimensionalQuestionArray[i][j].candidates[k] ;
								this.twoDimensionalQuestionArray[i][j].done = true ;
								this.twoDimensionalQuestionArray[i][j].candidates = undefined ;
								/* lookOverlapForReduceCandidates() の意義がある限り回し続ける */
								this.lookOverlapForReduceCandidates() ;
								if( this.isLegalNumberPlace(this.twoDimensionalQuestionArray) === false ){
									/* 上手く解けず、数値の重複が出たなら一時保存の配列に姿を戻す */
									--this.numberOfTimesPutCandidate ;
									this.twoDimensionalQuestionArray = saveArray ;
								}
								if( this.isCompleteAnswer(this.twoDimensionalQuestionArray) === true ){
									return true ;
								}
							}
						}
					}
				}
			}
		}while( previousNumberOfTimes - this.numberOfTimesPutCandidate > 0 ) ;
		return false ;
	} ,

	/* 三次元配列を参照でない方法でコピーする */
	saveTwoDimensionalQuestionArray : function(){
		console.log(this.twoDimensionalQuestionArray[0][1]) ;
		var copyArray = [] ;
		for(var i = 0; i < this.twoDimensionalQuestionArray.length; ++i){
			copyArray[i] = [] ;
			for(var j = 0; j < this.twoDimensionalQuestionArray[i].length; ++j){
				copyArray[i][j] = [] ;
				copyArray[i][j].number = this.twoDimensionalQuestionArray[i][j].number ;
				copyArray[i][j].done = this.twoDimensionalQuestionArray[i][j].done ;
				if(this.twoDimensionalQuestionArray[i][j].candidates === undefined){
					copyArray[i][j].candidates = undefined ;
				}else{
					copyArray[i][j].candidates = [] ;
					copyArray[i][j].candidates.push(this.twoDimensionalQuestionArray[i][j].candidates) ;
				}
			}
		}
		return copyArray ;
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
