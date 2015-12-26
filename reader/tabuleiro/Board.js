function Board(scene) {	
	this.scene = scene;

	this.tiles = [];
	this.pieces = [];

    this.init();
}

Board.prototype.constructor = Board;

Board.prototype.init = function() {	
	
	// Inicialização das casas do tabuleiro
	var x_pos;
	var z_pos = 1;

	for(j = 0; j < 4; j++) {
		x_pos = 1;
		for(i = 0+j*16; i < 8+j*16; i+=2 ) {
			this.tiles[i] = new Tile(this.scene, x_pos, z_pos, this.scene.textures["paper"]);
			this.tiles[i+1] = new Tile(this.scene, x_pos+1, z_pos, this.scene.textures["wall_pattern"]);
			x_pos += 2;
		}
		x_pos = 1;
		for(i = 8+j*16; i < 16+j*16; i+=2 ) {
			this.tiles[i] = new Tile(this.scene, x_pos, z_pos+1, this.scene.textures["wall_pattern"]);
			this.tiles[i+1] = new Tile(this.scene, x_pos+1, z_pos+1, this.scene.textures["paper"]);
			x_pos += 2;
		}
		z_pos += 2;
	}

}

Board.prototype.display = function() {

	// Display de todas as casas do tabuleiro
	for(k in this.tiles) {
		this.scene.registerForPick(id_pick++, this.tiles[k]);
		this.scene.pushMatrix();			
			this.scene.translate(this.tiles[k].x, 0.5, this.tiles[k].z);
			this.tiles[k].display();
		this.scene.popMatrix();
	}
}
