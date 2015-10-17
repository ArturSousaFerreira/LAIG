function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {

    CGFscene.prototype.init.call(this, application);

    // this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
	this.loadedOk = false;
	this.interface = null;

	this.nodes = [];
	this.numero = 0;
};

XMLscene.prototype.setInterface = function (interface) {
	this.interface = interface;
}


XMLscene.prototype.init_Cameras = function () {
	var near =this.graph.initials.frustum["near"];
	var far = this.graph.initials.frustum["far"];
    this.camera = new CGFcamera(0.4, near,far, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    this.interface.setActiveCamera(this.camera);
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.4, 0.4, 0.4, 1.0);
    this.setDiffuse(0.3, 0.3, 0.3, 1.0);
    this.setSpecular(0.3, 0.3, 0.3, 1.0);
    this.setShininess(10.0);
};

XMLscene.prototype.initObjects = function() {

}


XMLscene.prototype.init_Initials = function () {
    //-> reference, build new axis
    if(this.graph.reference!=0){
		this.axis = new CGFaxis(this,this.graph.initials.reference);
	}

    this.translate(this.graph.initials.translate.x, this.graph.initials.translate.y, this.graph.initials.translate.z);

       if(this.graph.initials.rotation.x != 0){
			this.rotate((this.graph.initials.rotation.x *Math.PI/180.0), 1, 0, 0);
       }
       if(this.graph.initials.rotation.y != 0){
			this.rotate((this.graph.initials.rotation.y *Math.PI/180.0), 1, 0, 0);
       }
       if(this.graph.initials.rotation.z != 0){
			this.rotate((this.graph.initials.rotation.z *Math.PI/180.0), 1, 0, 0);
       }

    this.scale(this.graph.initials.scale.sx, this.graph.initials.scale.sy, this.graph.initials.scale.sz);
};

XMLscene.prototype.init_Illumination = function () {

	//-> ambient
    var amb_r = this.graph.illu.ambient["r"];
    var amb_g = this.graph.illu.ambient["g"];
    var amb_b = this.graph.illu.ambient["b"];
    var amb_a = this.graph.illu.ambient["a"];
    this.setGlobalAmbientLight(amb_r, amb_g, amb_b, amb_a);

	//-> background color
	this.gl.clearColor(this.graph.illu.background["r"],this.graph.illu.background["g"],this.graph.illu.background["b"],this.graph.illu.background["a"]);

};

XMLscene.prototype.init_Lights = function () {

    this.shader.bind();
    var lights_id = [];
    var num_lights = 0;

    for( var k in this.graph.lights ) {
    	lights_id.push(k);
    	num_lights++;
    }

	for( var i = 0; i < num_lights; i++){
		var current_id = lights_id[i];

		var pos_x = this.graph.lights[current_id]["position"]["x"];
    	var pos_y = this.graph.lights[current_id]["position"]["y"];
    	var pos_z = this.graph.lights[current_id]["position"]["z"];
    	var pos_w = this.graph.lights[current_id]["position"]["w"];
    	this.lights[i].setPosition(pos_x, pos_y, pos_z, pos_w);

    	var amb_r = this.graph.lights[current_id]["ambient"]["r"];
    	var amb_g = this.graph.lights[current_id]["ambient"]["g"];
    	var amb_b = this.graph.lights[current_id]["ambient"]["b"];
    	var amb_a = this.graph.lights[current_id]["ambient"]["a"];
    	this.lights[i].setAmbient(amb_r, amb_g, amb_b, amb_a);

    	var dif_r = this.graph.lights[current_id]["diffuse"]["r"];
    	var dif_g = this.graph.lights[current_id]["diffuse"]["g"];
    	var dif_b = this.graph.lights[current_id]["diffuse"]["b"];
    	var dif_a = this.graph.lights[current_id]["diffuse"]["a"];
    	this.lights[i].setDiffuse(dif_r, dif_g, dif_b, dif_a);

    	var spe_r = this.graph.lights[current_id]["specular"]["r"];
    	var spe_g = this.graph.lights[current_id]["specular"]["g"];
    	var spe_b = this.graph.lights[current_id]["specular"]["b"];
    	var spe_a = this.graph.lights[current_id]["specular"]["a"];
    	this.lights[i].setSpecular(spe_r, spe_g, spe_b, spe_a);

    	var ena = this.graph.lights[current_id]["enable"];
    	if(ena) this.lights[i].enable();

		this.lights[i].setVisible(true);
    	this.lights[i].update();

	}
    this.shader.unbind();
};
XMLscene.prototype.init_Materials = function () {

    this.materials=[];
    for (var i in this.graph.materials) {
        var currAppearance = new CGFappearance(this);

        var id = this.graph.materials[i]["id"];
        var shin = this.graph.materials[i]["shininess"];
        var spec = this.graph.materials[i]["specular"];
        var diff = this.graph.materials[i]["diffuse"];
        var amb = this.graph.materials[i]["ambient"];
        var emi = this.graph.materials[i]["emission"];

        currAppearance.setShininess(shin);
        currAppearance.setSpecular(spec["r"], spec["g"], spec["b"], spec["a"]);
        currAppearance.setDiffuse(diff["r"], diff["g"], diff["b"], diff["a"]);
        currAppearance.setAmbient(amb["r"], amb["g"], amb["b"], amb["a"]);
        currAppearance.setEmission(emi["r"], emi["g"], emi["b"], emi["a"]);
        currAppearance.id=id;

        this.materials[i]=currAppearance;
    };
}

