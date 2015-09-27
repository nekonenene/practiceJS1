/* JavaScript-1 の 表示部分 */


document.writeln("こんにゃく\r\nみそかつ"); // 改行は行われない

var musicGenre = ["techno", ["orchestra", "brass", "strings"], "jazz", "hip-hop"];
	
document.writeln("<br>\"I love " + musicGenre[0] + " & "); // techno
document.writeln(musicGenre[1][2] + " sounds.\"  "); // strings
document.writeln(musicGenre[1] + "<br>"); // orchestra,brass,strings