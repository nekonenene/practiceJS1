
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
				chunk = "" ;
			}
		}
		console.log("chunk = " + chunk) ;

		
		/* 入力は入力フォームに入れるか、html の miku div 内に入れる */
		
		/* 2015/10/02         *
		 * バックトラックによる経路探索           */
		/* 末尾の無駄な半角スペースとTab、無駄な改行は削る */
		chunk = chunk.replace(/([ \t]{1,}|\s)+$/gm, "") ;
		var inputNumber = chunk.toString().split(/[ \n]/) ;

		var NODE_QUANTITY = 7 ;  // 頂点の数

		/* A -> G へ向かえる道を探索する */
		var arriveTable =  [ [ 1,  2, -1    ], // A : 0
							 [ 0,  2,  3, -1], // B : 1
							 [ 0,  1,  4, -1], // C : 2
							 [ 1,  4,  5, -1], // D : 3
							 [ 2,  3,  6, -1], // E : 4
							 [ 3, -1        ], // F : 5
							 [ 4, -1        ]  // G : 6
						   ] ;

		var answer = "" ;

		var path = [] ;

		function searchNode(_advanced, _currentNode, _goalNode){
			path[_advanced] = _currentNode ;
			console.log("path = " + path) ;
			if(_currentNode == _goalNode){
				console.log("到達しました") ;
				printPath(_advanced) ;
			}else{
				for(var i = 0; i < arriveTable[_currentNode].length; ++i){
					var nextNode = arriveTable[_currentNode][i] ;
					if(nextNode === -1){ continue ; }
					if(isIncludeInArray(nextNode, path, _advanced) === false){
						searchNode( _advanced + 1, nextNode, _goalNode) ;
					}
				}
			}
		} ;

		// console.log("A".charCodeAt(0)) ; // A のコード番号を出す

		/* Path を前方 _length までアルファベットに直し出力 */
		function printPath(_length){
			for(var i = 0; i < _length; ++i){
				answer += String.fromCharCode("A".charCodeAt(0) + path[i]) ;
				answer += ", " ;
			}
			answer += "G<br>" ;
		}

		/* _value が _array の前方 _length 内にあれば true */
		function isIncludeInArray(_value, _array, _length){
			for(var i = 0; i < _length; ++i){
				if(_array[i] === _value){
					return true ;
				}
			}
			return false ;
		} ;

		searchNode(0, 0, 6) ;
		
		var outputElement = document.getElementById("output") ;
		outputElement.innerHTML = answer ;  // outputElementment に出力
		
		console.log("end") ;

		return 0 ;
	} ;
	
	document.getElementById("lessonTitle").innerHTML
		= "Lesson2 : バックトラックによる経路探索" ;

	doIt() ;
	console.timeEnd("Loading Time") ;

}, false) ;
