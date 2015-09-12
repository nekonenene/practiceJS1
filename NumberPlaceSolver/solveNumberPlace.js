
var hoge = function(foo){
    this.bar = foo ;
    console.log(this.bar + "baz1" ) ;
    this.out = function(){
	console.log( this.bar + "baz2" ) ;
    } ;
    return this.out ;
} ;


window.addEventListener("load", function () {

    hoge(100 + this.out) ;

    /* フォームと実行ボタンを HTML に書き込む */
    var inputFormNumPlaceEle = document.getElementById("inputFormNumPlace") ;
    var strForm = "" ;
    strForm += "<form name=\"numPlaceForm\" accept-charset=\"utf-8\" style=\"margin:20px 15px;\">" ;
    for(var i=0; i<9; ++i){
	for(var j=0; j<9; ++j){
	    strForm += "<input type=\"text\" name=\"numPlace\" class=\"numPlace\" maxlength=\"1\" size=\"1\" pattern=\"[1-9]?\" id=\"numPlaceForm" + (i*9 + j) + "\">" ;
	}
	strForm += "<br>" ;
    }
    // 82th hidden form
    // strForm += "<input hidden=\"true\" type=\"text\" name=\"numPlace\" class=\"numPlace\" maxlength=\"1\" size=\"1\" pattern=\"[1-9]?\" tabIndex=\"" + i*9 + "\">" ;

    strForm += "<input type=\"button\" id=\"submitNumbersButton\" name=\"button\" value=\"実行\" style=\"margin:3px 0;\">" ;
    strForm += "</form>" ;

    inputFormNumPlaceEle.innerHTML = strForm ;

    /* フォームに入力されたあとにおこなう挙動を登録 */
    for(var i=0; i<9; ++i){
	for(var j=0; j<9; ++j){
	    document.numPlaceForm.numPlace[i*9 + j].onkeyup = function(){
		nextFrame(this) ;
	    } ;
	}
    }

    /* 実行ボタンを押された時の挙動を登録 */
    var submitNumbersButtonEle =
	    document.getElementById("submitNumbersButton") ;
    submitNumbersButtonEle.addEventListener("click", function(){
	submitNumbers() ;
    }, false) ;


    /* 下のテキストエリア : 今は使わない */
    var submitTextAreaButtonEle =
	    document.getElementById("submitTextAreaButton") ;
    submitTextAreaButtonEle.addEventListener("click", function(){
	var inputTextAreaEle = document.getElementById("inputTextArea") ;
	console.log("input = " + inputTextAreaEle.value) ;
    }, false) ;

    solveNumberPlace() ;
    
}, false) ;


/* フォームを限界文字数まで入力したら次のフレームへ */
function nextFrame(num) {
    if(num.value.length >= num.size){
	// console.log(num) ;
	var numFormIndex = Number( num.id.match(/[0-9]+$/) ) ;
	// console.log(numFormIndex) ;
	try{
	    document.numPlaceForm.numPlace[numFormIndex + 1].focus() ;
	}catch(err){
	    console.log("*Warning* can't move next form ") ;
	    document.numPlaceForm.numPlace[0].focus() ;
	}
    }
} ;


/* 実行ボタンを押されたら、フォームの数字を取得し、配列 numPlaceNumbers にひとつずつ入れる
 * 1～9 以外の値だったら代入せず、ボックスの中も空白にする */
function submitNumbers(){
    // console.log("押されました") ;
    var numPlaceEles = document.getElementsByClassName("numPlace") ;
    var numPlaceNumbers = [] ;
    for(var i=0; i < numPlaceEles.length; ++i){
	var pushValue = numPlaceEles[i].value ;
	if(pushValue.search(/[1-9]/) === -1){
	    if(pushValue.search(/[１-９]/) !== -1){  // 全角は直してあげる
		pushValue = pushValue.replace(/[１-９]/g, function(s) {
		    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
		});
		numPlaceEles[i].value = pushValue ;
	    }else{
		numPlaceEles[i].value = "" ;
		pushValue = "" ;
	    }
	}
	numPlaceNumbers.push(pushValue) ;
    }
    console.log("input = " + numPlaceNumbers) ;

    return numPlaceNumbers ;
} ;

/* 与えられた 81 個の数列から、ナンバープレースを解く */
function solveNumberPlace(){
    console.time("solveNumberPlaceTimer") ;
    console.log("start") ;

    var numbersDoubleArray = new Array(9) ;
    for(var i=0; i<numbersDoubleArray.length; ++i){
	numbersDoubleArray[i] = new Array(9) ;
    }

    // test array
    numbersDoubleArray = [
	[ , ,8,2, ,3,1, , ],
	[ , ,6,1, ,5,8, , ],
	[1,5, , , , , ,3,9],
	[4,1, ,6, ,9, ,5,8],
	[ , , , ,2, , , , ],
	[6,9, ,5, ,1, ,2,4],
	[8,3, , , , , ,7,6],
	[ , ,5,3, ,4,9, , ],
	[ , ,9,7, ,8,5, , ]
    ] ;
    

    
    console.timeEnd("solveNumberPlaceTimer") ;
} ;
