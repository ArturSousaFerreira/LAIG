function MyCube(scene, edge) {
 	CGFobject.call(this, scene);
 	
 	this.scene = scene;	
	this.edge = edge;

	this.rect = new MyRectangle(this.scene, -edge/2, -edge/2, edge/2, edge/2);

 	this.initBuffers();
};

MyCube.prototype = Object.create(CGFobject.prototype);
MyCube.prototype.constructor = MyCube;

MyCube.prototype.display = function() {
 	
	this.scene.pushMatrix();
		this.scene.translate(0, 0, -this.edge/2);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.scene.translate(-this.edge/2, 0, 0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.scene.translate(0, 0, this.edge/2);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.scene.translate(this.edge/2, 0, 0);
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.scene.translate(0, this.edge/2, 0);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.scene.translate(0, -this.edge/2, 0);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.rect.display();
    this.scene.popMatrix();
 };