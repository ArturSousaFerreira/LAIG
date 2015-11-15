function MyPatch(scene, order, partsU, partsV, controlpoints){
	//CGFobject.call(this, scene);
	
    this.order = order;	// order = degree
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlpoints = controlpoints;
		
	// Get the knots vetor for the specific order
    if( this.order == 1 )
    	this.knots = [0, 0, 1, 1];
  	if( this.order == 2 )
  		this.knots = [0, 0, 0, 1, 1, 1];
    if( this.order == 3 )
  		this.knots = [0, 0, 0, 0, 1, 1, 1, 1];
	
    this.controlvertexes = this.getControlVertexes(this.controlpoints);


	var nurbsSurface = new CGFnurbsSurface(this.order, this.order, this.knots, this.knots, this.controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};
	
	CGFnurbsObject.call(scene, getSurfacePoint, this.partsU, this.partsV);

	this.iniBuffers();
    //this.makeSurface(this.order, [0, 0, 0, 0, 1, 1, 1, 1], this.controlvertexes, this.partsU, this.partsV);
}

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch;

// Function from the NURBS example from Moodle
MyPatch.prototype.makeSurface = function (degree, knots, controlvertexes, partsU, partsV) {
	
}

MyAnnulus.prototype.initBuffers = function() {	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

MyPatch.prototype.getControlVertexes = function(ctrlPts) {
	// Fill the controlpoints with a 1 at the end
	var newControlPoints = [];
	for( var i = 0; i < this.controlpoints.length; i++ ) {
		var temp_array = [];
		for( var j = 0; j < this.controlpoints[i].length; j++ ) {
			temp_array.push(this.controlpoints[i][j]);
		}
		temp_array.push(1);
		newControlPoints.push(temp_array);
	}

	// Get the controlvertexes from the controlpoints given
	var ctrlVertexes = [];
	var count = 0;
	for( var orderU = 0; orderU <= this.order; orderU++ ) {
		var array_temp = [];
		for( var orderV = 0; orderV <= this.order; orderV++ ) {
			array_temp.push(newControlPoints[count]);			
			count++;
		}
		ctrlVertexes.push(array_temp);
	}

	return ctrlVertexes;
}