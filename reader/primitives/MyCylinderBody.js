function MyCylinderBody(scene, bRadius, tRadius, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

	this.bRadius = bRadius;
	this.tRadius = tRadius;

 	this.initBuffers();
};

MyCylinderBody.prototype = Object.create(CGFobject.prototype);
MyCylinderBody.prototype.constructor = MyCylinderBody;

MyCylinderBody.prototype.initBuffers = function() {
	var angle = 2*Math.PI/this.slices;
	var deltaRadius = (this.tRadius - this.bRadius) / this.stacks;

	this.vertices=[];
 	this.normals=[];
 	this.texCoords = [];

 	for(var i = 0; i < this.stacks+1; i++) {
 		for(var j = 0; j < this.slices; j++) {
 			this.vertices.push((this.bRadius + (deltaRadius * i))*Math.cos(j*angle),(this.bRadius + (deltaRadius * i))*Math.sin(j*angle),i/this.stacks);
 			this.normals.push(Math.cos(j*angle),Math.sin(j*angle),0);
 			this.texCoords.push(
                1 - j / this.slices,
                i / this.stacks
            );
 		}
 	}

 	this.indices=[];

	for(var i = 0; i < this.stacks; i++){
		for(var j = 0; j < this.slices; j++){
			this.indices.push(i*this.slices+j,i*this.slices+((j+1)%this.slices),(i+1)*this.slices+(j+1)%this.slices);
			this.indices.push(i*this.slices+j,(i+1)*this.slices+((j+1)%this.slices),(i+1)*this.slices+j);
		}
	}
	
    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
 };