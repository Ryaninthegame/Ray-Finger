// place input keyCode 
var _keyBoardIndex = [];

// place sample index
var _sampleIndex = [];

// process time
var _gameTime = 10;
var _readyTime = 3;
var _breakTime = 1;

// process mode
var _startMode = 1;
var _readyMode = 0;
var _gameMode = 0;
var _waitMode = 0;
var _settlementMode = 0;
var _restartModex = 0;

// game record
var _hitTotalCount = 0;
var _hitSuccessCount = 0;
var _hitFailCount = 0;
var _interval;

// flag
var _firstInGame = 1;
var _firstInSettle = 1;

main();

function main(){
	screenControl();
	playControl();
	run();
}

function run(){
	textAnimation("opening")
	_interval = setInterval("process()", 1000);
}

function process(){
	if(_readyMode){
		init();	
		readyTimer();
	}
	else if(_gameMode){ 
		if(_firstInGame){
			randomSample("init");
			_firstInGame = 0;
		}
		gameTimer();
	}
	else if(_waitMode) waitTimer();
	else if(_settlementMode){
		showSettlement();
	}
}

// opening/ending animation
function textAnimation(state){
	switch(state){
		case "opening" :
			var container = document.getElementById("container");
			var head = document.getElementById("head");
			if(!head.hasChildNodes()){
				head.innerHTML = "Hello World";
				var text = document.createElement("div");
				text.setAttribute("class", "openingText");
				text.innerHTML = "Press Space to Start";
				text.classList.add("effect");
				container.appendChild(text);
			}
			break;
		case "ending" :
			var container = document.getElementById("container");
			var text = document.createElement("div");
			text.setAttribute("class", "endingText");
			text.innerHTML = "Press Space to Restart";
			text.classList.add("effect");
			container.appendChild(text);
			break;
	}
}

// first play game and replay game, initialize HTML
function init(){
	var container = document.getElementById("container");
	while(container.hasChildNodes()) {
		container.removeChild(container.lastChild);
	}
	if(!container.hasChildNodes()){
		var head = document.createElement("div");
		head.setAttribute("class", "head");
		head.setAttribute("id", "head");
		container.appendChild(head);
		
		var grid = document.createElement("div");
		grid.setAttribute("class", "grid");
		grid.setAttribute("id", "grid");
		container.appendChild(grid);
		
		var buttonSet = document.createElement("div");
		buttonSet.setAttribute("class", "buttonSet");
		buttonSet.setAttribute("id", "buttonSet");
		container.appendChild(buttonSet);
		
		gridHTML();
		buttonSetHTML();
	}
}

// when replay game, reset all state
function reset(){
	_keyBoardIndex = [];
	_sampleIndex = [];
	_gameTime = 10;
	_readyTime = 3;
	_breakTime = 1;
	_startMode = 1;
	_readyMode = 0;
	_gameMode = 0;
	_waitMode = 0;
	_settlementMode = 0;
	_hitTotalCount = 0;
	_hitSuccessCount = 0;
	_hitFailCount = 0;
	_firstInGame = 1;
	_firstInSettle = 1;
	var container = document.getElementById("container");
	while(container.hasChildNodes()){
		container.removeChild(container.lastChild);
	}
	var head = document.createElement("div");
	head.setAttribute("class", "head");
	head.setAttribute("id", "head");
	container.appendChild(head);
}

// show ready process time
function readyTimer(){
	console.log("readyTimer");
	var head = document.getElementById("head");
	var time = _readyTime%60;
	if(_readyTime>0){
		head.innerHTML = "READY &nbsp;&nbsp;"+time;
		_readyTime -= 1;
	}
	else{
		head.innerHTML = "GO";
		_readyMode = 0;
		_gameMode = 1;
	}
}

