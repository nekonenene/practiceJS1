
window.addEventListener("load", function () {

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

		var outputEle = document.getElementById("output") ;
		outputEle.innerHTML = "" ;
		
		/* 以下をコピーする */

		/* 2015/ 9/ 30    *
		 * B011 :  名刺バインダー管理   */
		chunk = chunk.replace(/([\t]{1,})|\s+$/gim, "") ; // Tab、無駄な改行は削る
		var lines = chunk.toString().split(" ") ;
		// console.log("chunk = " + chunk) ;

		var pocketAmount = lines[0] ;
		var cardId = lines[1] ; // やりやすいようにIDは 0 から始める
		/* lines[0] = １ページのポケット数,  line[1] = 名刺ID */
		/* 名刺が右か左かを見る */
		var isRight = false ;
		var pageId = parseInt( (cardId-1) / pocketAmount) ;
		if( pageId % 2 === 0 ){
			isRight = true ;
		}

		if(isRight){
			var addFrontAndBack = (pageId + 1) * pocketAmount * 2 + 1 ;
		}else{
			var addFrontAndBack = pageId * pocketAmount * 2 + 1 ;
		}

		var answer = Number(addFrontAndBack - cardId) ;

		console.log(answer) ;

		/* 以上をコピーする */

		outputEle.innerHTML = chunk ;
		
		console.log("end") ;

		return 0 ;
	} ;

	doIt() ;

}, false) ;
