function PieceAnimation(scene, time, piece_selected, tileTo){

	this.scene = scene;
	this.time = time;
	this.piece_selected = piece_selected;

    this.x_initial = this.piece_selected.tile.x;
    this.z_initial = this.piece_selected.tile.z;
    this.x_final = tileTo.x;
    this.z_final = tileTo.z;

    this.startTime = -1;
    this.matrix = mat4.create();

    this.init();
};

PieceAnimation.prototype.constructor = PieceAnimation;

PieceAnimation.prototype.init = function() {
	
	this.distance = 0;
    this.distanciapercorrida = 0;
	this.translations = [1];	
   
    var vector = vec3.create();
    vec3.sub(vector, [this.x_final,0.2,this.z_final], [this.x_initial,0.2,this.z_initial]);
    this.translations[1] = vector;

    var projectionXZ = vec3.fromValues(vector[0], 0, vector[2]);

    if( vec3.length(projectionXZ) > 0 ) {
        var sign;
        if( projectionXZ[0] < 0 )
            sign = -1;
        else if( projectionXZ[0] >= 0 )
            sign = 1;
    }

    this.distance += vec3.length(vector);

	this.start = false;
	this.finish = false;
	
}

PieceAnimation.prototype.calculateMatrix = function(t) {

    if ( this.startTime < 0 ) {
        this.startTime = t;
    }


    this.matrix = mat4.create();
    mat4.identity(this.matrix);
	
    time = Math.min(t - this.startTime, this.time);

   	if(time >= this.time){
  
   		this.finish = true;
		this.start = false;
		//return;
   		
	
   	}

   
 
 	var tScale = time / this.time;
    var position = vec3.clone([0,0,0]);
    var translation_amount = vec3.create();
    vec3.scale(translation_amount, [this.x_final-this.x_initial,0,this.z_final-this.z_initial], tScale);
    vec3.add(position, position, translation_amount);
	
    mat4.translate(this.matrix, this.matrix, position);
   

}
