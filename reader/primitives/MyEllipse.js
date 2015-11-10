function MyEllipse(scene, axis1, axis2, slices) {
 	CGFobject.call(this, scene);
	
	this.axis1 = axis1;
	this.axis2 = axis2;
	this.slices = slices;

 	this.initBuffers();
 };

 MyEllipse.prototype = Object.create(CGFobject.prototype);
 MyEllipse.prototype.constructor = MyEllipse;

 MyEllipse.prototype.initBuffers = function() {	
 	var angle = 2*Math.PI/this.slices;
 	
	this.vertices = [];
 	this.normals = [];

 	for(var i = 0; i < this.slices; i++){
 		this.vertices.push(Math.cos(i*angle)*this.axis1/2, Math.sin(i*angle)*this.axis2/2, 0);
 		this.normals.push(0,0,1);
 	}

 	this.indices=[];

	for(var j = 0; j < this.slices-2; j++){
		this.indices.push(0,j+1,j+2);
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };