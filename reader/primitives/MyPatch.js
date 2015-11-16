function MyPatch(scene, order, partsU, partsV, controlpoints) {
    this.scene = scene;
    this.order = order;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlpoints = controlpoints;
    this.controlvertexes = this.getControlVertexes(this.controlpoints);
    
    // get the knots depending on the order value
    if( this.order == 1 )
        this.knots = [0, 0, 1, 1];
    else if( this.order == 2 )
        this.knots = [0, 0, 0, 1, 1, 1];
    else if( this.order == 3 )
        this.knots = [0, 0, 0, 0, 1, 1, 1, 1];
    
    this.makeSurface(this.order, this.order, this.knots, this.knots, this.controlvertexes);
}
 
MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch; 

// Method that calls a nurbsObject given the parameters that are in the LSX file
MyPatch.prototype.makeSurface = function(degree1, degree2, knots1, knots2, controlvertexes) {
    var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	CGFnurbsObject.call(this, this.scene, getSurfacePoint, this.partsU, this.partsV);
}

// Method to get
MyPatch.prototype.getControlVertexes = function(ctrlPts) {
   
    var controlvertexes = [];
    var count = 0;

    for( var i = 0; i <= this.order; i++ ) {
        var temp_array = [];
        for( var j = 0; j <= this.order; j++ ) {
            temp_array.push(ctrlPts[count]);
            count++;
        }
        controlvertexes.push(temp_array);
    }

    return controlvertexes;
};

