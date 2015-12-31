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
				this.comeu = false;

				if(this.selected_piece.dama == false) {
					if(this.checkJogada(this.selected_piece, this.scene.pickResults[0][0]) == false)
						return;
				} else {
					if(this.checkJogadaDama(this.selected_piece, this.scene.pickResults[0][0]) == false)
						return;
				}
				
				//this.selected_piece.animation = new PieceAnimation(this.scene, 1, this.selected_piece, this.scene.pickResults[0][0]);
				//console.log(this.selected_piece.animation);
								
				
				this.selected_piece.tile.setOccupied(false);
				this.selected_piece.setTile(this.scene.pickResults[0][0]);
				this.selected_piece.tile.setOccupied(true);
				
			
				if(this.comeu == true) {
					if(this.checkJogadaDupla(this.selected_piece) == true) {
						console.log("outra jogada");
					}
					else {
						this.done = true;
						this.selected_piece = null;
					}
				} else {
					this.done = true;
					this.selected_piece = null;
				}
				
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
				
				this.comeu = true;
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

				this.comeu = true;
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

				this.comeu = true;
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
				
				this.comeu = true;
				this.scene.game.deletePiece(peca_intermedia);
			}
		}
}

Jogador.prototype.checkJogadaDupla = function(piece) {
	if(piece.color == "white") {
		var pode_ir_esquerda = true;
		var pode_ir_direita = true;

		if(piece.tile.z >= 7)
			return false;
		
		//verificar se é possível efetuar uma jogada à esquerda
		for(t in this.scene.game.tabuleiro.tiles) {
			if(piece.tile.x <= 2) {
				pode_ir_esquerda = false;
				break;
			}
			if(this.scene.game.tabuleiro.tiles[t].x == piece.tile.x-1 && this.scene.game.tabuleiro.tiles[t].z == piece.tile.z+1) {
				var casa_proxima_esquerda = this.scene.game.tabuleiro.tiles[t];

				if(casa_proxima_esquerda.occupied == false) {
					pode_ir_esquerda = false;
					break;
				}
				else {
					for(p in this.scene.game.tabuleiro.pieces) { //próxima peça à esquerda
						if(this.scene.game.tabuleiro.pieces[p] != null)
							if(this.scene.game.tabuleiro.pieces[p].tile.id == casa_proxima_esquerda.id)
								var peca_proxima_esquerda = this.scene.game.tabuleiro.pieces[p];
					}

					if(peca_proxima_esquerda.color == "white") {
						pode_ir_esquerda = false;
						break;
					}
					else if(peca_proxima_esquerda.color == "black"){
						for(ti in this.scene.game.tabuleiro.tiles) {
							if(this.scene.game.tabuleiro.tiles[ti].x == piece.tile.x-2 && this.scene.game.tabuleiro.tiles[ti].z == piece.tile.z+2) {
								var casa_proxima2_esquerda = this.scene.game.tabuleiro.tiles[ti];

								if(casa_proxima2_esquerda.occupied == true) {
									pode_ir_esquerda = false;
									break;
								}
							}
						}
					}
				}
			}
		}

		//verificar se é possível efetuar uma jogada à direita
		for(t in this.scene.game.tabuleiro.tiles) {
			if(piece.tile.x >= 7) {
				pode_ir_direita = false;
				break;
			}
			if(this.scene.game.tabuleiro.tiles[t].x == piece.tile.x+1 && this.scene.game.tabuleiro.tiles[t].z == piece.tile.z+1) {
				var casa_proxima_direita = this.scene.game.tabuleiro.tiles[t];

				if(casa_proxima_direita.occupied == false) {
					pode_ir_direita = false;
					break;
				}
				else {
					for(p in this.scene.game.tabuleiro.pieces) { //próxima peça à esquerda
						if(this.scene.game.tabuleiro.pieces[p] != null)
							if(this.scene.game.tabuleiro.pieces[p].tile.id == casa_proxima_direita.id)
								var peca_proxima_direita = this.scene.game.tabuleiro.pieces[p];
					}

					if(peca_proxima_direita.color == "white") {
						pode_ir_direita = false;
						break;
					}
					else if(peca_proxima_direita.color == "black"){
						for(ti in this.scene.game.tabuleiro.tiles) {
							if(this.scene.game.tabuleiro.tiles[ti].x == piece.tile.x+2 && this.scene.game.tabuleiro.tiles[ti].z == piece.tile.z+2) {
								var casa_proxima2_direita = this.scene.game.tabuleiro.tiles[ti];

								if(casa_proxima2_direita.occupied == true) {
									pode_ir_direita = false;
									break;
								}
							}
						}
					}
				}
			}
		}

		if(pode_ir_esquerda == true || pode_ir_direita == true) {
			return true;
		} else
			return false;
	}
	else if(piece.color == "black") {
		var pode_ir_esquerda = true;
		var pode_ir_direita = true;

		if(piece.tile.z <= 2)
			return false;
		
		//verificar se é possível efetuar uma jogada à esquerda
		for(t in this.scene.game.tabuleiro.tiles) {
			if(piece.tile.x <= 2) {
				pode_ir_esquerda = false;
				break;
			}
			if(this.scene.game.tabuleiro.tiles[t].x == piece.tile.x-1 && this.scene.game.tabuleiro.tiles[t].z == piece.tile.z-1) {
				var casa_proxima_esquerda = this.scene.game.tabuleiro.tiles[t];

				if(casa_proxima_esquerda.occupied == false) {
					pode_ir_esquerda = false;
					break;
				}
				else {
					for(p in this.scene.game.tabuleiro.pieces) { //próxima peça à esquerda
						if(this.scene.game.tabuleiro.pieces[p] != null)
							if(this.scene.game.tabuleiro.pieces[p].tile.id == casa_proxima_esquerda.id)
								var peca_proxima_esquerda = this.scene.game.tabuleiro.pieces[p];
					}

					if(peca_proxima_esquerda.color == "black") {
						pode_ir_esquerda = false;
						break;
					}
					else if(peca_proxima_esquerda.color == "white"){
						for(ti in this.scene.game.tabuleiro.tiles) {
							if(this.scene.game.tabuleiro.tiles[ti].x == piece.tile.x-2 && this.scene.game.tabuleiro.tiles[ti].z == piece.tile.z-2) {
								var casa_proxima2_esquerda = this.scene.game.tabuleiro.tiles[ti];

								if(casa_proxima2_esquerda.occupied == true) {
									pode_ir_esquerda = false;
									break;
								}
							}
						}
					}
				}
			}
		}

		//verificar se é possível efetuar uma jogada à direita
		for(t in this.scene.game.tabuleiro.tiles) {
			if(piece.tile.x >= 7) {
				pode_ir_direita = false;
				break;
			}
			if(this.scene.game.tabuleiro.tiles[t].x == piece.tile.x+1 && this.scene.game.tabuleiro.tiles[t].z == piece.tile.z-1) {
				var casa_proxima_direita = this.scene.game.tabuleiro.tiles[t];

				if(casa_proxima_direita.occupied == false) {
					pode_ir_direita = false;
					break;
				}
				else {
					for(p in this.scene.game.tabuleiro.pieces) { //próxima peça à esquerda
						if(this.scene.game.tabuleiro.pieces[p] != null)
							if(this.scene.game.tabuleiro.pieces[p].tile.id == casa_proxima_direita.id)
								var peca_proxima_direita = this.scene.game.tabuleiro.pieces[p];
					}

					if(peca_proxima_direita.color == "black") {
						pode_ir_direita = false;
						break;
					}
					else if(peca_proxima_direita.color == "white"){
						for(ti in this.scene.game.tabuleiro.tiles) {
							if(this.scene.game.tabuleiro.tiles[ti].x == piece.tile.x+2 && this.scene.game.tabuleiro.tiles[ti].z == piece.tile.z-2) {
								var casa_proxima2_direita = this.scene.game.tabuleiro.tiles[ti];

								if(casa_proxima2_direita.occupied == true) {
									pode_ir_direita = false;
									break;
								}
							}
						}
					}
				}
			}
		}

		if(pode_ir_esquerda == true || pode_ir_direita == true) {
			return true;
		} else
			return false;
	}
}

