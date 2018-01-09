var board = document.getElementById("board");
var cell = document.createElement("div");
var allCells = document.getElementsByClassName("cell");
var pressedCells = document.getElementsByClassName("pressed");
var allMines = [];
var radioMine = document.getElementById("radioMine");
var radioFlag = document.getElementById("radioFlag");
var placedFlags = [];

document.body.onload = setMode(), setBoard();

function setMode(){
	radioMine.checked = true;
	if(radioMine.checked == true){
		toMineMode();
	}
	radioMine.addEventListener("click", toMineMode);
	radioFlag.addEventListener("click", toFlagMode);
};

function toMineMode(){
	console.log("You are in Mine Mode.");
	for (var i = 0; i < allCells.length; i++){
		allCells[i].removeEventListener("click", placeFlag);
		allCells[i].addEventListener("click", clicked);
		setAdjacent(allCells[i]);
	}

	for (var i = 0; i < allMines.length; i++) {
		allCells[allMines[i]].removeEventListener("click", clicked);
		allCells[allMines[i]].addEventListener("click", clickedMine);
		allCells[allMines[i]].setAttribute("data-mine", "true");
	}

	for (var i = 0; i < placedFlags.length; i++) {
		allCells[placedFlags[i]].removeEventListener("click", clickedMine);
		allCells[placedFlags[i]].removeEventListener("click", clicked);
	}

	for (var i = 0; i < pressedCells.length; i++) {
		pressedCells[i].removeEventListener("click", clicked);
	}
};
function toFlagMode(){
	console.log("You are in Flag Mode.");
	for(var i = 0; i < allCells.length; i++){
		allCells[i].removeEventListener("click", clicked);
		allCells[i].removeEventListener("click", clickedMine);
	}

	var unPressedCells = document.querySelectorAll("div.cell:not(.pressed)");
	for (var i = 0; i < unPressedCells.length; i++) {
		unPressedCells[i].addEventListener("click", placeFlag);
	}

	for (var i = 0; i < pressedCells.length; i++) {
		pressedCells[i].removeEventListener("click", placeFlag);
	}
};

function setBoard(){
	cell.className = "cell";
	cell.id = 1;
	board.append(cell);
	function addCells(cell, count, deep){
		for (var i = 0, copy; i < count-1; i++) {
			copy = cell.cloneNode(deep);
			cell.parentNode.insertBefore(copy, cell);
			cell.setAttribute("id", i+2);
		}
	}
	addCells(cell, 100, true);
	function addMines(count){
		while(allMines.length < count){
			var randomCell = Math.floor(Math.random()*100);
			if (allMines.indexOf(randomCell) > -1) continue;
			allMines[allMines.length] = randomCell;
		}
	}
	addMines(10);
};

for (var i = 0; i < allMines.length; i++) {
	allCells[allMines[i]].addEventListener("click", clickedMine);
	allCells[allMines[i]].setAttribute("data-mine", "true");
}

for (var i = 0; i < allCells.length; i++){
	allCells[i].addEventListener("click", clicked);
	setAdjacent(allCells[i]);
};

function removeAllEventListeners(){
		for(var i = 0; i < allCells.length; i++){
			allCells[i].removeEventListener("click", clicked);
			allCells[i].removeEventListener("click", clickedMine);
			allCells[i].removeEventListener("click", placeFlag);
		}
	radioMine.removeEventListener("click", toMineMode);
	radioFlag.removeEventListener("click", toFlagMode);
};

//Click event functions
function clicked(e){
	console.log("Cell "+e.target.getAttribute("id")+" clicked!");
	checkAdjacent(e.target);
	e.target.removeEventListener("click", clicked);
};

function clickedMine(e){
	console.log("Boom! You're DEAD!!!");
	e.target.style.backgroundColor = "red";
	for (var i = 0; i < allMines.length; i++) {
		function mine(){
			allCells[allMines[i]].style.backgroundImage = "url(./img/mine.png)"
		}
		mine();
	}
	removeAllEventListeners();
};

function placeFlag(e){
	var flag = e.target.id-1
	if(placedFlags.length < allMines.length){
		if (placedFlags.includes(flag) == false) {
			console.log("Flag placed at cell "+e.target.getAttribute("id"));
			placedFlags.push(flag);
			e.target.style.backgroundColor = "blue";
		}
		else if (placedFlags.includes(flag) == true) {
			console.log("Flag removed from cell "+e.target.getAttribute("id"));
			function selectedFlag(item) {
				return item = flag;
			}
			var flagIndex = placedFlags.findIndex(selectedFlag);
			placedFlags.splice(flagIndex);
			e.target.style.backgroundColor = "";
		}
	}
};

function setAdjacent(clickedCell){
	var offsets = [-11, -10, -9, -1, 1, 9, 10, 11];
	var relativeColumn = [-1, 0, 1, -1, 1, -1, 0, 1];
	var index = clickedCell.id-1;
	var targetColumn = index%10;
	var mineCount = 0;
	for (var i = 0; i < offsets.length; i++){
		var checkIndex = index+offsets[i];
		var checkColumn = checkIndex%10;
		if (checkIndex >= 0 && checkIndex < 100 &&
			checkColumn == targetColumn+relativeColumn[i] &&
			allMines.indexOf(checkIndex) >= 0){
			mineCount++;
		}
	}
	clickedCell.setAttribute("data-adjCount", mineCount);
	return mineCount;
}

function checkAdjacent(clickedCell){
	var mineCount = clickedCell.getAttribute("data-adjCount");
	clickedCell.setAttribute("data-marked", true);
	clickedCell.setAttribute("class", clickedCell.getAttribute("class")+" pressed");
	if (mineCount > 0 ) {
		clickedCell.append(mineCount);
	}
	else {
		var adjacentCells = checkOpenAdjacentCells(clickedCell);
	}
	return mineCount;
}

function checkOpenAdjacentCells(clickedCell) {
	var adjacentCells = checkAdjacentForOpeness(clickedCell, true);
	for (var i = 0; i < adjacentCells.length; i++) {
		var adjCell = allCells[adjacentCells[i]];
		var adjCount = adjCell.getAttribute("data-adjCount");
		adjCell.removeEventListener("click", clicked);
		adjCell.setAttribute("class", adjCell.getAttribute("class")+" pressed");
		if (adjCell.getAttribute("data-marked") != "true") {
			if (adjCount > 0) {
				adjCell.append(adjCell.getAttribute("data-adjCount"));
			}
			else {
				var newAdjacentCells = checkAdjacentForOpeness(allCells[adjacentCells[i]]);
				adjacentCells = adjacentCells.concat(newAdjacentCells).filter(onlyUnique);
			}
		}
	}
	return adjacentCells; 
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function checkAdjacentForOpeness(clickedCell){
	var offsets = [-11, -10, -9, -1, 1, 9, 10, 11];
	var relativeColumn = [-1, 0, 1, -1, 1, -1, 0, 1];
	var index = clickedCell.id-1;
	var targetColumn = index%10;
	var adjacentCells = [];
	var mineCount = 0;
	for (var i = 0; i < offsets.length; i++){
		var checkIndex = index+offsets[i];
		var checkColumn = checkIndex%10;
		if (checkIndex >= 0 && checkIndex < 100 &&
			checkColumn == targetColumn+relativeColumn[i] ) {
			adjacentCells.push(checkIndex);
		}
	}
	return adjacentCells;
}

function win() {
	removeAllEventListeners();
	if(placedFlags == allMines) {
		console.log("You Win!");
	}
};