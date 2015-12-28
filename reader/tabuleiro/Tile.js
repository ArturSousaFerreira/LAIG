function Tile(scene, color, x, z, texture, id) {
	this.scene = scene;
	this.texture = texture;
	this.init_texture = texture;

	this.color = color;
	this.x = x;
	this.z = z;
	this.id = id;
	this.type = "Tile";
	this.selected = false;

    this.geom = new TilePrimitive(scene, 1, this.texture);
}

Tile.prototype.constructor = Tile;

Tile.prototype.display = function() {

		this.scene.pushMatrix();
		this.scene.registerForPick(this.id, this);	
			this.scene.translate(this.x, 0, this.z);
			this.geom.display();
		this.scene.popMatrix();
	

    
}