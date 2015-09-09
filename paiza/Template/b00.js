
window.addEventListener("load", function (chunk) {

    chunk = document.getElementById("miku").innerHTML ;

    /* 以下をコピーする */

    /* 2015/  *
     *        */
    var lines = chunk.toString().split("\n") ;

    for(var i = 1; i <= lines[0] ; ++i){
	var cardNumeber = parseInt(lines[i], 10) ;
    }

    console.log("end") ;


}, false) ;
