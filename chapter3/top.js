window.addEventListener("load", function () {

    var h1Tag = document.getElementsByTagName("h1") ;
    h1Tag[0].style.color = "red" ;

    var practiceStringOutEle = document.getElementById("practiceString") ;
    stringLesson(practiceStringOutEle) ;


    
    function stringLesson(ele){
	var str1 = "Windows" ;
	var str2 = "X" ;
	var str3 = "professional" ;
	var i = 1 ;

	ele.innerHTML = "" ;
	function outputAllStrings(){  // これで簡単にすべて出せるぞ！
	    ele.innerHTML += i + " : " + str1 + " " + str2 + " " + str3 + "<br>" ;
	    console.log(i) ;
	    ++i ;
	}

	outputAllStrings() ; // 1
	
	str2 = str2.concat("YZ") ;
	outputAllStrings() ; // 2
	
	str2 = str2.toLowerCase() ;
	outputAllStrings() ; // 3

	str3 = str3.replace(/(o)[fn]/g, "$1ff_") ; // on,of が off_ になるはず
	// /g オプションをしないと、文字列全体の探索をおこなってくれないので注意！
	// /m : 複数行に対応   /i : 大文字小文字を区別する
	// 全部乗せは /(Win)|(Windows)/gmi と書く

	// リプレース前は / / の構文だが、リプレース後は " " の構文なことにも注意
	// 置換後の文字列は、Devasでは \1, \2,,, だが JS では $1, $2,,, なので注意
	outputAllStrings() ; // 4

	var zenkaku = "全角文字も 読み込める？" ;
	ele.innerHTML += "「" + zenkaku + "」の文字数は " + zenkaku.length + "<br>" ;

	var splitStr3Array = str3.split("_") ;
	ele.innerHTML += "splitStr3Array is " + splitStr3Array + "<br>" ;
	ele.innerHTML += "splitStr3Array[0].substring(0, 3) = " + splitStr3Array[0].substring(0, 3) + " (0 以上 3未満の文字を取得する)<br><br>" ;
	
	console.log("of の位置 : " + str3.indexOf("of")) ;
	console.log("of の位置 regExp : " + str3.search(/o[fn]/g)) ;

	var tenTimesWindows = str1 * 10 ;
	ele.innerHTML += "str1 * 10 = " + tenTimesWindows + "<br>" ;

	tenTimesWindows = "" ;
	for(var i = 0; i < 10; ++i){
	    tenTimesWindows = tenTimesWindows.concat(str1) ;
	}
	ele.innerHTML += "str1 * 10 = " + tenTimesWindows + "<br>" ;


	var targetWord = "wsW" ;
	var searchedTenTimesWindows = searchWord(tenTimesWindows, targetWord) ;
	ele.innerHTML += "searched \" " + targetWord + " \" -> " + searchedTenTimesWindows + "<br>" ;

	targetWord = "wsw" ;
	searchedTenTimesWindows = searchWord(tenTimesWindows, targetWord) ;
	ele.innerHTML += "searched \" " + targetWord + " \" -> " + searchedTenTimesWindows + "<br>" ;
	
    } ;
    

}, false) ;


/* str 中の targetWord を調べ、該当箇所を class = "hitWord" で出力 */
function searchWord(str, targetWord){
    var searchResultNumberArray = [] ;
    var searchResultNumber;
    var startSearchNumber = 0 ;
    do{
	searchResultNumber = str.indexOf(targetWord, startSearchNumber) ;
	if(searchResultNumber == -1){break ;}
	searchResultNumberArray.push( searchResultNumber ) ;
	startSearchNumber = searchResultNumber + 1 ;
    }while(true) ;
    // JavaScript では do のあとの while は必須、while のカッコの中身も必須

    var outputStr = "" ;
    var isHitWordFlag = [] ;
    outputStr += str.substring(0, searchResultNumberArray[0]) ;
    for(var i = 0; i < searchResultNumberArray.length ; ++i ){
	outputStr += "<span class=\"hitWord\">" + str.substr(searchResultNumberArray[i], targetWord.length) + "</span>" ;
	if(i+1 < searchResultNumberArray.length){
	    outputStr += str.substring(searchResultNumberArray[i]+targetWord.length, searchResultNumberArray[i+1]) ;
	}else{
	    outputStr += str.substring(searchResultNumberArray[i]+targetWord.length, str.length) ;
	}
    }

    return outputStr ;
} ;

