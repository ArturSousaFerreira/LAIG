function Piece(scene, color, tile, texture) {
	this.scene = scene;
	this.tile = tile;
	this.color = color;
	this.dama = false;
    this.timer = 0;

    this.geom = new PiecePrimitive(this.scene, 1.5, 0.4, 0.4, 100, 100, texture);
    this.animation;
}

Piece.prototype.constructor = Piece;

Piece.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.registerForPick(this.tile.id, this.tile);
		this.scene.translate(this.tile.x, 1, this.tile.z);
		if(this.dama == true) {
			this.scene.scale(1, 2, 1);
		}
		this.geom.display();
	this.scene.popMatrix();
}

Piece.prototype.setTile = function(newTile) {
    this.tile = newTile;
}
