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

XMLscene.prototype.init_Leaves = function () {
	
	this.leaves = [];
	
	for( var i in this.graph.leaves){
		var graph_leaf = this.graph.leaves[i];

		if(graph_leaf.type == 'cylinder'){
						this.leaves[i] =new MyCylinder(this, graph_leaf.args[0], graph_leaf.args[1], graph_leaf.args[2], graph_leaf.args[3], graph_leaf.args[4]);
		} else if(graph_leaf.type == 'rectangle'){
						this.leaves[i] = new MyRectangle(this, graph_leaf.args[0], graph_leaf.args[1], graph_leaf.args[2], graph_leaf.args[3]);

		//} else if(this.graph.leaves[i].type == 'sphere'){
						//this.leave = new MySphere(this, slices, stacks);
		} else if(graph_leaf.type == 'triangle'){
						this.leaves[i] = new MyTriangle(this, graph_leaf.args[0], graph_leaf.args[1], graph_leaf.args[2], graph_leaf.args[3], graph_leaf.args[4], graph_leaf.args[5], graph_leaf.args[6], graph_leaf.args[7], graph_leaf.args[8]);
		}
	}
  
};

XMLscene.prototype.init_Textures = function () {
	var num_textures_id = 0;
	var textures = [];

    for( var id in this.graph.textures ) {		
		textures[id] = new CGFtexture(this, this.graph.textures[id].file);
		textures[id].amplif_factor = this.graph.textures[id].amplif_factor;//
		textures[id].file = this.graph.textures[id].file;//
		num_textures_id++;
    }

    if( num_textures_id > 0 )
    	this.enableTextures(true);

};

XMLscene.prototype.init_Nodes = function() {
  

    var root_node = this.graph.nodes['root'];
	// this.applyViewMatrix();
	this.pushMatrix();
    this.itDescend(root_node, root_node["texture"], root_node["material"]);
    this.popMatrix();
};

XMLscene.prototype.itDescend = function(node, currTexture, currMaterial) {

	if (node == undefined) return;

	if(node["descendants"] == undefined ){
   		node.display();
   		return;
   	}
   	
	// TEXTURE
	var nextTex = node["texture"];
	if (node["texture"] == null)
		nextTex = currTexture;
	else if (node["texture"] == "clear")
		nextTex == null;

   	// MATERIAL
   	var nextMat = node["material"];
	if (node["material"] == null)
		nextMat = currMaterial;
	

	var local = node['matrix'];
	this.multMatrix(local);

    for (var i = 0; i < node.descendants.length; i++) {
		var nextNode;

        if(this.nodes_list[node.descendants[i]] != null) {
        	nextNode = this.nodes_list[node.descendants[i]];
        	if (nextNode == undefined) {
        		console.log("found undefined node for id " + node.descendants[i]);
			}
		
        }
        else 
        	nextNode = this.leaves[node.descendants[i]];

		this.pushMatrix();
        this.itDescend(nextNode, nextMat);
        this.popMatrix();
    }
   
};

XMLscene.prototype.getMaterial = function(id) {
    if (id == null) return null;

    for (var i = 0; i < this.materials.length; i++)
        if (id == this.materials[i].id) return this.materials[i];

    return null;
};


// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.init_Initials();
	this.init_Illumination();
	this.init_Lights();
	this.init_Cameras();
	this.init_Materials();
	this.init_Leaves();
	this.init_Textures();
	this.nodes_list = this.graph.nodes;

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
	if (this.graph.loadedOk)
	{
		for(var i in this.lights){
			
		this.lights[i].update();
			
		}
			this.init_Nodes();	
	};	

    this.shader.unbind();

};