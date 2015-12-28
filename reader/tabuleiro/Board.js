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
	var id = 1;

	for(j = 0; j < 4; j++) {
		x_pos = 1;
		for(i = 0+j*16; i < 8+j*16; i+=2 ) {
			this.tiles[i] = new Tile(this.scene, "white", x_pos, z_pos, this.scene.textures["paper"], 0);
			this.tiles[i+1] = new Tile(this.scene, "black", x_pos+1, z_pos, this.scene.textures["wall_pattern"], id);
			x_pos += 2;
			id++;
		}
		x_pos = 1;
		for(i = 8+j*16; i < 16+j*16; i+=2 ) {
			this.tiles[i] = new Tile(this.scene, "black", x_pos, z_pos+1, this.scene.textures["wall_pattern"], id);
			this.tiles[i+1] = new Tile(this.scene, "white", x_pos+1, z_pos+1, this.scene.textures["paper"], 0);
			x_pos += 2;
			id++;
		}
		z_pos += 2;
	}

	// Inicialização das peças do tabuleiro
	//Peças Brancas
	this.pieces[0] = new Piece(this.scene, "white", this.tiles[1], this.scene.textures["lamp_top_pattern"]);
	this.pieces[1] = new Piece(this.scene, "white", this.tiles[3], this.scene.textures["lamp_top_pattern"]);
	this.pieces[2] = new Piece(this.scene, "white", this.tiles[5], this.scene.textures["lamp_top_pattern"]);
	this.pieces[3] = new Piece(this.scene, "white", this.tiles[7], this.scene.textures["lamp_top_pattern"]);
	this.pieces[4] = new Piece(this.scene, "white", this.tiles[8], this.scene.textures["lamp_top_pattern"]);
	this.pieces[5] = new Piece(this.scene, "white", this.tiles[10], this.scene.textures["lamp_top_pattern"]);
	this.pieces[6] = new Piece(this.scene, "white", this.tiles[12], this.scene.textures["lamp_top_pattern"]);
	this.pieces[7] = new Piece(this.scene, "white", this.tiles[14], this.scene.textures["lamp_top_pattern"]);
	this.pieces[8] = new Piece(this.scene, "white", this.tiles[17], this.scene.textures["lamp_top_pattern"]);
	this.pieces[9] = new Piece(this.scene, "white", this.tiles[19], this.scene.textures["lamp_top_pattern"]);
	this.pieces[10] = new Piece(this.scene, "white", this.tiles[21], this.scene.textures["lamp_top_pattern"]);
	this.pieces[11] = new Piece(this.scene, "white", this.tiles[23], this.scene.textures["lamp_top_pattern"]);

	//Peças Pretas
	this.pieces[12] = new Piece(this.scene, "black", this.tiles[56], this.scene.textures["chair_pattern"]);
	this.pieces[13] = new Piece(this.scene, "black", this.tiles[58], this.scene.textures["chair_pattern"]);
	this.pieces[14] = new Piece(this.scene, "black", this.tiles[60], this.scene.textures["chair_pattern"]);
	this.pieces[15] = new Piece(this.scene, "black", this.tiles[62], this.scene.textures["chair_pattern"]);
	this.pieces[16] = new Piece(this.scene, "black", this.tiles[49], this.scene.textures["chair_pattern"]);
	this.pieces[17] = new Piece(this.scene, "black", this.tiles[51], this.scene.textures["chair_pattern"]);
	this.pieces[18] = new Piece(this.scene, "black", this.tiles[53], this.scene.textures["chair_pattern"]);
	this.pieces[19] = new Piece(this.scene, "black", this.tiles[55], this.scene.textures["chair_pattern"]);
	this.pieces[20] = new Piece(this.scene, "black", this.tiles[40], this.scene.textures["chair_pattern"]);
	this.pieces[21] = new Piece(this.scene, "black", this.tiles[42], this.scene.textures["chair_pattern"]);
	this.pieces[22] = new Piece(this.scene, "black", this.tiles[44], this.scene.textures["chair_pattern"]);
	this.pieces[23] = new Piece(this.scene, "black", this.tiles[46], this.scene.textures["chair_pattern"]);

}

Board.prototype.display = function() {
	
	this.scene.pushMatrix();
	this.scene.scale(1,0.2,1);
	
	// Display de todas as casas do tabuleiro
	for(k in this.tiles) {
		this.scene.pushMatrix();
			this.tiles[k].display();
		this.scene.popMatrix();
	}

	// Display de todas as peças do tabuleiro

	for(l in this.pieces) {
		this.scene.pushMatrix();
			this.pieces[l].display();
		this.scene.popMatrix();
	}
	this.scene.popMatrix();
}
