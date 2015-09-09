window.addEventListener("load", function output1() {
    var outEle1 = document.getElementById("outputH2ByTopJs1");

    outEle1.innerHTML = "こんにゃく<br>\
    みそかつ<br>\
    もちもちした何か<br>";  // innerHTML では <br> で改行される

    // 連想配列
    var renso = {
        x: 11,
        y: 22,
        z: 33,
    };
    outEle1.innerHTML += renso.x + renso.y;  // 33

    var str1 = "生姜焼き";
    outEle1.textContent = str1; // 生姜焼き

    str1 += renso.x + renso.y ;  // 33
    outEle1.textContent = str1; // 改めて代入しないと反映はされない

    str1 += (renso.x) + (renso.y) + "<br>\r\n"; // 33
    // 改行記号はすべて反映されない
    
    str1 = (str1 + renso.x) + renso.y;  // 1122

    outEle1.textContent = str1;
    /* 以上のように、演算の順番によって、文字列か数値かの
       解釈が変わるので注意が必要                     */

    var outEle2 = document.getElementById("outputH2ByTopJs2");

    var ary1 = ["JAPAN", "US", "CHINA", "RUSSIA"];
    var ary2 = ["JAPAN", "US", "CHINA", "RUSSIA"];

    outEle2.innerHTML =  "<pre>ary1 ==  ary2 : " + (ary1 == ary2) + "</pre>";   // ary1, ary2 は参照型なので、実体としてはアドレスを指してるだけ。よって、この２つは同じ値でなく false
    outEle2.innerHTML += "<pre>ary1 === ary2 : " + (ary1 === ary2) + "</pre>"; // == が false なので当然false
    
    outEle2.innerHTML += "<pre>null ==  0 : " + (null ==  0) + ", "
        + "true ==  1 : " + (true ==  1) + ",  "
        + "false ==  0 : " + (false ==  0) + "</pre>" ;
    outEle2.innerHTML += "<pre>null === 0 : " + (null === 0) + ", "
        + "true === 1 : " + (true === 1) + ", "
        + "false === 0 : " + (false === 0) + "</pre>" ;

    outEle2.innerHTML += "<pre>(5*4 ==  20) ==  true : " 
        + ( (5*4==20) == true ) + "</pre>" ;
    outEle2.innerHTML += "<pre>(5*4 === 20) === true : "
        + ( (5*4===20) === true ) + "</pre>" ;
    

    var h2Tag = document.getElementsByTagName("h2") ;
    h2Tag[0].style.color = "red" ;
    
    
    h2Tag[1].onclick = function(){
        for(var i=0; i<h2Tag.length ; ++i){
                h2Tag[i].textContent = "pinya" ;
        }
        h2Tag.item(2).textContent += " : " + h2Tag[1].onmouseover ;
    } ;


}, false);
