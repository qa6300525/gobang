var PlayerType = {};
PlayerType.Human = 0;
PlayerType.Computer = 1;


Player = function(playerType, pType) {
	this.playerType = PlayerType.Human;
	this.pieceType = PiecesType.Black;
	this.board = null;
	if(playerType)
		this.playerType = playerType;
	if(pType)
		this.pieceType = pType;
}

Player.prototype.setPiece = function(board) {
	this.board = board;
	return [i,j];
}


Player.prototype.addClick = function(canvas) {
	canvas.onclick = function(e) {
		if (self.endFlag) return;
		console.log(e.clientX, e.clientY);
		if (self.playerDo(e.clientX, e.clientY))
			self.changeSide();
		self.isEnd();
	}
}

Player.prototype.removeClick = function(canvas) {
	
}