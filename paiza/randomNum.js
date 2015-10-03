
window.addEventListener("load", function () {
	
	document.getElementById("randNumDo").addEventListener("click", function(){
		outputRandomNum2() ;
	},  false) ;


}, false) ;

function outputRandomNum(){
	// var outputEle = document.getElementById("randNumOutput") ;
	var outputEle = document.getElementById("randOutputArea") ;

	outputEle.value = "しばらくお待ちください" ;

	var width  = parseInt(document.getElementsByName("inputForRandNum")[0].value, 10) ;
	var height = parseInt(document.getElementsByName("inputForRandNum")[1].value, 10) ;
	var min    = parseInt(document.getElementsByName("inputForRandNum")[2].value, 10) ;
	var max    = parseInt(document.getElementsByName("inputForRandNum")[3].value, 10) ;

	var outputStr = "" ;
	// いちいち outputEle.innerHTML += ... するよりは、
	// 一度 outputStr に入れてから代入する方が、圧倒的に処理が速い
	for(var i=0; i<height; ++i){
		for(var j=0; j<width; ++j){
			outputStr += parseInt( Math.random() * (max-min+1) ) + Number(min) ;
			if( j === (width - 1) ){
				outputStr += "\n" ;
			}else{
				outputStr += " " ;
			}
		}
	}
	outputEle.value = outputStr ;
} ;

/* min ~ limitMax の値を必ず１つは出力する */
function outputRandomNum2(){
	// var outputEle = document.getElementById("randNumOutput") ;
	var outputEle = document.getElementById("randOutputArea") ;

	outputEle.value = "しばらくお待ちください" ;

	var width  = parseInt(document.getElementsByName("inputForRandNum")[0].value, 10) ;
	var height = parseInt(document.getElementsByName("inputForRandNum")[1].value, 10) ;
	var min    = parseInt(document.getElementsByName("inputForRandNum")[2].value, 10) ;
	var limitMax    = parseInt(document.getElementsByName("inputForRandNum")[3].value, 10) ;

	// いちいち outputEle.innerHTML += ... するよりは、
	// 一度 outputStr に入れてから代入する方が、圧倒的に処理が速い
	var array = [] ;
	do{
		var newNumber = parseInt( Math.random() * (height) ) + Number(min) ;
		if( isInArray(newNumber, array) === false ){
			array.push(newNumber) ;
		}
	}while(array.length < height )

	for(var i = 0; i < array.length; ++i){
		if(array[i] > limitMax){
			array[i] = parseInt( Math.random() * (limitMax - min + 1) ) + Number(min) ;
		}
	}
			
	outputEle.value = array.join("\n") ;

	function isInArray(_value, _array){
		for(var i = 0; i < _array.length; ++i){
			if(_value === _array[i]){
				return true ;
			}
		}
		return false ;
	} ;
} ;