// show game process time
function gameTimer(){
	console.log("gameTimer");
	var head = document.getElementById("head");
	if(_gameTime>0){
		var time = _gameTime%60;
		head.innerHTML = time;
		_gameTime -= 1;
	}
	else{
		head.innerHTML = "GAME OVER";
		_gameMode = 0;
		_waitMode = 1;
	}
}

// show wait process time
function waitTimer(){
	console.log("breakTimer");
	if(_breakTime>0){
		var head = document.getElementById("head");
		head.innerHTML = "WAIT...";
		_breakTime -= 1;
	}
	else{
		_waitMode = 0;
		_settlementMode = 1;
	}
}

// show settlement process all grade
function showSettlement(){
	console.log("showSettlement");
	if(_firstInSettle){
		var container = document.getElementById("container");
		while(container.hasChildNodes()){
			container.removeChild(container.lastChild);
		}
		if(!container.hasChildNodes()){
			var head = document.createElement("div");
			head.setAttribute("class", "head");
			head.setAttribute("id", "head");
			head.innerHTML = "Overall Result";
			container.appendChild(head);
			
			for(var i=1; i<8; i++){
				var div = document.createElement("div");
				div.setAttribute("class", "information");
				div.setAttribute("id", "information-"+i);
				for(var j=1; j<3; j++){
					var text = document.createElement("div");
					text.setAttribute("class", "text-"+j);
					text.setAttribute("id", "text-"+j);
					div.appendChild(text);
				}
				container.appendChild(div);
				settlement(i);
			}
			textAnimation("ending");
		}
		_firstInSettle = 0;
	}
}

// show settlement detail
function settlement(index){
	var information = document.getElementById("information-"+index);
	var text_left = information.childNodes[0];
	var text_right = information.childNodes[1];
	switch(index){
		case 1 : 
			text_left.innerHTML = "Hit Total : ";
			text_right.innerHTML = _hitTotalCount;
			break;
		case 2 : 
			text_left.innerHTML = "Hit Success : ";
			text_right.innerHTML = _hitSuccessCount;
			break;
		case 3 : 
			text_left.innerHTML = "Hit Fail : ";
			text_right.innerHTML = _hitFailCount;
			break;
		case 4 : 
			text_left.innerHTML = "Hit Success Rate : ";
			text_right.innerHTML = (_hitSuccessCount/_hitTotalCount).toFixed(3)+"%";
			break;
		case 5 : 
			text_left.innerHTML = "Hit Fail Rate : ";
			text_right.innerHTML = (_hitFailCount/_hitTotalCount).toFixed(3)+"%";
			break;
		case 6 : 
			text_left.innerHTML = "Hit Per Second : ";
			text_right.innerHTML = (_hitTotalCount/10).toFixed(1);
			break;
	}
}

// set up HTML of grid
function gridHTML(){
	var rowIndex = 1;
	var cellIndex = 1;
	var score = 0;
	var parent = document.getElementById("grid");
	for(var i=1; i<6; i++){
		var row = document.createElement("div");
		row.setAttribute("class", "row");
		row.setAttribute("id", "row-"+i);
		for(var j=1; j<4; j++){
			var cell = document.createElement("div");
			cell.setAttribute("class", "cell");
			cell.setAttribute("id", "cell-"+j);
			cell.style.backgroundColor = "black";
			row.appendChild(cell);
		}
		parent.appendChild(row);
	}
}

// set up HTML of button
function buttonSetHTML(){
	var parent = document.getElementById("buttonSet");
	for(var i=1; i<4; i++){
		var button = document.createElement("div");
		button.setAttribute("class", "button");
	　　button.setAttribute("id", "button-"+i);
		button.innerHTML = i;
		parent.appendChild(button);
	}
}

