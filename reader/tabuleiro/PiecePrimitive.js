function PiecePrimitive(scene, height, bRadius, tRadius, stacks, slices, texture) {
 	CGFobject.call(this, scene);
	this.scene = scene;
 	this.texture = texture;
	
	this.slices = slices;
	this.stacks = stacks;

	this.height = height;
	this.bRadius = bRadius;
	this.tRadius = tRadius;

	this.appearance = new CGFappearance(this.scene);
    this.appearance.setAmbient(0.8, 0.7, 0.8, 1);
    this.appearance.setDiffuse(0.2, 0.2, 0.2, 1);
    this.appearance.setSpecular(0.2, 0.2, 0.2, 1);
    this.appearance.setShininess(120);
    this.appearance.setTexture(this.texture);

	this.bBase = new MyCircle(this.scene, slices);
	this.tBase = new MyCircle(this.scene, slices);
	this.body = new MyCylinderBody(this.scene, bRadius, tRadius, stacks, slices);

 	this.initBuffers();
};

PiecePrimitive.prototype = Object.create(CGFobject.prototype);
PiecePrimitive.prototype.constructor = PiecePrimitive;

PiecePrimitive.prototype.display = function() {
	this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.translate(0, 0, -0.5);
		
		/* Bottom circle */
		this.scene.pushMatrix();
			this.appearance.apply();
			this.scene.scale(this.bRadius, this.bRadius, 1);
			this.scene.rotate(Math.PI, 0, 1, 0);
			this.bBase.display();
		this.scene.popMatrix();

		/* Top circle */
		this.scene.pushMatrix();
			this.appearance.apply();
			this.scene.translate(0, 0, this.height);
			this.scene.scale(this.tRadius, this.tRadius, 1);
			this.tBase.display();
		this.scene.popMatrix();

		/* Body */
		this.scene.pushMatrix();
			this.appearance.apply();
			this.scene.scale(1, 1, this.height);
			this.body.display();
		this.scene.popMatrix();
	this.scene.popMatrix();
}