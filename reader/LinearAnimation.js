function LinearAnimation(id, span, controlPoints) {
    Animation.call(this);

    this.controlPoints = controlPoints;

    this.init();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.init = function() {
    var vector = vec3.create();
    var distance = 0;
    this.translations = new Array(this.controlPoints.length - 1);
    this.rotations = new Array(this.controlPoints.length - 1);

    for (var i = 1; i < this.controlPoints.length; ++i) {
        vec3.sub(vector, this.controlPoints[i], this.controlPoints[i - 1]);
        this.translations[i - 1] = vector;

        var projectionXZ = vec3.fromValues(vector[0], 0, vector[2]);

        var sign = projectionXZ[0] < 0 ? -1 : 1;

        this.rotations[i - 1] = sign * Math.acos(vec3.dot(projectionXZ, vec3.fromValues(0, 0, 1))/ vec3.length(projectionXZ));

        distance += vec3.length(vector);
    }

    var velocity = distance / this.span;

    this.controlPointsTime = new Array(this.controlPoints.length);
    this.controlPointsTime[0] = 0;

    this.controlPointsSpan = new Array(this.controlPoints.length - 1);

    for (var i = 1; i < this.controlPoints.length; ++i) {    
        this.controlPointsTime[i] = this.controlPointsTime[i - 1] +
                               vec3.length(this.translations[i-1]) / velocity;
        this.controlPointsSpan[i-1] = this.controlPointsTime[i] - this.controlPointsTime[i-1]; 
    }
}

LinearAnimation.prototype.calculateMatrix = function(t) {
    t = Math.min(Math.max(t, 0), this.span);
   
    var index;
    for (index = this.controlPointsTime.length - 1; index > 0; --index)
        if (this.controlPointsTime[index] <= t)
            break;
    
    var matrix = mat4.create();
    mat4.identity(matrix);

    var tScale = (t - this.controlPointsTime[index]) / this.controlPointsSpan[index];
    var position = vec3.clone(this.controlPoints[index]);
    var translation_amount = vec3.create();
    vec3.scale(translation_amount, this.translations[index], tScale);
    vec3.add(position, position, translation_amount); 

    mat4.rotateY(matrix,matrix,this.rotations[index]);
    mat4.translate(matrix, matrix, position);

    return matrix;
}



/*function LinearAnimation(scene, duration, controlPoints) {
    Animation.call(this, scene, duration);

    this.controlPoints = controlPoints;
	
    this.distancia_total = 0;
	this.duration = duration;
    this.vectors = [];

    for(var i in this.controlPoints) {
        var x = this.controlPoints[i+1].x - this.controlPoints[i].x;
        var y = this.controlPoints[i+1].y - this.controlPoints[i].y;
        var z = this.controlPoints[i+1].z - this.controlPoints[i].z;

        var vecLength =  Math.sqrt(x*x + y*y + z*z);

        this.vectors.push({'x': x, 'y': y, 'z': z, 'l': vecLength});

        this.distancia_total += vecLength;
    }

    this.velocidade = this.distancia_total / this.duration;
	
	var d = new Date();
	this.startTime = d.getTime();
    
	this.acabou = false;
	
	this.time = 0;
    this.vecAnimating = 0;
}


LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;


LinearAnimation.prototype.update = function (currentTime) {
	
	var TempoDecorrido = (currentTime - this.startTime)/1000.0;
	var DistanciaPercorrida = TempoDecorrido/this.duration * this.distancia_total;
	var DistanciaSegmento = 0;
	var i = 0;
	
	for(; i < this.vectors.length; i++){
		DistanciaSegmento+= this.vectors[i].l;
		if(DistanciaSegmento >= DistanciaPercorrida ){
			break;
		}
	}
	
	if(i == this.vectors.length){
			this.acabou = true;
	}
	
	var Comp_segmento_actual = this.vectors[i].l;
	var DistanciadoSegmentoPecorrido= DistanciaPercorrida - (DistanciaSegmento- Comp_segmento_actual);
	var percentagem_percorrida_segmento = DistanciadoSegmentoPecorrido / Comp_segmento_actual;
	
	var posi_actual_x = percentagem_percorrida_segmento*this.vectors[i].x + this.controlPoints[i].x;
	var posi_actual_y = percentagem_percorrida_segmento*this.vectors[i].y + this.controlPoints[i].y;
	var posi_actual_z = percentagem_percorrida_segmento*this.vectors[i].z + this.controlPoints[i].z;

};

LinearAnimation.prototype.init = function () {


};

LinearAnimation.prototype.calculateMatrix = function () { //time is in ms Maybe

    if(this.time >= this.duration){
        this.vecAnimating = 0;
        this.time = 0;
        return false;
    }

    if(this.time >= this.duration * this.vectors[this.vecAnimating].l / this.distance){
        this.vecAnimating++;
    }

    var matrix = mat4.create();
    mat4.identity(matrix);

    mat4.rotate(
        matrix,
        matrix,
        Math.acos(this.vectors[this.vecAnimating].x / this.distance),
        [0, 1, 0]
    );
    mat4.translate(
        matrix,
        matrix,
        [
            this.vectors[this.vecAnimating].x / this.time,
            this.vectors[this.vecAnimating].y / this.time,
            this.vectors[this.vecAnimating].z / this.time
        ]
    );

    this.time++;

    return matrix;
};*/
