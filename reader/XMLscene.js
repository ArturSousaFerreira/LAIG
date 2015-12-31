function XMLscene() {
	CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

id_pick = 1;

XMLscene.prototype.init = function (application) {

	CGFscene.prototype.init.call(this, application);

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);
	this.loadedOk = false;
	this.interface = null;
	
	this.setUpdatePeriod(50);

	// Set Picking to true
	this.setPickEnabled(true);
	

	if( this.graphDefault == undefined) {
		this.graphDefault = "Grafo2";
	} 

	this.init_Jogo();


	this.graphs = [];
	this.nodes = [];
};


XMLscene.prototype.init_Jogo = function () {
	this.game = new Jogo(this);
};

XMLscene.prototype.setInterface = function (interface) {
	this.interface = interface;
};

XMLscene.prototype.setDefaultAppearance = function () {
	this.setAmbient(0.4, 0.4, 0.4, 1.0);
	this.setDiffuse(0.3, 0.3, 0.3, 1.0);
	this.setSpecular(0.3, 0.3, 0.3, 1.0);
	this.setShininess(10.0);
};

/*
 *  Initialization of the Camera
 */
XMLscene.prototype.init_Camera = function (graphName) {
	var near = this.graphs[graphName].initials.frustum["near"];
	var far = this.graphs[graphName].initials.frustum["far"];

	// Se o atributo near for colocado a 0, uma vez que não pode ser 0, fica 0.1
	if(near == 0)
		near = 0.1;

	var camera_x = this.graphs[graphName].initials.camera["x"];
	var camera_y = this.graphs[graphName].initials.camera["y"];
	var camera_z = this.graphs[graphName].initials.camera["z"];

	this.camera = new CGFcamera(0.4, near, far, vec3.fromValues(camera_x, camera_y, camera_z), vec3.fromValues(0, 0, 0));
	this.camera.setTarget([0,0,-4]);
	this.interface.setActiveCamera(this.camera);
};

/*
 *  Initialization of the Initial values
 */
XMLscene.prototype.init_Initials = function (graphName) {
    //-> reference, build new axis
    this.initials = this.graphs[graphName].initials;

	//-> initial matrix
	this.initialMatrix = mat4.create();
	
	mat4.identity(this.initialMatrix);
	mat4.translate(this.initialMatrix, this.initialMatrix, [this.initials.translation.x, this.initials.translation.y, this.initials.translation.z]);

	mat4.rotate(this.initialMatrix, this.initialMatrix, this.initials.rotate1.angle * Math.PI / 180, 
				[
					this.initials.rotate1.axis == "x" ? 1 : 0,
					this.initials.rotate1.axis == "y" ? 1 : 0,
					this.initials.rotate1.axis == "z" ? 1 : 0
				]
	);

	mat4.rotate(this.initialMatrix,	this.initialMatrix,	this.initials.rotate2.angle * Math.PI / 180,
				[
					this.initials.rotate2.axis == "x" ? 1 : 0,
					this.initials.rotate2.axis == "y" ? 1 : 0,
					this.initials.rotate2.axis == "z" ? 1 : 0
				]
	);

	mat4.rotate(this.initialMatrix,	this.initialMatrix,	this.initials.rotate3.angle * Math.PI / 180,
				[
					this.initials.rotate3.axis == "x" ? 1 : 0,
					this.initials.rotate3.axis == "y" ? 1 : 0,
					this.initials.rotate3.axis == "z" ? 1 : 0
				]
	);

	mat4.scale(this.initialMatrix, this.initialMatrix,[this.initials.scale.sx, this.initials.scale.sy, this.initials.scale.sz]);

};

/*
 *  Initialization of Animations
 */
XMLscene.prototype.init_Animations = function(graphName) {
	this.animationsobjects = [];

	for( var i in this.graphs[graphName].animations ) {	
		var anim = this.graphs[graphName].animations[i];

		if( anim["type"] == "linear" )
			this.animationsobjects[i] = new LinearAnimation(this, anim['span'], anim['control_points']);
		else if( anim["type"] == "circular" )
			this.animationsobjects[i] = new CircularAnimation(this, anim['span'], anim['center'], anim['startang'], anim['rotang'], anim['radius']);
	}
}

/*
 *  Initialization of Illumination
 */
XMLscene.prototype.init_Illumination = function (graphName) {
	//-> ambient
	var amb_r = this.graphs[graphName].illu.ambient["r"];
	var amb_g = this.graphs[graphName].illu.ambient["g"];
	var amb_b = this.graphs[graphName].illu.ambient["b"];
	var amb_a = this.graphs[graphName].illu.ambient["a"];
	this.setGlobalAmbientLight(amb_r, amb_g, amb_b, amb_a);

	//-> background color
	this.gl.clearColor(this.graphs[graphName].illu.background["r"],this.graphs[graphName].illu.background["g"],this.graphs[graphName].illu.background["b"],this.graphs[graphName].illu.background["a"]);
};

/*
 *  Initialization of Lights
 */
XMLscene.prototype.init_Lights = function (graphName) {
	this.lights_enable = [];

	this.lights_id = [];
	var num_lights = 0;

	for( var k in this.graphs[graphName].lights ) {
		this.lights_id.push(k);
		num_lights++;
	}

	for( var i = 0; i < num_lights; i++){
		var current_id = this.lights_id[i];

		var pos_x = this.graphs[graphName].lights[current_id]["position"]["x"];
		var pos_y = this.graphs[graphName].lights[current_id]["position"]["y"];
		var pos_z = this.graphs[graphName].lights[current_id]["position"]["z"];
		var pos_w = this.graphs[graphName].lights[current_id]["position"]["w"];
		this.lights[i].setPosition(pos_x, pos_y, pos_z, pos_w);

		var amb_r = this.graphs[graphName].lights[current_id]["ambient"]["r"];
		var amb_g = this.graphs[graphName].lights[current_id]["ambient"]["g"];
		var amb_b = this.graphs[graphName].lights[current_id]["ambient"]["b"];
		var amb_a = this.graphs[graphName].lights[current_id]["ambient"]["a"];
		this.lights[i].setAmbient(amb_r, amb_g, amb_b, amb_a);

		var dif_r = this.graphs[graphName].lights[current_id]["diffuse"]["r"];
		var dif_g = this.graphs[graphName].lights[current_id]["diffuse"]["g"];
		var dif_b = this.graphs[graphName].lights[current_id]["diffuse"]["b"];
		var dif_a = this.graphs[graphName].lights[current_id]["diffuse"]["a"];
		this.lights[i].setDiffuse(dif_r, dif_g, dif_b, dif_a);

		var spe_r = this.graphs[graphName].lights[current_id]["specular"]["r"];
		var spe_g = this.graphs[graphName].lights[current_id]["specular"]["g"];
		var spe_b = this.graphs[graphName].lights[current_id]["specular"]["b"];
		var spe_a = this.graphs[graphName].lights[current_id]["specular"]["a"];
		this.lights[i].setSpecular(spe_r, spe_g, spe_b, spe_a);

		var ena = this.graphs[graphName].lights[current_id]["enable"];
		if(ena) this.lights[i].enable();

		this.lights[i].setVisible(true);
		this.lights[i].update();
		this.lights_enable[current_id] = this.graphs[graphName].lights[current_id].enable;
	}
	if(this.loadedOk==true)
	this.interface.create_interface();
};

/*
 *  Initialization of Textures
 */
XMLscene.prototype.init_Textures = function (graphName) {
	var num_textures_id = 0;
	this.textures = [];

	console.log("\nLOADED TEXTURES:");
	for( var id in this.graphs[graphName].textures ) {
		this.textures[id] = new CGFtexture(this, this.graphs[graphName].textures[id].file);
		this.textures[id].amplif_factor = this.graphs[graphName].textures[id].amplif_factor;//
		this.textures[id].file = this.graphs[graphName].textures[id].file;//
		num_textures_id++;
	}

	if( num_textures_id > 0 )
		this.enableTextures(true);

};

