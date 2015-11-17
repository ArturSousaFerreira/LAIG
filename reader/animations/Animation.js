function Animation(span, type) {
    this.span = span;
    this.type = type;

    this.startTime = -1;
	
	this.matrix = mat4.create();
	
}

Animation.prototype.constructor = Animation;

