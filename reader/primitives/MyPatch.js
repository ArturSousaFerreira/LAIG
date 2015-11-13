MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.makeSurface = function (id, degree1, degree2, knots1, knots2, controlvertexes) {
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};
	
	this.obj = new CGFnurbsObject(this.scene, getSurfacePoint,this.divs,this.divs);
	
	this.scene.surfaces.push(this.obj);
}


MyPatch.prototype.display = function() {
	this.obj.dsiplay();
}