function Jogador(scene, turn, color) {	
	this.scene = scene;
	this.done = false;

	this.turn = turn;
	this.color = color;
}

Jogador.prototype.constructor = Jogador;

Jogador.prototype.PieceSelected = function() {
	for(l in this.scene.game.tabuleiro.pieces) {
		if(this.scene.game.tabuleiro.pieces[l] != null) {
			if( this.scene.game.tabuleiro.pieces[l].color == this.color ) {
				if( this.scene.game.tabuleiro.pieces[l].tile.selected == true ) {
					this.selected_piece = this.scene.game.tabuleiro.pieces[l];
				}
			}
		}
	}
}

Jogador.prototype.jogada = function() {
	this.PieceSelected();

    if(this.scene.pickResults[0] != undefined ) {
    	if(this.selected_piece != undefined) {
    		if(this.scene.pickResults[0][0].id != 0 && this.selected_piece.tile.id != this.scene.pickResults[0][0].id) {
				//if( this.scene.pickResults[0][0].id ) {
				if(this.checkJogada(this.selected_piece, this.scene.pickResults[0][0]) == false)
					return;
				
				this.selected_piece.tile.setOccupied(false);

				this.selected_piece.setTile(this.scene.pickResults[0][0]);
				this.selected_piece.tile.setOccupied(true);
				this.done = true;
				this.selected_piece = null;

    		}
		}
    }   
}

Jogador.prototype.checkJogada = function(peca, casa) {
	if(casa.occupied == true)
		return false;

	if( peca.tile.x == casa.x || peca.tile.z == casa.z ) {
		return false;
	}

	if( peca.color == "white" ) {
		if( peca.tile.z >= casa.z )
			return false;
	} else 
		if( peca.tile.z <= casa.z )
			return false;

	if( Math.abs(peca.tile.x-casa.x) > 2 )
		return false;
	
	if( Math.abs(peca.tile.z-casa.z) > 2 )
		return false;

	if( Math.abs(peca.tile.x-casa.x) == 2 && Math.abs(peca.tile.z-casa.z) == 2)
		if( peca.color == "white" ) {
			if( peca.tile.x < casa.x ) {
				//vai buscar a casa entre as posiçoes inicial e final selecionadas
				var casa_intermedia = this.scene.game.tabuleiro.tiles[(casa.z*8)-(8-casa.x)-10];
				//vai buscar a peça entre as posiçoes inicial e final selecionadas, se existir
				for(i in this.scene.game.tabuleiro.pieces) {
					if(this.scene.game.tabuleiro.pieces[i] != null) {
						if(this.scene.game.tabuleiro.pieces[i].tile.id == casa_intermedia.id) {
							var peca_intermedia = this.scene.game.tabuleiro.pieces[i];
							break;
						}
					}
				}

				if(casa_intermedia.occupied == false)
					return false;
				else {
					if(peca_intermedia.color == "white")
						return false;
				}

				for(o in this.scene.game.tabuleiro.tiles) {
					if(this.scene.game.tabuleiro.tiles[o].id == peca_intermedia.tile.id)
						this.scene.game.tabuleiro.tiles[o].occupied = false;				
				}

				if(peca_intermedia.color == "black") {
					this.scene.game.blackpieces--;
				} else
					this.scene.game.whitepieces--;

				this.scene.game.deletePiece(peca_intermedia);
			}
			else if (peca.tile.x > casa.x) {
				//vai buscar a casa entre as posiçoes inicial e final selecionadas
				var casa_intermedia = this.scene.game.tabuleiro.tiles[(casa.z*8)-(8-casa.x)-8];
				//vai buscar a peça entre as posiçoes inicial e final selecionadas, se existir
				for(i in this.scene.game.tabuleiro.pieces) {
					if(this.scene.game.tabuleiro.pieces[i] != null) {
						if(this.scene.game.tabuleiro.pieces[i].tile.id == casa_intermedia.id) {
							var peca_intermedia = this.scene.game.tabuleiro.pieces[i];
							break;
						}
					}
				}

				if(casa_intermedia.occupied == false)
					return false;
				else {
					if(peca_intermedia.color == "white")
						return false;
				}

				for(o in this.scene.game.tabuleiro.tiles) {
					if(this.scene.game.tabuleiro.tiles[o].id == peca_intermedia.tile.id)
						this.scene.game.tabuleiro.tiles[o].occupied = false;				
				}

				if(peca_intermedia.color == "black") {
					this.scene.game.blackpieces--;
				} else
					this.scene.game.whitepieces--;

				this.scene.game.deletePiece(peca_intermedia);
			}			
		}
		else if( peca.color == "black" ) {
			if( peca.tile.x < casa.x ) {
				//vai buscar a casa entre as posiçoes inicial e final selecionadas
				var casa_intermedia = this.scene.game.tabuleiro.tiles[(casa.z*8)-(8-casa.x)+6];
				//vai buscar a peça entre as posiçoes inicial e final selecionadas, se existir
				for(i in this.scene.game.tabuleiro.pieces) {
					if(this.scene.game.tabuleiro.pieces[i] != null) {
						if(this.scene.game.tabuleiro.pieces[i].tile.id == casa_intermedia.id) {
							var peca_intermedia = this.scene.game.tabuleiro.pieces[i];
							break;
						}
					}
				}

				if(casa_intermedia.occupied == false)
					return false;
				else {
					if(peca_intermedia.color == "black")
						return false;
				}

				for(o in this.scene.game.tabuleiro.tiles) {
					if(this.scene.game.tabuleiro.tiles[o].id == peca_intermedia.tile.id)
						this.scene.game.tabuleiro.tiles[o].occupied = false;				
				}

				if(peca_intermedia.color == "black") {
					this.scene.game.blackpieces--;
				} else
					this.scene.game.whitepieces--;

				this.scene.game.deletePiece(peca_intermedia);
			}
			else if (peca.tile.x > casa.x) {
				//vai buscar a casa entre as posiçoes inicial e final selecionadas
				var casa_intermedia = this.scene.game.tabuleiro.tiles[(casa.z*8)-(8-casa.x)+8];
				//vai buscar a peça entre as posiçoes inicial e final selecionadas, se existir
				for(i in this.scene.game.tabuleiro.pieces) {
					if(this.scene.game.tabuleiro.pieces[i] != null) {
						if(this.scene.game.tabuleiro.pieces[i].tile.id == casa_intermedia.id) {
							var peca_intermedia = this.scene.game.tabuleiro.pieces[i];
							break;
						}
					}
				}

				if(casa_intermedia.occupied == false)
					return false;
				else {
					if(peca_intermedia.color == "black")
						return false;
				}

				for(o in this.scene.game.tabuleiro.tiles) {
					if(this.scene.game.tabuleiro.tiles[o].id == peca_intermedia.tile.id)
						this.scene.game.tabuleiro.tiles[o].occupied = false;				
				}

				if(peca_intermedia.color == "black") {
					this.scene.game.blackpieces--;
				} else
					this.scene.game.whitepieces--;
				
				this.scene.game.deletePiece(peca_intermedia);
			}
		}
}