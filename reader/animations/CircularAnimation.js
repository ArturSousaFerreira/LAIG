function CircularAnimation(scene, span, center, startang, rotang, radius) {
    Animation.call(this, span, "circular");
   
    this.span = span;
    this.center = center;
    this.startang = startang*(Math.PI/180.0);
    this.rotang = rotang*(Math.PI/180.0);
    this.radius = radius;
   	
   	this.init();
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function() {
	this.finish = false;
	this.transform = mat4.create();
	mat4.identity(this.transform);

	mat4.rotateY(this.transform, this.transform, this.startang);
	mat4.translate(this.transform, this.transform, vec3.fromValues(0, 0, this.radius));
	mat4.rotateY(this.transform, this.transform, this.rotang > 0 ? Math.PI / 2 : - Math.PI / 2);
}

CircularAnimation.prototype.calculateMatrix = function(t) {
	var time = Math.min(t, this.span);
	
	if( time >= this.span ){
		this.finish = true;
		//return;
	}
		
		
	this.matrix = mat4.create();
	mat4.identity(this.matrix);

	mat4.translate(this.matrix, this.matrix, this.center[0]);

	var rot = this.rotang*(time/this.span);
	mat4.rotateY(this.matrix, this.matrix, rot);
	mat4.multiply(this.matrix, this.matrix, this.transform);

}