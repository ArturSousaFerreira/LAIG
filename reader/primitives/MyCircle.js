/**
 * MyCircle
 * @constructor
 */
 function MyCircle(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;

 	this.initBuffers();
 };

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function() {
	
 	var angulo = 2*Math.PI/this.slices;
 	var a = 0;
 	
	this.vertices=[];
 	this.normals=[];

 	for(j = 0; j < this.slices;j++){
 		this.vertices.push(Math.cos(j*angulo),Math.sin(j*angulo),0);
 		this.normals.push(0,0,1);
 	}

 	this.indices=[];

	for(j=0; j < this.slices-2;j++){
		this.indices.push(0,j+1,j+2);
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };