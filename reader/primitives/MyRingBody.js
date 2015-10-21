function MyRingBody(scene, Sradius, thickness, slices, stacks) {
 	CGFobject.call(this, scene);
	
	this.Sradius = Sradius;
	this.thickness = thickness;
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyRingBody.prototype = Object.create(CGFobject.prototype);
 MyRingBody.prototype.constructor = MyRingBody;

 MyRingBody.prototype.initBuffers = function() {	
 	var angle = 2*Math.PI/this.slices;
 	
	this.vertices = [];
 	this.normals = [];

 	for(var i = 0; i < this.stacks+1; i++) {
 		for(var j = 0; j < this.slices; j++) {
 			this.vertices.push(Math.cos(j*angle)*this.Sradius, i/this.stacks, Math.sin(j*angle)*this.Sradius);
 			this.vertices.push(Math.cos(j*angle)*(this.Sradius+this.thickness), i/this.stacks, Math.sin(j*angle)*(this.Sradius+this.thickness));
 			this.normals.push(0,0,1);
 			this.normals.push(0,0,1);
 		}
 	}

 	this.indices=[];

	for(var i = 0; i < this.stacks; i++){
		for(var j = 0; j < this.slices-1; j++){
			if ( j == this.slices-1 ) {

			}
			
			/* LADO DE FORA */
			this.indices.push((i*this.slices*2)+(j*2)+3, (i*this.slices*2)+(j*2)+1, ((i+1)*this.slices*2)+(j*2)+1);
			this.indices.push(((i+1)*this.slices*2)+(j*2)+1, ((i+1)*this.slices*2)+(j*2)+3, (i*this.slices*2)+(j*2)+3);

			/* LADO DE DENTRO */
			this.indices.push((i*this.slices*2)+(j*2), (i*this.slices*2)+(j*2)+2, ((i+1)*this.slices*2)+(j*2)+2);
			this.indices.push(((i+1)*this.slices*2)+(j*2)+2, ((i+1)*this.slices*2)+(j*2), (i*this.slices*2)+(j*2));
		}
	}
	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };