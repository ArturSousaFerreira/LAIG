function MySims(scene, slices) {
 	CGFobject.call(this, scene);
	
	this.slices = slices;

 	this.initBuffers();
 };

 MySims.prototype = Object.create(CGFobject.prototype);
 MySims.prototype.constructor = MySims;

 MySims.prototype.initBuffers = function() {	
 	var angle = 2*Math.PI/this.slices;
 	
	this.vertices = [];
 	this.normals = [];
 	this.texCoords = [];
 	
    this.vertices.push(0,-1,0);
    this.vertices.push(0,1,0);    
    this.normals.push(0,0,1);
    this.normals.push(0,0,1);
    this.texCoords.push(0,0);
    this.texCoords.push(0,1);

 	for(var i = 0; i < this.slices; i++){
 		this.vertices.push(Math.cos(i*angle)/2, 0, Math.sin(i*angle)/2);
 		this.normals.push(0,0,1);
 		this.texCoords.push(1,i/this.slices);
 	} 	

 	this.indices=[];

	for(var j = 2; j < this.slices+1; j++){
		this.indices.push(j+1,j,1);
		this.indices.push(0,j,j+1);
	}

	this.indices.push(2,this.slices+1,1);
	this.indices.push(0,this.slices+1,2);
	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };