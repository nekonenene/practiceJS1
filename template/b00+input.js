
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

	/* 2015/         *
	 * B00 :         */
	chunk = chunk.replace(/([ \t]{1,})|\s+$/gim, "") ; // 半角スペースとTab、無駄な改行は削る
	var lines = chunk.toString().split("\n") ;
	console.log("chunk = " + chunk) ;

	for(var i = 0; i < lines.length ; ++i){
		var num = lines[i].match(/[0-9]+/) ;
		num = parseInt(num, 10) ;
		console.log(num) ;
	}

	/* 以上をコピーする */

	outputEle.innerHTML = chunk ;
	
	console.log("end") ;

	return 0 ;
	} ;

	doIt() ;

}, false) ;
