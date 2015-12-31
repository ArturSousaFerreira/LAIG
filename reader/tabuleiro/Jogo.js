function Jogo(scene) {	
	this.scene = scene;

	this.jogadas = [];
	this.blackpieces = 12;
	this.whitepieces = 12;
	this.gameover = false;

    this.init();
}

Jogo.prototype.constructor = Jogo;

Jogo.prototype.init = function() {
    this.jogador1 = new Jogador(this.scene, true, "white");
    this.jogador2 = new Jogador(this.scene, false, "black");

    this.tabuleiro = new Board(this.scene);

    //for... this.jogadas
}

Jogo.prototype.getPlayertoPlay = function() {	
	if(this.jogador1.turn == true)
		return this.jogador1;

	if(this.jogador2.turn == true)
		return this.jogador2;
}

Jogo.prototype.ChangePlayertoPlay = function() {
	var rot = -30;

	if(this.getPlayertoPlay().done == true) {
		if(this.jogador1.turn == false) {
			this.jogador1.turn = true;
			rot = -30;
		} else {
			this.jogador1.turn = false;
			this.jogador1.done = false;
		}

		if(this.jogador2.turn == false) {
			this.jogador2.turn = true;
			rot = 30;
		} else {
			this.jogador2.turn = false;
			this.jogador2.done = false;
		}
		//this.scene.camera = new CGFcamera(0.4, 1.5, 500, vec3.fromValues(0, 30, rot), vec3.fromValues(0, 0, 0));
	}		
}

Jogo.prototype.turnIntoDama = function() {
	for(i in this.tabuleiro.pieces) {
		if(this.tabuleiro.pieces[i] != null) {
			if(this.tabuleiro.pieces[i].color == "white") {
				if(this.tabuleiro.pieces[i].tile.z >= 8) {
					this.tabuleiro.pieces[i].dama = true;
				}
			}
			else if(this.tabuleiro.pieces[i].color == "black") {
				if(this.tabuleiro.pieces[i].tile.z <= 1) {
					this.tabuleiro.pieces[i].dama = true;
				}
			}
		}
	}
}

Jogo.prototype.checkGameOver = function() {
	if(this.blackpieces == 0)
		//location.replace("gameoverBrancas.html");
		console.log("brancas ganham");
	if(this.whitepieces == 0)
		location.replace("gameoverPretas.html");
}

Jogo.prototype.deletePiece = function(pieceDelete) {
	for(i in this.tabuleiro.pieces) {
		if(this.tabuleiro.pieces[i] == pieceDelete) {
			this.tabuleiro.pieces[i] = null;
		}
	}
}


Jogo.prototype.play = function() {	
	this.checkGameOver();
	this.getPlayertoPlay().jogada();
	//this.fix_id_tile();
	this.turnIntoDama();
	this.ChangePlayertoPlay();
}


Jogo.prototype.display = function() {
	this.play();	
	this.tabuleiro.display();
}
