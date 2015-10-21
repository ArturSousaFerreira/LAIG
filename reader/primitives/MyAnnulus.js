function MyAnnulus(scene, Sradius, thickness, slices) {
 	CGFobject.call(this, scene);
	
	this.Sradius = Sradius;
	this.thickness = thickness;
	this.slices = slices;

 	this.initBuffers();
 };

 MyAnnulus.prototype = Object.create(CGFobject.prototype);
 MyAnnulus.prototype.constructor = MyAnnulus;

 MyAnnulus.prototype.initBuffers = function() {	
 	var angle = 2*Math.PI/this.slices;
 	
	this.vertices = [];
 	this.normals = [];
	
	for(var j = 0; j < this.slices; j++) {
 		this.vertices.push(Math.cos(j*angle)*this.Sradius, 0, Math.sin(j*angle)*this.Sradius);
 		this.vertices.push(Math.cos(j*angle)*(this.Sradius+this.thickness), 0, Math.sin(j*angle)*(this.Sradius+this.thickness));
 		this.normals.push(0,0,1);
 		this.normals.push(0,0,1);
 	}
 	
 	this.indices=[];

	for(var j = 0; j < this.slices; j++){
		if ( j == this.slices-1 ) {
			this.indices.push(j*2, 0, 1);
			this.indices.push(1, j*2+1, j*2);
			break;
		}

		this.indices.push(j*2, (j+1)*2, (j+1)*2+1);
		this.indices.push((j+1)*2+1, (j*2)+1, j*2);
	}
	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };