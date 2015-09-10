
window.addEventListener("load", function () {

    var submitButtonEle = document.getElementById("doItButton") ;
    submitButtonEle.addEventListener("click", function(){
	// console.log("押されました") ;
	var inputAreaEle = document.getElementById("inputArea") ;
	console.log("input = " + inputAreaEle.value) ;
	doIt(inputAreaEle.value) ;
    }, false) ;

    var outputEle = document.getElementById("output") ;
    outputEle.innerHTML = "" ;

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

	
	/* 以下をコピーする */

	/* 2015/9/10         *
	 * B008 : 与えられた表から、毎ライブで収益が出るように計画する */
	chunk = chunk.replace(/\s+$/gim, "") ; // 無駄な改行は削る
	var lines = chunk.toString().split("\n") ;
	for(var i = 0; i < lines.length; ++i ){
	    lines[i] = lines[i].split(/\s+/) ;
	}
	// console.log("lines[1][2] = " + lines[1][2] + ", lines.length = " + lines.length) ;

	var profit = 0 ;
	if( lines[0][0] > 0 && lines[0][1] > 0 ){
	    for(var i = 1; i < lines.length; ++i){
		var oneLiveProfit = 0 ;
		for(var j = 0; j < lines[i].length; ++j){
		    oneLiveProfit += parseInt(lines[i][j], 10) ;
		}
		// console.log("oneLiveProfit = " + oneLiveProfit) ;
		if(oneLiveProfit > 0){
		    profit += oneLiveProfit ;
		}
	    }
	}else{
	    // N もしくは M が 0
	    // console.log("N or M is 0") ;
	}

	console.log(profit) ;

	/* 以上をコピーする */
	
	console.log("end") ;

	return 0 ;
    } ;

    doIt() ;

}, false) ;
