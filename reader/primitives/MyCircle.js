function MyCircle(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;

 	this.initBuffers();
 };

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function() {
	
 	var angle = 2*Math.PI/this.slices;
 	
	this.vertices = [];
 	this.normals = [];
 	this.texCoords = [];

 	for(var i = 0; i < this.slices; i++){
 		this.vertices.push(Math.cos(i*angle), Math.sin(i*angle), 0);
 		this.normals.push(0,0,1);
 		this.texCoords.push(0.5 + 0.5 * Math.cos(i * angle), 0.5 - 0.5 * Math.sin(i * angle));
 	}

 	this.indices=[];

	for(var j = 0; j < this.slices-2; j++){
		this.indices.push(0,j+1,j+2);
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };