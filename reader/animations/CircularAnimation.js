function CircularAnimation(scene, span, center, startang, rotang, radius) {
   
    this.span = span; // tempo total da animação
    this.center = center; // centro a partir do qual o objecto roda
    this.startang = startang*(Math.PI/180.0); // angulo inicial do objecto
    this.rotang = rotang*(Math.PI/180.0); // angulo de rotaça do objecto
    this.radius = radius; // raio/distancia do objecto ao centro

   	Animation.call(this, this.span, "circular");

   	this.init();
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function() {
	
	this.finish = false;
	
	this.transform_matrix = mat4.create();// cria matriz transformação inicial
	mat4.identity(this.transform_matrix);

	mat4.rotateY(this.transform_matrix, this.transform_matrix, this.startang); // mete na matrix inicial a rotaçao do angulo inicial em torno do eixo y
	mat4.translate(this.transform_matrix, this.transform_matrix, vec3.fromValues(0, 0, this.radius)); // mete na matriz inicial a translação em z do valor do raio

	var noventa;
	if(this.rotang > 0){
		noventa = Math.PI/2;
	}else{
		noventa = -Math.PI/2;
	}
	
	mat4.rotateY(this.transform_matrix, this.transform_matrix, noventa); // mete na matriz uma rotação de 90 ou -90 graus

}

CircularAnimation.prototype.calculateMatrix = function(t) {
	
	this.current_time = Math.min(t, this.span);
	
	if( this.current_time == this.span ) {
		this.finish = true;
		return;
	}

	this.matrix = mat4.create();
	mat4.identity(this.matrix);

	mat4.translate(this.matrix, this.matrix, this.center[0]); // mete na matriz do objecto a translação do centro

	var rot = this.rotang*(this.current_time/this.span);
	mat4.rotateY(this.matrix, this.matrix, rot); // mete na matriz do objecto a rotação do angulo proporcional ao tempo decorrido

	mat4.multiply(this.matrix, this.matrix, this.transform_matrix); // aplica a matrix das transformações actuais, com a das transformaçoes iniciais
}