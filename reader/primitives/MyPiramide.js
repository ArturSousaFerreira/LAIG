function MyPiramide(scene, slices) {
 	CGFobject.call(this, scene);
	
	this.slices = slices;

 	this.initBuffers();
 };

 MyPiramide.prototype = Object.create(CGFobject.prototype);
 MyPiramide.prototype.constructor = MyPiramide;

 MyPiramide.prototype.initBuffers = function() {	
 	var angle = 2*Math.PI/this.slices;
 	
	this.vertices = [];
 	this.normals = [];
 	//this.texCoords = [];
	
    this.vertices.push(0,-1,0);
    this.normals.push(0,0,1);
//    this.texCoords.push(0,0);
  //  this.texCoords.push(0,1);

 	for(var i = 0; i < this.slices; i++){
 		this.vertices.push(Math.cos(i*angle)/2, 0, Math.sin(i*angle)/2);
 		this.normals.push(0,0,1);
		
 		//this.texCoords.push(0.5*Math.cos(i*angle),0.5);
 	} 	
 	this.indices=[];

	for(var j = 1; j < this.slices; j++){
		this.indices.push(j+1,j,0);
	}	
	this.indices.push(0,1,this.slices);
	
	

	
	this.vertices.push(0,0,0);
	this.normals.push(0,1,0);
	
	for(var j = 1; j < this.slices; j++){
		this.indices.push(j,j+1,this.slices+1);
	}
	
	this.indices.push(this.slices,1,this.slices+1);
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };