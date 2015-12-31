function ButtonPrimitive(scene, edge, textureTop, textureBottom) {
 	CGFobject.call(this, scene);

 	this.scene = scene;
 	this.edge = edge;
 	this.textureTop = textureTop;
 	this.textureBottom = textureBottom;
 		

    this.appearance = new CGFappearance(this.scene);
    this.appearance.setAmbient(0.8, 0.7, 0.8, 1);
    this.appearance.setDiffuse(0.2, 0.2, 0.2, 1);
    this.appearance.setSpecular(0.2, 0.2, 0.2, 1);
    this.appearance.setShininess(120);
    this.appearance.setTexture(this.textureTop);


    this.appearance2 = new CGFappearance(this.scene);
    this.appearance2.setAmbient(0.8, 0.7, 0.8, 1);
    this.appearance2.setDiffuse(0.2, 0.2, 0.2, 1);
    this.appearance2.setSpecular(0.2, 0.2, 0.2, 1);
    this.appearance2.setShininess(120);
    this.appearance2.setTexture(this.textureBottom);


	this.rect = new MyRectangle(this.scene, -edge/2, -edge/2, edge/2, edge/2);

 	this.initBuffers();
};

ButtonPrimitive.prototype = Object.create(CGFobject.prototype);
ButtonPrimitive.prototype.constructor = ButtonPrimitive;

ButtonPrimitive.prototype.display = function() {
 	
	this.scene.pushMatrix();
	   this.scene.registerForPick(100, this);	
		this.appearance2.apply();
		this.scene.translate(0, 0, -this.edge/2);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.appearance2.apply();
		this.scene.translate(-this.edge/2, 0, 0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.appearance2.apply();
		this.scene.translate(0, 0, this.edge/2);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.appearance2.apply();
		this.scene.translate(this.edge/2, 0, 0);
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.appearance2.apply();
		this.scene.translate(0, this.edge/2, 0);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
		this.appearance.apply();
		this.scene.translate(0, -this.edge/2, 0);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.rect.display();
    this.scene.popMatrix();
 };