function Tile(scene, x, z, texture) {
	this.x = x;
	this.z = z;

    this.geom = new CubePrimitive(scene, 1, texture);
}

Tile.prototype.constructor = Tile;

Tile.prototype.display = function() {
    this.geom.display();
}