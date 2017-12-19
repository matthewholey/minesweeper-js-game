var board = document.getElementById("board");
var cell = document.createElement("div");
var allCells = document.getElementsByClassName("cell");
var allMines = [];
var modeMine = document.getElementById("modeMine");
var modeFlag = document.getElementById("modeFlag");

document.body.onload = setBoard();
function setBoard(){
	cell.className = "cell";
	cell.id = 1;
	board.append(cell);
	function addCells(cell, count, deep){
		for (var i = 0, copy; i < count-1; i++){
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
	for (var i = 0; i < allMines.length; i++) {
		allCells[allMines[i]].addEventListener("click", clickedMine);
		allCells[allMines[i]].setAttribute("data-mine", "true");
	}
};

for (var i = 0; i < allCells.length; i++){
	allCells[i].addEventListener("click", clicked);
	setAdjacent(allCells[i]);
};

function removeAllEventListeners(){
		for(var i = 0; i < allCells.length; i++){
			allCells[i].removeEventListener('click', clicked);
			allCells[i].removeEventListener('click', clickedMine);
		}
};

function clicked(e){
	console.log("cell "+e.target.getAttribute("id")+" clicked!");
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