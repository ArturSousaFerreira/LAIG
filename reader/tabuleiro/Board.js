function Board(scene) {	
	this.scene = scene;

	this.tiles = [];
	this.pieces = [];

    this.init();
}

Board.prototype.constructor = Board;

Board.prototype.init = function() {
	for( var i = 0; i < 64; i++ ) {
		this.tiles[i] = new Tile();
	}

	for( var j = 0; j < 64; j++ ) {
		this.tiles[j] = new Piece();
	}
}

Board.prototype.display = function() {
	for( var i = 0; i < 64; i++ ) {
		this.tiles[i].display();
	}

	for( var j = 0; j < 64; j++ ) {
		this.pieces[j].display();
	}
}
