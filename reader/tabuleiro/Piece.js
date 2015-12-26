function Piece(scene, tile) {
    this.geom = new MyCylinder(this.scene, 1, this.texture);
}

Piece.prototype.constructor = Piece;

Piece.prototype.init = function() {
	this.geom = new CylinderPrimitive(this.scene, 3, 0.8, 0.8, 100, 100, this.texture);
}

Piece.prototype.display = function() {
    this.geom.display();
}

//TODO: setTile, quando a peça muda de casa