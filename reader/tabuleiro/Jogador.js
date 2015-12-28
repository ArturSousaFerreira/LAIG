function Jogador(scene, turn, color) {	
	this.scene = scene;
	this.done = false;

	this.turn = turn;
	this.color = color;
}

Jogador.prototype.constructor = Jogador;

Jogador.prototype.PieceSelected = function() {

	for(l in this.scene.game.tabuleiro.pieces) {
		if( this.scene.game.tabuleiro.pieces[l].color == this.color ) {
			if( this.scene.game.tabuleiro.pieces[l].tile.selected == true ) {
				this.selected_piece = this.scene.game.tabuleiro.pieces[l];
			}
		}		
	}
    //this.scene.game.tabuleiro.pieces[l].setTile(this.scene.game.tabuleiro.tiles[this.scene.game.tabuleiro.pieces[l].tile]);
}

Jogador.prototype.jogada = function() {

	this.PieceSelected();
    if(this.scene.pickResults[0] != undefined ) {


    	if(this.selected_piece != undefined) {
    		if(this.scene.pickResults[0][0].id != 0 && this.selected_piece.tile.id != this.scene.pickResults[0][0].id) {
				this.selected_piece.setTile(this.scene.pickResults[0][0]);
				this.done = true;
				this.selected_piece = null ;	
			

    		}
		}
    }

   
}