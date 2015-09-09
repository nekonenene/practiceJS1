/*** ver 1.0 : 2015/09/07 Mon, AM 2:30 ***
 *** chapter3~5 の内容を少しずつ ***
 *** 9 の倍数の各桁を足したとき 9 の倍数になるが、規則性はあるのかを見る ***/
 
window.addEventListener("load", function () {

    var h1Tag = document.getElementsByTagName("h1") ;
    h1Tag[0].style.color = "red" ;

    var h2FirstOutput = document.getElementById("h2FirstOutput") ;
    h2FirstOutput.innerHTML = "" ;

    var nineForH2 = new Nine() ;
    nineForH2.setArraySize(7) ;
    nineForH2.setBeMultipliedLimit(10001) ;
    nineForH2.showDiv9OfSumDigitsOf9Multiple(h2FirstOutput) ;

    /* コンソールログにすべての properties, methods を表示 */
    // var  mathProperties = "Math properties :::: <br>" ;
    // mathProperties += (Object.getOwnPropertyNames( Math ).join("<br>")) ;
    // h2FirstOutput.innerHTML += mathProperties ;
}, false) ;


/* 各桁の値を足して合計を求める関数 */
function sumDigits(integer){
    var ans = 0 ;

    var tmp = integer ;
    while(tmp != 0){
	ans += tmp % 10 ;
	tmp = Math.floor(tmp / 10) ;
    }

    // console.log(integer + " の各桁を足すと " + ans);
    return ans ;
}

var Nine = function(){
    var arraySize = 10 ;
    var beMultipliedLimit = 100 ;
    this.arraySize = arraySize ;  // JavaScript には定数はない（const は IE非対応）
    this.beMultipliedLimit = beMultipliedLimit ;
};

Nine.prototype.setArraySize = function(intNum){
    if(intNum >= 0){
	this.arraySize = Math.floor(intNum) ;
    }
    console.log("new arraySize = " + this.arraySize) ;
};
Nine.prototype.setBeMultipliedLimit = function(intNum){
    if(intNum >= 0){
	this.beMultipliedLimit = Math.floor(intNum) ;
    }
};
Nine.prototype.getArraySize = function(){ return this.arraySize; };
Nine.prototype.getBeMultipliedLimit = function(){ return this.beMultipliedLimit; };

/* 9の倍数の各桁を足したとき、9の何倍になっているかを見る */
Nine.prototype.pushDiv9OfSumDigitsOf9Multiple = function(){
    console.log("start pushDiv9 " + this.arraySize ) ;
    var answerArray = [] ;
    this.answerArray = answerArray ;
    for (var i = 0; i < this.arraySize; ++i){
	this.answerArray.push(i) ;
	this.answerArray[i] = [] ;
	// this.answerArray[i] = new Array() ; こうも書ける。わかりやすげ。
    }

    for(var intNumber = 0; intNumber < this.beMultipliedLimit; ++intNumber){
	var multiply9 = intNumber * 9 ;

	var div9Sum = sumDigits(multiply9) / 9 ;
	if(div9Sum < this.arraySize){
	    this.answerArray[div9Sum].push(intNumber) ;
	}
    }
    console.log("this.answerArray[1] = " + this.answerArray[1]) ;

    return this.answerArray ;
};

/* 上の関数の結果を ele の中に入れて見せる */
Nine.prototype.showDiv9OfSumDigitsOf9Multiple = function(ele){
    console.log("arraySize in showDiv9 = " + this.arraySize) ;
    ele.innerHTML = "" ;
    ele.innerHTML += "各桁の合計が 9 の x 倍 になるのは、9 を y でかけたとき<br>\
（※ y は 0 ～ " + (this.beMultipliedLimit - 1) + " とする）<br>" ;

    var answerArray = this.pushDiv9OfSumDigitsOf9Multiple() ;
    console.log("showDiv9 : ansAry[1] = " + answerArray[1]) ;
    for(var i = 0; i < this.arraySize; ++i){
	if(answerArray[i].length != 0){
	    ele.innerHTML += "<p class=\"divNineAnswer\">\n\
	    \t" + "x = " + i + "<br>\n\
	    \t" + "y = " + answerArray[i].join(", ") + "<br><br>\n\
	    </p>" ;
	}
    }
};
