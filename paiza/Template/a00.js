
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
				return (-1) ;
			}
		}
		console.log("chunk = " + chunk) ;

		
		/* 入力は入力フォームに入れるか、html の miku div 内に入れる */
		/* 以下をコピーする */
		
		/* 2015/         *
		 * A0 :         */
		/* 末尾の無駄な半角スペースとTab、無駄な改行は削る */
		chunk = chunk.replace(/([ \t]{1,}|\s)+$/gm, "") ;
		var inputNumber = chunk.toString().split(/[ \n]/) ;
		
		for(var i = 0; i < inputNumber.length ; ++i){
			inputNumber[i] = parseFloat(inputNumber[i].match(/[0-9]+/)) ;
		}


		
		/* 以上をコピーする */
		var outputElement = document.getElementById("output") ;
		outputElement.innerHTML = "something" ;  // outputElementment に出力
		
		console.log(inputNumber) ;
		console.log("end") ;

		return 0 ;
	} ;
	
	doIt() ;
	console.timeEnd("Loading Time") ;

}, false) ;
