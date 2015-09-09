

window.addEventListener("load", function (chunk) {

    chunk = document.getElementById("b012").innerHTML ;
// 上記のどちらのやり方でも良い

    var lines = chunk.toString().split("\n") ;

    for(var i = 1; i <= lines[0] ; ++i){
	var cardNumeber = parseInt(lines[i], 10) ;
	var eachDigit = [] ;
	eachDigit[0] = "X" ;
	for(var j = 0; cardNumeber != 0 ; ++j){
	    eachDigit.push(cardNumeber % 10) ;
	    cardNumeber = Math.floor(cardNumeber/10) ;
	}

	var even = 0 ;
	var odd  = 0 ;
	for(var j = 1; j < eachDigit.length; ++j){
	    if((j+1) % 2 === 0){
		var tmp = eachDigit[j] * 2 ;
		while(tmp > 0){
		    even += tmp%10 ;
		    tmp = Math.floor(tmp/10) ;
		}
	    }else if((j+1) % 2 === 1){
		odd += eachDigit[j] ;
	    }else{
		console.log("***ERROR***") ;
	    }
	    // console.log("even : " + even + ", odd : " + odd) ;
	}
	var evenAndOdd = even + odd ;
	// even + odd + x は 10 の倍数になるはずなので、
	var x = 10 - (evenAndOdd % 10) ;
	if( x === 10 ){ x = 0; }
	console.log(x) ;
    }

    console.log("end") ;


}, false) ;
