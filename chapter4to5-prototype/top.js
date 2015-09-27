"use strict" ;

window.addEventListener("load", function () {

	var h1Tag = document.getElementsByTagName("h1") ;
	h1Tag[0].style.color = "red" ;

	var outputElement1 = document.getElementById("output1") ;
	var str = "" ;

	var mathExtend = new MathExtend() ;
	str += "55 : " + mathExtend.countDigit(55) ;
	str += "<br>11303516 : " + mathExtend.countDigit(11303516) ;

	var randomInt = mathExtend.randomInt(10) ;
	var mathExtendExtend = new MathExtendExtend() ;
	str += "<br>MathExtendExtend.sumDigits(456) = " + mathExtendExtend.sumDigits(456) ;
	str += "<br>MathExtendExtend.sumDigits(" + randomInt + ") = " + mathExtendExtend.sumDigits(randomInt) ;

	outputElement1.innerHTML = str ;
	console.log(mathExtend.randomInt(4)) ;

}, false) ;


var MathExtend = function(){} ;

/* 何桁か数える */
MathExtend.prototype.countDigit = function(value){
	if(value === undefined){
		return false ;
	}else{
		var valueCountDigit = value ;
	}
	var digitCounter = 0 ;

	if(valueCountDigit < 0){
		valueCountDigit *= (-1) ;
	}

	do{
		valueCountDigit = parseInt(valueCountDigit / 10) ;
		++digitCounter ;
	}while(valueCountDigit != 0)

	return digitCounter ;
} ;


/* 指定桁の整数を作り出す */
MathExtend.prototype.randomInt = function(digit){
	if(digit === undefined){
		var digitRandomInt = 3 ;  // -999 ~ 999
	}else{
		var digitRandomInt = digit ;
	}

	// 0 ~ (limit*2) のランダムな値を出す
	var twiceLimit = Math.floor( Math.random() * (Math.pow(10, digitRandomInt) * 2) ) ;

	return ( twiceLimit - ( Math.pow(10, digitRandomInt) - 1 ) ) ;
} ;


/**********************************************
 ****     prototype を利用した「継承」     ****
 **********************************************/
/* MathExtendExtend という MathExtend の拡張を作る */
var MathExtendExtend = function(){} ;
MathExtendExtend.prototype = new MathExtend() ;

/* 各桁の数を足し合わせる */
MathExtendExtend.prototype.sumDigits = function(value){
	if(value === undefined){
		return false ;
	}else if(value < 0){
		var valueSumDigits = value * (-1) ;
	}else{
		var valueSumDigits = value ;
	}
	var digits = this.countDigit(valueSumDigits) ;
	var sumDigitsResult = 0 ;


	for(var i=0; i < digits; ++i){
		sumDigitsResult += ( valueSumDigits % 10 ) ;
		// console.log(this.sumDigitsResult) ;
		valueSumDigits = parseInt(valueSumDigits / 10) ;
	}
		
	return sumDigitsResult ;
} ;