/*
 *  Initialization of Materials
 */
XMLscene.prototype.init_Materials = function (graphName) {
	this.materials = [];

	for (var i in this.graphs[graphName].materials) {
		var currAppearance = new CGFappearance(this);

		var id = this.graphs[graphName].materials[i]["id"];
		var shin = this.graphs[graphName].materials[i]["shininess"];
		var spec = this.graphs[graphName].materials[i]["specular"];
		var diff = this.graphs[graphName].materials[i]["diffuse"];
		var amb = this.graphs[graphName].materials[i]["ambient"];
		var emi = this.graphs[graphName].materials[i]["emission"];

		currAppearance.setShininess(shin);
		currAppearance.setSpecular(spec["r"], spec["g"], spec["b"], spec["a"]);
		currAppearance.setDiffuse(diff["r"], diff["g"], diff["b"], diff["a"]);
		currAppearance.setAmbient(amb["r"], amb["g"], amb["b"], amb["a"]);
		currAppearance.setEmission(emi["r"], emi["g"], emi["b"], emi["a"]);
		currAppearance.id = id;

		this.materials[i] = currAppearance;
	}
};

/*
 *  Initialization of Leaves
 */
XMLscene.prototype.init_Leaves = function (graphName) {
	this.leaves = [];

	for( var i in this.graphs[graphName].leaves ) {
		var graph_leaf = this.graphs[graphName].leaves[i];
		var argums = graph_leaf.args;

		switch(graph_leaf.type) {
			case "cylinder":
				this.leaves[i] = new MyCylinder(this, argums[0], argums[1], argums[2], argums[3], argums[4]);
				break;
			case "rectangle":
				this.leaves[i] = new MyRectangle(this, argums[0], argums[1], argums[2], argums[3]);
				break;
			case "triangle":
				this.leaves[i] = new MyTriangle(this, argums[0], argums[1], argums[2], argums[3], argums[4], argums[5], argums[6], argums[7], argums[8]);
				break;
			case "sphere":
				this.leaves[i] = new MySphere(this, argums[0], argums[1], argums[2]);
				break;
			case "diamond":
				this.leaves[i] = new MyDiamond(this, argums[0], argums[1]);
				break;
			case "sims":
				this.leaves[i] = new MySims(this, argums[0],  argums[1]);
				break;
			case "diamond_cone":
				this.leaves[i] = new MyDiamond_cone(this, argums[0], argums[1], argums[2], argums[3], argums[4]);
				break;
			case "cone":
				this.leaves[i] = new MyCone(this, argums[0], argums[1], argums[2], argums[3], argums[4]);
				break;
			case "piramide":
				this.leaves[i] = new MyPiramide(this, argums[0]);
				break;
			case "ring":
				this.leaves[i] = new MyRing(this, argums[0], argums[1], argums[2], argums[3], argums[4]);
				break;
			case "annulus":
				this.leaves[i] = new MyAnnulus(this, argums[0], graph_leaf.args[1], graph_leaf.args[2]);
				break;
			case "ellipse":
				this.leaves[i] = new MyEllipse(this, argums[0], argums[1], argums[2]);
				break;
			case "patch":
				this.leaves[i] = new MyPatch(this, graph_leaf.order, graph_leaf.partsU, graph_leaf.partsV, graph_leaf.control_points);
				break;
			case "plane":
				this.leaves[i] = new MyPlane(this, graph_leaf.parts);
				break;
			case "terrain":
				this.leaves[i] = new MyTerrain(this, graph_leaf.texture, graph_leaf.heightmap);
				break;
		}
	}
};

/*
 *  Initialization of Nodes
 */
XMLscene.prototype.init_Nodes = function(graphName) {
	this.primitivas = [];

	this.nodes = this.graphs[graphName].nodes;

    var root_node = this.graphs[graphName].nodes[this.graphs[graphName].root_id]; //node.js

    root_node["matrix"] = this.initialMatrix;

    this.pushMatrix();
    this.itDescend(root_node, root_node["texture"], root_node["material"], root_node["matrix"], graphName);
    this.popMatrix();
};