XMLscene.prototype.init_Textures = function () {
	var num_textures_id = 0;
	this.textures = [];

    for( var id in this.graph.textures ) {
		this.textures[id] = new CGFtexture(this, this.graph.textures[id].file);
		this.textures[id].amplif_factor = this.graph.textures[id].amplif_factor;//
		this.textures[id].file = this.graph.textures[id].file;//
		console.log(this.textures[id]);
		num_textures_id++;
    }

    if( num_textures_id > 0 )
    	this.enableTextures(true);

};

XMLscene.prototype.init_Leaves = function () {

	this.leaves = [];

	for( var i in this.graph.leaves){
		var graph_leaf = this.graph.leaves[i];

		if(graph_leaf.type == 'cylinder')
			this.leaves[i] =new MyCylinder(this, graph_leaf.args[0], graph_leaf.args[1], graph_leaf.args[2], graph_leaf.args[3], graph_leaf.args[4]);
		else if(graph_leaf.type == 'rectangle')
			this.leaves[i] = new MyRectangle(this, graph_leaf.args[0], graph_leaf.args[1], graph_leaf.args[2], graph_leaf.args[3]);
		else if(graph_leaf.type == 'triangle')
			this.leaves[i] = new MyTriangle(this, graph_leaf.args[0], graph_leaf.args[1], graph_leaf.args[2], graph_leaf.args[3], graph_leaf.args[4], graph_leaf.args[5], graph_leaf.args[6], graph_leaf.args[7], graph_leaf.args[8]);
		/*else if(graph_leaf.type == 'sphere'){
			this.leaves[i] = new MySphere(this, slices, stacks);*/
	}

};

XMLscene.prototype.init_Nodes = function() {

    var root_node = this.graph.nodes['root'];
	// this.applyViewMatrix();
	console.log(this.graph.nodes['root']);
	this.pushMatrix();
    this.itDescend(root_node, root_node["texture"], root_node["material"], root_node["matrix"]);
    this.popMatrix();
};

XMLscene.prototype.itDescend = function(node, currTexture_ID, currMaterial_ID, curr_Matrix) {

	if (node == undefined) return;

	// TEXTURE
	var nextTexture_ID = node["texture"];
	if (node["texture"] == null)
		nextTexture_ID = currTexture_ID;
	else if (node["texture"] == "clear")
		nextTexture_ID == null;

   	// MATERIAL
   	var nextMaterial_ID = node["material"];
	if (node["material"] == null)
		nextMaterial_ID = currMaterial_ID;

	console.log(node.matrix);
	var nextMatrix = mat4.create();
    mat4.multiply(nextMatrix, curr_Matrix, node.matrix);

    for (var i = 0; i < node.descendants.length; i++) {
    	var num_nodes = 0;
    	var index_no = 0;
		var nextNode_id = node.descendants[i];

		//console.log(this.graph.nodes);

		for ( var no in this.graph.nodes ) {
			if( no == nextNode_id ){
				nextNode = this.graph.nodes[no];
				break;
			}
			else
				nextNode = null;
		}

        if( nextNode == null ) {
        	console.log("como");
        	var primitive = new Primitive(nextNode_id);

        	for( var id_tex in this.textures ) {
        		if (id_tex == nextTexture_ID) {
        			primitive.texture = this.textures[id_tex];
        			console.log("o");
        			break;
        		}
        	}
        	for( var id_mat in this.materials ) {
        		if (id_mat == nextMaterial_ID) {
        			primitive.material = this.materials[id_mat];
        			console.log("l");
        			break;
        		}
        	}
        	for( var id_leaf in this.leaves ) {
        		if (id_leaf == primitive.id) {
        			primitive.leaf = this.leaves[id_leaf];
        			console.log("a");
        			break;
        		}
        	}
        	primitive.matrix = nextMatrix;

			console.log(this.nodes);
        	this.nodes.push(primitive);
        	console.log(this.nodes[1]);
        	console.log(this.numero);
        	this.numero++;
        	break;

        	//this.nodes[index_no].id = nextNode_id;
        	//this.nodes[index_no].id = nextNode_id;
        	continue;
        }

        index_no++;

		this.pushMatrix();
        this.itDescend(nextNode, nextTexture_ID, nextMaterial_ID, nextMatrix);
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

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {
	this.init_Initials();
	this.init_Illumination();
	this.init_Lights();
	this.init_Cameras();
	this.init_Textures();
	this.init_Materials();
	this.init_Leaves();
	this.init_Nodes();
	console.log(this.nodes);

	this.loadedOk =true;
};

XMLscene.prototype.display = function () {

	if (this.loadedOk == false) return;
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();
	//this.rectangle.display();
	this.setDefaultAppearance();
	/*
	for(var i in this.graph.leaves){
		this.leaves[i].display();
	}
	*/

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk) {
		for(var i in this.lights){
			this.lights[i].update();
		}

		// Nodes

		console.log(this.nodes[2]);
        for (i = 1; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if( node.id == "sphere1") continue;
			this.pushMatrix();

			//node.material.apply();
			this.multMatrix(node.matrix);
			node.leaf.display();
			this.popMatrix();
        }

	};

    this.shader.unbind();

};
