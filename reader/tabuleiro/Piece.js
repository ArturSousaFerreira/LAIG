function Piece(scene, color, tile, texture) {
	this.scene = scene;
	this.tile = tile;
	this.color = color;

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

Piece.prototype.setTile = function(newTile) {
    this.tile = newTile;
}