XMLscene.prototype.itDescend = function(node, currTexture_ID, currMaterial_ID, curr_Matrix, graphName) {

	// TEXTURE
	var nextTexture_ID = node.texture;
	if (node.texture == "null")
		nextTexture_ID = currTexture_ID;
	else if (node.texture == "clear")
		nextTexture_ID == null;

   	// MATERIAL
   	var nextMaterial_ID = node.material;
   	if (node.material == "null")
   		nextMaterial_ID = currMaterial_ID;

   	var nextMatrix = mat4.create();
   	mat4.multiply(nextMatrix, curr_Matrix, node.matrix);

   	if( typeof node.animations != "undefined") {
   		for(var l in node.animations) {
   			//if(this.animationsobjects[node.animations[l]] != undefined)
   				node.animations[l]= this.animationsobjects[node.animations[l]];
   		}
   	}

   	for( var i = 0; i < node.descendants.length; i++ ) {
   		var num_nodes = 0;
   		var index_no = 0;
   		var nextNode_id = node.descendants[i];
   		var nextNode;

   		for ( var no in this.graphs[graphName].nodes ) {
   			if( no == nextNode_id ) {
   				nextNode = this.graphs[graphName].nodes[no];
   				break;
   			}
   			else
   				nextNode = null;
   		}

   		if( nextNode == null ) {
   			var primitive = new Primitive(nextNode_id);

   			for( var id_tex in this.textures ) {
   				if (id_tex == nextTexture_ID) {
   					primitive.texture = this.textures[id_tex];
   					break;
   				}
   			}
   			for( var id_mat in this.materials ) {
   				if (id_mat == nextMaterial_ID) {
   					primitive.material = this.materials[id_mat];
   					break;
   				}
   			}
   			for( var id_leaf in this.leaves ) {
   				if (id_leaf == primitive.id) {
   					primitive.leaf = this.leaves[id_leaf];
   					break;
   				}
   			}
   			primitive.matrix = nextMatrix;
   			this.primitivas.push(primitive);
   			node.leaf
   			continue;
   		}

   		index_no++;

   		this.pushMatrix();
   		this.itDescend(nextNode, nextTexture_ID, nextMaterial_ID, nextMatrix, graphName);
   		this.popMatrix();
   	}

   };

function Primitive(id) {
	this.id = id;
	this.texture = null;
	this.material = null;
	this.matrix = null;
	this.leaf = null;
}

