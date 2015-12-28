function Piece(scene, tile, texture) {
	this.scene = scene;
	this.tile = tile;

    this.geom = new PiecePrimitive(this.scene, 1.5, 0.4, 0.4, 100, 100, texture);
}

Piece.prototype.constructor = Piece;

Piece.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.registerForPick(this.tile.id, this.tile);
		this.scene.translate(this.tile.x, 1, this.tile.z);
		this.geom.display();
	this.scene.popMatrix();
}



//TODO: setTile, quando a peça muda de casa