// sample images
function randomSample(state){
	switch(state){
		case "init" :
			for(var i=4; i>-1; i--){
				var index = parseInt(Math.floor(Math.random()*3)+1);
				_sampleIndex.push(index);
				var parent = document.getElementById("row-"+(i+1));
				var child = parent.childNodes[index-1];
				child.style.backgroundColor = "#AAAAAA";
			}
			break;
		case "inGame" :
			var j = 0;
			for(var i=4; i>-1; i--){
				var index = _sampleIndex[j];
				j += 1;
				var parent = document.getElementById("row-"+(i+1));
				var child = parent.childNodes[index-1];
				child.style.backgroundColor = "#AAAAAA";
			}
			break;
	}
}

// when success hit, update sampleIndex 
function hitSuccess(){
	_hitSuccessCount += 1;
	var newSampleIndex = [];
	
	// copy _sampleIndex to local variable newSampleIndex
	for (i=0; i<_sampleIndex.length; i++) {
		newSampleIndex.push(_sampleIndex[i]);
	}
	
	for(var i=4; i>-1; i--){
		var parent = document.getElementById("row-"+(i+1));
		var child = parent.childNodes[_sampleIndex[0]-1];
		_sampleIndex.shift();
		child.style.backgroundColor = "black";
	}
	newSampleIndex.shift();
	newSampleIndex.push(Math.floor(Math.random()*3)+1);
	for (i=0; i<newSampleIndex.length; i++) {
		_sampleIndex.push(newSampleIndex[i]);
	}
	randomSample("inGame");
}

function hitFail(){
	_hitFailCount += 1;
}

// judge whether click button successful
function hit(){
	_hitTotalCount += 1;
	var hitIndex = _keyBoardIndex[0];
	_keyBoardIndex.shift();
	if(hitIndex==_sampleIndex[0]){
		console.log("success");
		hitSuccess();
	}
	else{
		hitFail();
		console.log("fail");
	}
}


// when button pressed, change color
function clickButton(index){
	var button = document.getElementById('button-'+index);
    button.style.background = "#AAAAAA";
}

// when button 1 unpressed, reset color
function resetButton_1(role){
	var button = document.getElementById('button-1');
	button.style.background = '#484891';
}

// when button 2 unpressed, reset color
function resetButton_2(){
	var button = document.getElementById('button-2');
	button.style.background = '#484891';
}

// when button 3 unpressed, reset color
function resetButton_3(){
	var button = document.getElementById('button-3');
	button.style.background = '#484891';
}

// detect which button clicked when play
function playControl(){
	var playHandler = function(e){
		var flashTime = 50;
		if(_gameMode==1){
			switch(e.keyCode){
				case 97 : // press left 1
					clickButton(1);
					setTimeout(resetButton_1, flashTime); // execute last in case
					_keyBoardIndex.push(1);
					hit();
					break;
				case 49 : // press right 1
					clickButton(1);
					setTimeout(resetButton_1, flashTime);
					_keyBoardIndex.push(1);
					hit();
					break; 
				case 98 : // press left 2
					clickButton(2);
					setTimeout(resetButton_2, flashTime);
					_keyBoardIndex.push(2);
					hit();
					break;
				case 50 : // press right 2
					clickButton(2);
					setTimeout(resetButton_2, flashTime);
					_keyBoardIndex.push(2);
					hit();
					break;
				case 99 : // press left 3
					clickButton(3);
					setTimeout(resetButton_3, flashTime);
					_keyBoardIndex.push(3);
					hit();
					break;
				case 51 : // press right 3
					clickButton(3);
					setTimeout(resetButton_3, flashTime);
					_keyBoardIndex.push(3);
					hit();
					break;
			}
		}
	};
	document.addEventListener("keydown", playHandler);
}

// control opening and settlement
function screenControl(){
	var screenHandler = function(e){
		// press space to start
		if(e.keyCode==32 && _startMode==1){
			_startMode = 0;
			_readyMode = 1;
		}
		else if(e.keyCode==32 && _settlementMode==1){
			clearInterval(_interval); 
			reset();
			run();
		}
	};
	document.addEventListener("keydown", screenHandler);
}