Jogador.prototype.checkJogadaDama = function(peca, casa) {
	if(casa.occupied == true)
		return false;

	if(peca.tile.x == casa.x || peca.tile.z == casa.z) {
		return false;
	}

	/*if( peca.color == "white" ) {
		if( peca.tile.z >= casa.z )
			return false;
	} else 
		if( peca.tile.z <= casa.z )
			return false;*/

	if( Math.abs(peca.tile.x-casa.x) > 2 )
		return false;
	
	if( Math.abs(peca.tile.z-casa.z) > 2 )
		return false;

	if( Math.abs(peca.tile.x-casa.x) == 2 && Math.abs(peca.tile.z-casa.z) == 2 )
		if( peca.color == "white" ) {
			//caso em que uma dama branca tenta comer uma peça preta à frente à direita
			if( peca.tile.x < casa.x && peca.tile.z < casa.z) {
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
				
				this.comeu = true;
				this.scene.game.deletePiece(peca_intermedia);
			}
			//caso em que uma dama branca tenta comer uma peça preta atrás à direita
			else if( peca.tile.x < casa.x && peca.tile.z > casa.z) {
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
					if(peca_intermedia.color == "white")
						return false;
				}

				for(o in this.scene.game.tabuleiro.tiles) {
					if(this.scene.game.tabuleiro.tiles[o].id == peca_intermedia.tile.id)
						this.scene.game.tabuleiro.tiles[o].occupied = false;				
				}

				if(peca_intermedia.color == "white") {
					this.scene.game.whitepieces--;
				} else
					this.scene.game.blackpieces--;

				this.comeu = true;
				this.scene.game.deletePiece(peca_intermedia);
			}
			//caso em que uma dama branca tenta comer uma peça preta à frente à esquerda
			else if( peca.tile.x > casa.x && peca.tile.z < casa.z) {
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

				if(peca_intermedia.color == "white") {
					this.scene.game.whitepieces--;
				} else
					this.scene.game.blackpieces--;

				this.comeu = true;
				this.scene.game.deletePiece(peca_intermedia);
			}
			//caso em que uma dama branca tenta comer uma peça preta atrás à esquerda
			else if( peca.tile.x > casa.x && peca.tile.z > casa.z) {
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
				
				this.comeu = true;
				this.scene.game.deletePiece(peca_intermedia);
			}
		}

		else if( peca.color == "black" ) {
			//caso em que uma dama preta tenta comer uma peça branca à frente à direita
			if( peca.tile.x < casa.x && peca.tile.z < casa.z) {
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
				
				this.comeu = true;
				this.scene.game.deletePiece(peca_intermedia);
			}
			//caso em que uma dama branca tenta comer uma peça preta atrás à direita
			else if( peca.tile.x < casa.x && peca.tile.z > casa.z) {
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

				if(peca_intermedia.color == "white") {
					this.scene.game.whitepieces--;
				} else
					this.scene.game.blackpieces--;

				this.comeu = true;
				this.scene.game.deletePiece(peca_intermedia);
			}
			//caso em que uma dama branca tenta comer uma peça preta à frente à esquerda
			else if( peca.tile.x > casa.x && peca.tile.z < casa.z) {
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
					if(peca_intermedia.color == "black")
						return false;
				}

				for(o in this.scene.game.tabuleiro.tiles) {
					if(this.scene.game.tabuleiro.tiles[o].id == peca_intermedia.tile.id)
						this.scene.game.tabuleiro.tiles[o].occupied = false;				
				}

				if(peca_intermedia.color == "white") {
					this.scene.game.whitepieces--;
				} else
					this.scene.game.blackpieces--;

				this.comeu = true;
				this.scene.game.deletePiece(peca_intermedia);
			}
			//caso em que uma dama branca tenta comer uma peça preta atrás à esquerda
			else if( peca.tile.x > casa.x && peca.tile.z > casa.z) {
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
				
				this.comeu = true;
				this.scene.game.deletePiece(peca_intermedia);
			}
		}
}