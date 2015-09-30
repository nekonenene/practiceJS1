
window.addEventListener("load", function () {
	console.time("Loading Time") ;
	
	var submitButtonEle = document.getElementById("doItButton") ;
	submitButtonEle.addEventListener("click", function(){
		// console.log("押されました") ;
		var inputAreaEle = document.getElementById("inputArea") ;
		console.log("input = " + inputAreaEle.value) ;
		doIt(inputAreaEle.value) ;
	}, false) ;
	
	function doIt(chunk){ 
		if(chunk === undefined || chunk.search(/[^\s]+/m) === -1 ){
			// 空白以外の文字があるなら、id = "miku" の中身を代入
			if(document.getElementById("miku").textContent.search(/[^\s]+/m) !== -1){
				chunk = document.getElementById("miku").textContent ;
			}else{
				console.log("**Error** no input") ;
				return (-1) ;
			}
		}
		
		var outputEle = document.getElementById("output") ;
		outputEle.innerHTML = "" ;
		
		/* 入力は入力フォームに入れるか、html の miku div 内に入れる */
		/* 以下をコピーする */
		
		/* 2015/ 9/ 30              *
		 * A004 : あみだくじ        */
		chunk = chunk.replace(/^[ \n\t]*$/gim, "") ; // Tabは削る
		var lines = chunk.toString().split("\n") ;
		for(var i = 0; i < lines.length; ++i){
			lines[i] = lines[i].toString().split(" ") ;
		}
		// console.log("chunk = " + chunk) ;
		
		for(var i = 0; i < lines.length ; ++i){
			for(var j = 0; j < lines[i].length; ++j){ 
				var num = lines[i][j].match(/[0-9]+/) ;
				lines[i][j] = parseInt(num) ;
			}
		}
		// console.log(lines) ;

		var verticalHeight = lines[0][0] ;
		var width = lines[0][1] ;
		var horizonLineAmount = lines[0][2] ;

		/* 下から考えた方が楽なので、長さは反転させて見る */
		var HorizonLineProperty = function(){
			this.horizonLineId         = [] ;
			this.leftVerticalLineId    = [] ;
			this.leftHeight            = [] ;
			this.rightHeight           = [] ;
		} ;

		var MovePoint = function(){
			this.isRight = [0] ;
			this.moveHeight = [0] ;
			this.horizonLineId = [0] ;
		} ;
		
		var CurrentProperty = function(_height, _verticalLineId){
			try{
				this.height = _height ;
				this.verticalLineId = _verticalLineId ;
			}catch(e){
				this.height = 0 ;
				this.verticalLineId = 1 ;
			}
		} ;

		var horizonLineProperty = new HorizonLineProperty() ;

		for(var horizonId = 0; horizonId < horizonLineAmount; ++horizonId){
			horizonLineProperty.horizonLineId.push(horizonId) ;
			horizonLineProperty.leftVerticalLineId.push(lines[horizonId+1][0]) ;
			horizonLineProperty.leftHeight.push(lines[horizonId+1][1]) ;
			horizonLineProperty.rightHeight.push(lines[horizonId+1][2]) ;
		}
		// console.log(horizonLineProperty) ;

		var movePoint = [] ;
		/* 各縦線ごとに、横線が引かれている位置を見る */
		for(var verticalId = 1; verticalId <= width; ++verticalId){
			movePoint[verticalId] = new MovePoint ;
			for(var horizonId = 0; horizonId < horizonLineProperty.horizonLineId.length; ++horizonId){
				if(horizonLineProperty.leftVerticalLineId[horizonId] === verticalId){
					movePoint[verticalId].moveHeight.push( horizonLineProperty.leftHeight[horizonId] ) ;
					movePoint[verticalId].horizonLineId.push( horizonId ) ;
					movePoint[verticalId].isRight.push( false ) ;
				}else if(horizonLineProperty.leftVerticalLineId[horizonId] === verticalId - 1){
					movePoint[verticalId].moveHeight.push( horizonLineProperty.rightHeight[horizonId] ) ;
					movePoint[verticalId].horizonLineId.push( horizonId ) ;
					movePoint[verticalId].isRight.push( false ) ;
				}
			}
		}

		// console.log(movePoint) ;
		/* 各縦線ごとに、その動く位置の高さを、小さい順に並び替える */
		for(var verticalId = 1; verticalId <= width; ++verticalId){
			movePoint[verticalId].moveHeight.sort( function(x, y){return (x - y) ;} ) ;
		}

		/* 下から登っていって、上に到達するまでを見る */
		var currentProperty = new CurrentProperty(0, 1) ;
		
		while(currentProperty.height < verticalHeight){
			// console.log("#") ;
			for(var i = 0; i < movePoint[currentProperty.verticalLineId].moveHeight.length; ++i){
				if(movePoint[currentProperty.verticalLineId].moveHeight[i] > currentProperty.height
				   && movePoint[currentProperty.verticalLineId].moveHeight[i] < verticalHeight){
					if(movePoint[currentProperty.verticalLineId].isRight[i] === false){
						currentProperty.height = horizonLineProperty.rightHeight[ (movePoint[currentProperty.verticalLineId].horizonLineId[i]) ] ;
						currentProperty.verticalLineId += 1 ;
					}else{
						currentProperty.height = horizonLineProperty.leftHeight[ movePoint[currentProperty.verticalLineId].horizonLineId[i] ] ;
						currentProperty.verticalLineId -= 1 ;
					}
				}
			}
			++currentProperty.height ; // １距離上に前進させる
		}
			
		console.log(currentProperty.verticalLineId) ;
		
		/* 以上をコピーする */
		
		outputEle.innerHTML = chunk ;
		
		console.log("end") ;
		
		return 0 ;
	} ;
	
	doIt() ;

	console.timeEnd("Loading Time") ;
	
}, false) ;
