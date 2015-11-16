function CircularAnimation(scene,id, span, center, startAngle, rotAngle, radius) {
    Animation.call(this, id, span, "circular");
   
   this.id = id;
    this.span = span;
    this.center = center;
    this.startAngle = startAngle;
    this.rotAngle = rotAngle;
    this.radius = radius;
   
   this.init();
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function() {
	this.initialTransformation = mat4.create();
	mat4.identity(this.initialTransformation);
	mat4.rotateY(this.initialTransformation, this.initialTransformation, this.startAngle);
	mat4.translate(this.initialTransformation, this.initialTransformation,
				   vec3.fromValues(0, 0, this.radius));
	
	mat4.rotateY(this.initialTransformation, this.initialTransformation,
				this.rotAngle > 0 ? Math.PI / 2 : - Math.PI / 2);
}

CircularAnimation.prototype.calculateMatrix = function(t) {

	t = Math.min(t, this.span);

	this.matrix = mat4.create();
	mat4.identity(this.matrix);
	
	if (t < 0)
		return this.matrix;

	mat4.translate(this.matrix, this.matrix, this.center[0]);

	var rot = this.rotAngle * (t / this.span);
	mat4.rotateY(this.matrix, this.matrix, rot);
	mat4.multiply(this.matrix, this.matrix, this.initialTransformation);

	return this.matrix;
}