function MyDiamond_cone(scene, height, bRadius, tRadius, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

	this.height = height;
	this.bRadius = bRadius;
	this.tRadius = tRadius;
	
    this.piramide = new MyCylinder(this.scene, height, bRadius, 0, stacks, slices);

};

MyDiamond_cone.prototype = Object.create(CGFobject.prototype);
MyDiamond_cone.prototype.constructor = MyDiamond_cone;

MyDiamond_cone.prototype.display = function() {
this.scene.pushMatrix()
    this.scene.translate(2, 2, 2);
    this.piramide.display();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.piramide.display();
    this.scene.popMatrix();
	

}