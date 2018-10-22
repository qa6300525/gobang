var PiecesType = {};
PiecesType.Null = -1;
PiecesType.White = 0;
PiecesType.Black = 1;

var Pieces = function(pType, sNumber){
	this.pType = PiecesType.Null;
	this.sNumber = 0;
	
	if (pType)
		this.pType = pType;
	if (sNumber)
		this.sNumber = sNumber;
} 

Pieces.prototype.restore = function() {
	this.pType = PiecesType.Null;
	this.sNumber = 0;
}

var BoardSizeN = 15; // N * N 棋盘大小

var Board = function() {
	this.board = null;
	this.SNumber = null;
}

Board.prototype.init = function(){
	if(this.board == null)
		this.board = new Array();
	if(this.SNumber == null)
		this.SNumber = new Array();
	this.restore();
}
	
Board.prototype.restore = function() {
	for (var i = 0; i < BoardSizeN; i++) {
		if(this.board[i] == null)
			this.board[i] = new Array();
		for (var j = 0; j < BoardSizeN; j++) {
			if (this.board[i][j] == null)
				this.board[i][j] = new Pieces();
			else
				this.board[i][j].restore();
		}
	}
}

Board.prototype.setPiece = function(i, j, pType) {
	if(pType == PiecesType.Null) return false;
	if(this.board[i][j].pType != PiecesType.Null)
		return false;
	this.SNumber[pType] += 1;
	this.board[i][j].pType = pType;
	this.board[i][j].sNumber = this.SNumber[pType];
	return true;
}

