

window.addEventListener("load", function () {

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

    /* 実行ボタンを押された時の挙動 */
    var submitNumbersButtonEle = document.getElementById("submitNumbersButton") ;
    submitNumbersButtonEle.addEventListener("click", function(){
	submitNumbers() ;
    }, false) ;


    /* 下のテキストエリア : 今回は使わない */
    var submitTextAreaButtonEle = document.getElementById("submitTextAreaButton") ;
    submitTextAreaButtonEle.addEventListener("click", function(){
	// console.log("押されました") ;
	var inputTextAreaEle = document.getElementById("inputTextTextArea") ;
	console.log("input = " + inputTextAreaEle.value) ;
    }, false) ;
    
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
    console.log("押されました") ;
    var numPlaceEles = document.getElementsByClassName("numPlace") ;
    var numPlaceNumbers = [] ;
    for(var i=0; i < numPlaceEles.length; ++i){
	var pushValue = numPlaceEles[i].value ;
	if(pushValue.search(/[1-9]/) === -1){
	    numPlaceEles[i].value = "" ;
	    pushValue = "" ;
	}
	numPlaceNumbers.push(pushValue) ;
    }
    console.log("input = " + numPlaceNumbers) ;

    return numPlaceNumbers ;
} ;
