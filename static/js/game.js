(function() {

})();


var WIDTH = 540
var HEIGHT = 540
var MARGIN = 22
var N = 15
var GRID = (WIDTH - 2 * MARGIN) / (N - 1)
var PIECE = 32
var WINPIECECOUNT = 5

PieceType = new Array();
PieceType["null"] = -1
PieceType["black"] = 0
PieceType["white"] = 1

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


var Game = function() {
	this.score = 0;
	this.canvas = document.querySelector("#flappy");
	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.backgroundx = 0;
	this.board = null;
	this.pieceType = 0;
	this.endFlag = false;
}

Game.prototype.init = function() {
	if (this.board == null)
		this.board = new Array();
	this.restore();
	this.ctx.drawImage(images.chessboard, 0, 0);
	this.initEvent();
}

Game.prototype.restore = function() {
	for (var x = 0; x < N; x++) {
		this.board[x] = new Array();
		for (var y = 0; y < N; y++) {
			this.board[x][y] = -1;
		}
	}
}

Game.prototype.initEvent = function() {
	self = this;
	this.canvas.onclick = function(e) {
		if (self.endFlag) return;
		console.log(e.clientX, e.clientY);
		if (self.setPiece(e.clientX, e.clientY))
			self.changeSide();
		self.isEnd();
	}
}

Game.prototype.setPiece = function(x, y) {
	index = this.coordinateTransformPixel2map(x, y)
	if (this.board[index[0]][index[1]] != PieceType["null"])
		return false;
	this.board[index[0]][index[1]] = this.pieceType;
	loc = this.coordinateTransformMap2pixel(index[0], index[1]);
	var piece = null;
	if (this.pieceType == PieceType["black"])
		piece = images.black;
	else
		piece = images.white;
	this.ctx.drawImage(piece, loc[0], loc[1]);
	return true;
}

Game.prototype.changeSide = function() {
	this.pieceType = (this.pieceType + 1) % 2
}

Game.prototype.isEnd = function() {
	this.endFlag = this.checkFive()
	if (this.endFlag){
		alert("five!");
		console.log("five!");
	}
}

Game.prototype.checkFive = function() {
	for (var x = 0; x < N; x++) {
		for (var y = 0; y < N; y++) {
			if (this.board[x][y] != PieceType["null"])
				if (this.__checkFive(x, y, this.board[x][y]))
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
			if (newX >= N || newY >= N || newX < 0 || newY < 0)
				break;
			if (this.board[newX][newY] != pieceType) {
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
	if (i < 0 || i > N || j < 0 || j > N)
		return [-1, -1];
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