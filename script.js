var origboard;
const HuPlayer = 'X';
const AIplayer = 'O';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startgame();

function startgame() {
	document.querySelector(".endgame").style.display = "none";
	origboard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnclick, false);
	}
}

function turnclick(square) {
	if (typeof origboard[square.target.id] == 'number') {
		turn(square.target.id, HuPlayer)
		if (!checkwin(origboard, HuPlayer) && !checktie()) turn(bestspot(), AIplayer);
	}
}
function turn(squareId, player) {
	origboard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gamewon = checkwin(origboard, player)
	if (gamewon) gameover(gamewon)
}

function checkwin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gamewon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gamewon = {index: index, player: player};
			break;
		}
	}
	return gamewon;
}

function gameover(gamewon) {
	for (let index of winCombos[gamewon.index]) {
		document.getElementById(index).style.backgroundColor =
			gamewon.player == HuPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnclick, false);
	}
	declarewinner(gamewon.player == HuPlayer ? "You win!" : "You lose.");
}

function declarewinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptysquares() {
	return origboard.filter(s => typeof s == 'number');
}

function bestspot() {
	return minimax(origboard, AIplayer).index;
}

function checktie() {
	if (emptysquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "aqua";
			cells[i].removeEventListener('click', turnclick, false);
		}
		declarewinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newboard, player) {
	var availspots = emptysquares();

	if (checkwin(newboard, HuPlayer)) {
		return {score: -10};
	} else if (checkwin(newboard, AIplayer)) {
		return {score: 10};
	} else if (availspots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for(var i = 0; i < availspots.length; i++)
	{
		var move = {};
		move.index = newboard[availspots[i]];
		newboard[availspots[i]] = player;
		if(player == AIplayer) 
		{
			var result = minimax(newboard, HuPlayer);
			move.score = result.score;
		}
		else
		{
			var result = minimax(newboard, AIplayer);
			move.score = result.score;
		}
		newboard[availspots[i]] = move.index;
		moves.push(move);	
	}

	var bestmove; 
	if(player === HuPlayer)
	{
	
	var bestscore = -10000;
	for(var i = 0; i < moves.length; i++)
	{
		if(moves[i].score > bestscore)
		{
			bestscore = moves[i].score;
			bestmove = i;
		}
	}
	}
	else {
		var bestscore = 10000;
	for(var i = 0; i < moves.length; i++)
	{
		if(moves[i].score < bestscore)
		{
			bestscore = moves[i].score;
			bestmove = i;
		}
	}
	}
 	return moves[bestmove];
}
