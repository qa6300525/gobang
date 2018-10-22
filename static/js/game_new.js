var loadImages = function(sources, callback){
	var nb = 0;
	var loaded = 0;
	var imgs = {};
	for(var i in sources){
		nb++;
		imgs[i] = new Image();
		imgs[i].src = sources[i];
		imgs[i].onload = function(){
			loaded++;
			if(loaded == nb){
				callback(imgs);
			}
		}
	}
}

var WIDTH = 540
var HEIGHT = 540
var MARGIN = 22
var GRID = (WIDTH - 2 * MARGIN) / (BoardSizeN - 1)
var PIECE = 32
var WINPIECECOUNT = 5


var Game = function() {
	this.score = 0;
	this.canvas = document.querySelector("#flappy");
	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.backgroundx = 0;
	this.pieceType = PiecesType.Black;
	this.board = new Board();
	this.endFlag = false;
	this.player = 0;
	this.playerObj = new Array();
}

Game.prototype.init = function() {
	this.ctx.drawImage(images.chessboard, 0, 0);
	this.board.init();
	this.initPlayer();
	this.initEvent();
}

Game.prototype.initPlayer = function() {
	this.playerObj[0] = new Player();
	this.playerObj[1] = new Player();
}

Game.prototype.restore = function() {
	this.endFlag = false;
	this.board.restore();
}

Game.prototype.initEvent = function() {
	self = this;
	this.canvas.onclick = function(e) {
		if (self.endFlag) return;
		console.log(e.clientX, e.clientY);
		if (self.playerDo(e.clientX, e.clientY))
			self.changeSide();
		self.isEnd();
	}
}

Game.prototype.playerDo = function(x, y) {
	if(this.playerObj[this.player].playerType == PlayerType.Human)
		return this.setPiece(x,y);
}

Game.prototype.setPiece = function(x, y, ) {
	index = this.coordinateTransformPixel2map(x, y)
	if(!index)
		return false;
	console.log(index);
	console.log(this.pieceType)
	if(!this.board.setPiece(index[0],index[1],this.pieceType))
		return false;
	console.log(index);
	this.drawPiece(i,j,this.pieceType);
	return true;
}

Game.prototype.setPiece = function(i, j) {
	if(!this.board.setPiece(i,j,this.pieceType))
		return false;
	console.log(index);
	this.drawPiece(i,j,this.pieceType);
	return true;
}

Game.prototype.drawPiece = function(i,j,pType) {
	loc = this.coordinateTransformMap2pixel(i,j);
	var piece = null;
	if (pType == PiecesType.Black)
		piece = images.black;
	else
		piece = images.white;
	this.ctx.drawImage(piece, loc[0], loc[1]);
	return true;
}

Game.prototype.changeSide = function() {
	this.player = (this.player + 1) % 2;
	this.pieceType = this.playerObj[this.player].pieceType;
}

Game.prototype.isEnd = function() {
	this.endFlag = this.checkFive()
	if (this.endFlag){
		alert("five!");
		console.log("five!");
	}
}

Game.prototype.checkFive = function() {
	for (var x = 0; x < BoardSizeN; x++) {
		for (var y = 0; y < BoardSizeN; y++) {
			if (this.board.board[x][y].pType != PiecesType.Null)
				if (this.__checkFive(x, y, this.board.board[x][y].pType))
					return true;
		}
	}
	return false;
}

Game.prototype.__checkFive = function(x, y, pieceType) {
	var nx = [1, 1, 0, 1];
	var ny = [1, 0, 1, -1];
	for (var i = 0; i < nx.length; i++) {
		var flag = true;
		for (var j = 1; j < WINPIECECOUNT; j++) {
			var newX = x + nx[i] * j;
			var newY = y + ny[i] * j;
			if (newX >= BoardSizeN || newY >= BoardSizeN || newX < 0 || newY < 0)
				break;
			if (this.board.board[newX][newY].pType != pieceType) {
				flag = false;
				break;
			}
		}
		if (flag)
			return true;
	}
	return false;
}

Game.prototype.coordinateTransformPixel2map = function(x, y) {
	// # 从 UI 上的绘制坐标到 chessMap 里的逻辑坐标的转换
	var i = Math.floor(Math.floor((y - MARGIN + PIECE / 2) / GRID))
	var j = Math.floor(Math.floor((x - MARGIN + PIECE / 2) / GRID))
	// # 有MAGIN, 排除边缘位置导致 i,j 越界
	if (i < 0 || i > BoardSizeN || j < 0 || j > BoardSizeN)
		return false;
	else
		console.log(i, j);
	return [i, j];
}

Game.prototype.coordinateTransformMap2pixel = function(i, j) {
	// # 从 chessMap 里的逻辑坐标到 UI 上的绘制坐标的转换
	return [MARGIN + j * GRID - PIECE / 2, MARGIN + i * GRID - PIECE / 2]
}
window.onload = function() {
	var goSprites = {
		chessboard: "../static/img/chessboard.jpeg",
		black: "../static/img/piece_black.png",
		white: "../static/img/piece_white.png",
	}

	var start = function() {
		game = new Game();
		game.init();
		// game.start();
		// game.update();
		// game.display();
	}

	loadImages(goSprites, function(imgs) {
		images = imgs;
		start();
	})
}