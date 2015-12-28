function Jogo(scene) {	
	this.scene = scene;

	this.jogadas = [];
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

	if(this.getPlayertoPlay().done == true) {
		if(this.jogador1.turn == false) {
			this.jogador1.turn = true;
		} else {
			this.jogador1.turn = false;
			this.jogador1.done = false;
		}

		if(this.jogador2.turn == false) {
			this.jogador2.turn = true;
		} else {
			this.jogador2.turn = false;
			this.jogador2.done = false;
		}


			

	}


		
}

Jogo.prototype.checkGameOver = function() {
	
}

Jogo.prototype.play = function() {
	
	this.checkGameOver();
	this.getPlayertoPlay().jogada();
	this.ChangePlayertoPlay();
}


Jogo.prototype.display = function() {
	this.play();
	
	this.tabuleiro.display();
}