// Esta função é chamada na Interface.js
XMLscene.prototype.Toggle_Light = function(id, turned_on) {

	for ( var i = 0; i < this.lights_id.length; i++ ) {
		light_id = this.lights_id[i];
		if (light_id == id) {
			if(turned_on)
				this.lights[i].enable();
			else
				this.lights[i].disable();

			break;
		}
	}
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function (graphName) {	
	this.init_Camera(graphName);
	this.init_Initials(graphName);
	this.init_Animations(graphName);
	this.init_Illumination(graphName);
	this.init_Lights(graphName);
	this.init_Textures(graphName);
	this.init_Materials(graphName);
	
	this.init_Leaves(graphName);	
	this.init_Nodes(graphName);
	

	
	this.loadedOk = true;
};

XMLscene.prototype.drawNodes = function (node, graphName) {
	
	this.pushMatrix();
	//console.log(node.matrix);
	this.multMatrix(node.matrix);

	if(node.material != "null") {
		this.materials[node.material].setTexture(this.textures[node.texture]);
		this.materials[node.material].apply();
	}		

	for(var t in node.descendants) {
		this.pushMatrix();

		if(typeof node.animations != "undefined") {
			for(var k in node.animations){
				if(node.animations[k] != undefined)
					if(node.animations[k].finish == false){
						this.multMatrix(node.animations[k].matrix);
						break;
					}				
			}			
		}
		
		if(node.descendants[t] == "patch") {
			this.leaves[node.descendants[t]].display();
		}

		if(typeof this.graphs[graphName].nodes[node.descendants[t]] == "undefined") {
			//this.registerForPick(id_pick++,this.leaves[node.descendants[t]]);
			if(this.leaves[node.descendants[t]] != undefined)
				this.leaves[node.descendants[t]].display();
		} else
			this.drawNodes(this.nodes[node.descendants[t]], graphName);

		this.popMatrix();
	}

	this.popMatrix();	
}

XMLscene.prototype.display = function () {

	this.logPicking();
	this.clearPickRegistration();
	if (this.loadedOk == false) return;
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	// Draw axis
	//this.axis.display();
	
	this.setDefaultAppearance();

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	
	if (this.graphs[this.graphDefault].loadedOk) {
		for(var i in this.lights)
			this.lights[i].update();

		this.pushMatrix();
			this.translate(-4.5, 0.1, -4.5);
			this.game.display();
		this.popMatrix();

		this.drawNodes(this.graphs[this.graphDefault].nodes[this.graphs[this.graphDefault].nodes.root], this.graphDefault);
		id_pick = 1;
	};

};

XMLscene.prototype.update = function(currTime) {
	
	for (var n in this.graphs[this.graphDefault].nodes) {
		for(var k in this.graphs[this.graphDefault].nodes[n].animations) {
			if (this.lastUpdate != 0)
				this.graphs[this.graphDefault].nodes[n].timer += (currTime - this.lastUpdate) / 1000;

			if(this.graphs[this.graphDefault].nodes[n].animations[k] != undefined)
				if(this.graphs[this.graphDefault].nodes[n].animations[k].finish == false) {
					this.graphs[this.graphDefault].nodes[n].animations[k].calculateMatrix(currTime / 1000);
					break;
				}
		}		
	}

	if(this.game != undefined)
	for (n in this.game.tabuleiro.pieces) {		
		if(this.game.tabuleiro.pieces[n] != null)
			if(this.game.tabuleiro.pieces[n].animation != undefined)	
				if(this.game.tabuleiro.pieces[n].animation.finish == false) {
					console.log("calcular matrix");
					this.game.tabuleiro.pieces[n].animation.calculateMatrix(currTime / 1000);
					break;
				}	
	}
}


XMLscene.prototype.logPicking = function () {

	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				this.obj = this.pickResults[i][0];
				if (this.obj) {
					this.customId = this.pickResults[i][1];				
					console.log("Picked object: " + this.obj + ", with pick id " + this.customId);
					if(this.customId != 0) {
						if(this.customId == 100) {
							this.pickResults[i][1] = null;
							this.loadedOk = false;

							if(this.graphDefault == "Grafo1") {
								this.graphDefault = "Grafo2";								
								this.onGraphLoaded("Grafo2");
							}
							else if(this.graphDefault == "Grafo2") {
								this.graphDefault = "Grafo1";
								this.onGraphLoaded("Grafo1");
							}
						}
						for(g in this.game.tabuleiro.tiles) {
							if( this.game.tabuleiro.tiles[g].selected == true ) {
								this.game.tabuleiro.tiles[g].selected = false;
								this.game.tabuleiro.tiles[g].geom.appearance.setTexture(this.game.tabuleiro.tiles[g].init_texture);
							}
						}
						if(this.pickResults[i][0].type == "Tile") {
							for(l in this.game.tabuleiro.pieces) {
								if(this.game.tabuleiro.pieces[l] != null) {
									if(this.game.tabuleiro.pieces[l].tile.id == this.pickResults[i][0].id){
										if(this.game.tabuleiro.pieces[l].color == this.game.getPlayertoPlay().color) {
											this.pickResults[i][0].selected = true;

											

											this.pickResults[i][0].geom.appearance.setTexture(this.textures["flag"]);
										}
									}
								}
							}						
						}
					}					
				}
			}
			//this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

