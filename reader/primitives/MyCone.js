function MyCone(scene, height, bRadius, tRadius, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

	this.height = height;
	this.bRadius = bRadius;
	this.tRadius = tRadius;
	
    this.piramide = new MyCylinder(this.scene, height, bRadius, 0, stacks, slices);

};

MyCone.prototype = Object.create(CGFobject.prototype);
MyCone.prototype.constructor = MyCone;

MyCone.prototype.display = function() {
this.scene.pushMatrix()
    this.piramide.display();
    this.scene.popMatrix();
	

}