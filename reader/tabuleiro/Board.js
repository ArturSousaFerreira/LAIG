function Board(scene) {	
	this.scene = scene;

	this.tiles = [];
	this.pieces = [];

	this.textures = [];

	this.textures["steel"] = new CGFtexture(this.scene, "textures/steel.jpg");
	this.textures["clickme"] = new CGFtexture(this.scene, "textures/clickme.jpg");
	this.textures["paper"] = new CGFtexture(this.scene, "textures/paper.jpg");
	this.textures["wall_pattern"] = new CGFtexture(this.scene, "textures/wall_paper.jpg");
	this.textures["chair_pattern"] = new CGFtexture(this.scene, "textures/bordeaux.jpg");
	this.textures["lamp_top_pattern"] = new CGFtexture(this.scene, "textures/beje.jpg");


	

	this.supportTop = new PiecePrimitive(this.scene, 5, Math.sqrt(2)/2, 0, 100, 4, this.textures["steel"]);
	this.supportBottom = new PiecePrimitive(this.scene, 5, Math.sqrt(2)/2, 0, 100, 4, this.textures["steel"]);

	this.buttonTop = new ButtonPrimitive(scene, 1, this.textures["clickme"], this.textures["paper"]);
	this.buttonBottom = new TilePrimitive(scene, 1, this.textures["steel"]);

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
			this.tiles[i] = new Tile(this.scene, "white", x_pos, z_pos, this.textures["paper"], 0);
			this.tiles[i+1] = new Tile(this.scene, "black", x_pos+1, z_pos, this.textures["wall_pattern"], id);
			x_pos += 2;
			id++;
		}
		x_pos = 1;
		for(i = 8+j*16; i < 16+j*16; i+=2 ) {
			this.tiles[i] = new Tile(this.scene, "black", x_pos, z_pos+1, this.textures["wall_pattern"], id);
			this.tiles[i+1] = new Tile(this.scene, "white", x_pos+1, z_pos+1, this.textures["paper"], 0);
			x_pos += 2;
			id++;
		}
		z_pos += 2;
	}


	// Inicialização das peças do tabuleiro
	//Peças Brancas
	this.pieces[0] = new Piece(this.scene, "white", this.tiles[1], this.textures["lamp_top_pattern"]);
	this.pieces[1] = new Piece(this.scene, "white", this.tiles[3], this.textures["lamp_top_pattern"]);
	this.pieces[2] = new Piece(this.scene, "white", this.tiles[5], this.textures["lamp_top_pattern"]);
	this.pieces[3] = new Piece(this.scene, "white", this.tiles[7], this.textures["lamp_top_pattern"]);
	this.pieces[4] = new Piece(this.scene, "white", this.tiles[8], this.textures["lamp_top_pattern"]);
	this.pieces[5] = new Piece(this.scene, "white", this.tiles[10], this.textures["lamp_top_pattern"]);
	this.pieces[6] = new Piece(this.scene, "white", this.tiles[12], this.textures["lamp_top_pattern"]);
	this.pieces[7] = new Piece(this.scene, "white", this.tiles[14], this.textures["lamp_top_pattern"]);
	this.pieces[8] = new Piece(this.scene, "white", this.tiles[17], this.textures["lamp_top_pattern"]);
	this.pieces[9] = new Piece(this.scene, "white", this.tiles[19], this.textures["lamp_top_pattern"]);
	this.pieces[10] = new Piece(this.scene, "white", this.tiles[21], this.textures["lamp_top_pattern"]);
	this.pieces[11] = new Piece(this.scene, "white", this.tiles[23], this.textures["lamp_top_pattern"]);

	//Peças Pretas
	this.pieces[12] = new Piece(this.scene, "black", this.tiles[56], this.textures["chair_pattern"]);
	this.pieces[13] = new Piece(this.scene, "black", this.tiles[58], this.textures["chair_pattern"]);
	this.pieces[14] = new Piece(this.scene, "black", this.tiles[60], this.textures["chair_pattern"]);
	this.pieces[15] = new Piece(this.scene, "black", this.tiles[62], this.textures["chair_pattern"]);
	this.pieces[16] = new Piece(this.scene, "black", this.tiles[49], this.textures["chair_pattern"]);
	this.pieces[17] = new Piece(this.scene, "black", this.tiles[51], this.textures["chair_pattern"]);
	this.pieces[18] = new Piece(this.scene, "black", this.tiles[53], this.textures["chair_pattern"]);
	this.pieces[19] = new Piece(this.scene, "black", this.tiles[55], this.textures["chair_pattern"]);
	this.pieces[20] = new Piece(this.scene, "black", this.tiles[40], this.textures["chair_pattern"]);
	this.pieces[21] = new Piece(this.scene, "black", this.tiles[42], this.textures["chair_pattern"]);
	this.pieces[22] = new Piece(this.scene, "black", this.tiles[44], this.textures["chair_pattern"]);
	this.pieces[23] = new Piece(this.scene, "black", this.tiles[46], this.textures["chair_pattern"]);


	
	for(y in this.tiles) {
		for(t in this.pieces){
			if(this.pieces[t].tile.id == this.tiles[y].id)
				this.tiles[y].occupied = true;	
		}
	}
}

Board.prototype.display = function() {
	
	this.scene.pushMatrix();
	this.scene.scale(1,0.2,1);

	//Display da parte de cima do botão
	this.scene.pushMatrix();
		this.scene.translate(14.5, 3.5, 4.5);
		this.scene.rotate(Math.PI, 1, 0, 0);
		this.scene.scale(4, 1, 2);
		this.buttonTop.display();
	this.scene.popMatrix();

	//Display da parte de baixo do botão
	this.scene.pushMatrix();
		this.scene.translate(14.5, 1.5, 4.5);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.scale(3, 3, 5);
		this.buttonBottom.display();
	this.scene.popMatrix();

	//Display do suporte de cima do tabuleiro
	this.scene.pushMatrix();
	this.scene.registerForPick(101, this);
		this.scene.translate(4.5, 27, 4.5);
		this.scene.rotate(Math.PI/4, 0, 1, 0);
		this.scene.rotate(Math.PI, 1, 0, 0);
		this.scene.scale(9, 5, 9);
		this.supportTop.display();
	this.scene.popMatrix();

	//Display do suporte de baixo do tabuleiro
	this.scene.pushMatrix();
		this.scene.translate(4.5, 2, 4.5);
		this.scene.rotate(Math.PI/4, 0, 1, 0);
		this.scene.scale(5, 5, 5);
		this.supportTop.display();
	this.scene.popMatrix();
	
	// Display de todas as casas do tabuleiro
	for(k in this.tiles) {
		this.scene.pushMatrix();
			this.scene.translate(0, 30, 0);
			this.tiles[k].display();
		this.scene.popMatrix();
	}

	// Display de todas as peças do tabuleiro
	for(l in this.pieces) {
		if(this.pieces[l] != null)
			if(this.pieces[l].animation == undefined) {
				this.scene.pushMatrix();
					this.scene.translate(0, 30, 0);
					this.pieces[l].display();
				this.scene.popMatrix();
			}
	}

	for(l in this.pieces) {
		if(this.pieces[l] != null) {
			if(this.pieces[l].animation != undefined) {
				//if(this.pieces[l].animation.finish == false)
					this.scene.multMatrix(this.pieces[l].animation.matrix);

				this.scene.pushMatrix();
					this.scene.translate(0, 30, 0);
					this.pieces[l].display();
				this.scene.popMatrix();
			}
		}
	}

	this.scene.popMatrix();
}
