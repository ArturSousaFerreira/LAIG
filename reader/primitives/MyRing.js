function MyRing(scene, height, Sradius, thickness, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

	this.height = height;
	this.Sradius = Sradius;
	this.thickness = thickness;

	this.bBase = new MyAnnulus(scene, Sradius, thickness, slices);
	this.tBase = new MyAnnulus(scene, Sradius, thickness, slices);
	this.body = new MyRingBody(scene, Sradius, thickness, slices, stacks);

 	this.initBuffers();
};

MyRing.prototype = Object.create(CGFobject.prototype);
MyRing.prototype.constructor = MyRing;

MyRing.prototype.display = function() {
	/* Bottom annulus */
	this.scene.pushMatrix();
		//this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.rotate(Math.PI, 1, 0, 0);
		this.scene.rotate(-Math.PI/this.slices*2, 0, 1, 0);
		this.bBase.display();
	this.scene.popMatrix();

	/* Top annulus */
	this.scene.pushMatrix();
		this.scene.translate(0,this.height,0);
		this.tBase.display();
	this.scene.popMatrix();

	/* Body */
	this.scene.pushMatrix();
		this.scene.scale(1,this.height,1);
		this.body.display();
	this.scene.popMatrix();
}