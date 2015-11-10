function Plane(scene, parts) {
    CGFobject.call(this, scene);

    this.parts = parts;

   	this.surfaces = [];
   	this.translations = [];

   	this.initBuffers();
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.initBuffers = function() {		

	this.makeSurface("0", 1, // degree on U: 2 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 0, 1, 1], // knots for U
					[0, 0, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..1;
							 [-2.0, -2.0, 0.0, 1 ],
							 [-2.0,  2.0, 0.0, 1 ]
							
						],
						// U = 1
						[ // V = 0..1
							 [ 2.0, -2.0, 0.0, 1 ],
							 [ 2.0,  2.0, 0.0, 1 ]							 
						]
					], // translation of surface 
					[-7.5,0,0]);

	/*this.makeSurface("1", 2, // degree on U: 3 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 0, 0, 1, 1, 1], // knots for U
					[0, 0, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..1;
							 [ -1.5, -1.5, 0.0, 1 ],
							 [ -1.5,  1.5, 0.0, 1 ]
							
						],
						// U = 1
						[ // V = 0..1
							 [ 0, -1.5, 3.0, 1 ],
							 [ 0,  1.5, 3.0, 1 ]							 
						],
						// U = 2
						[ // V = 0..1							 
							[ 1.5, -1.5, 0.0, 1 ],
							[ 1.5,  1.5, 0.0, 1 ]
						]
					], // translation of surface 
					[-2.5,0,0]);

	this.makeSurface("2", 2, // degree on U: 3 control vertexes U
					 3, // degree on V: 4 control vertexes on V
					[0, 0, 0, 1, 1, 1], // knots for U
					[0, 0, 0, 0, 1, 1, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..3;
							 [ -1.5, -1.5, 0.0, 1 ],
							 [ -2.0, -2.0, 2.0, 1 ],
							 [ -2.0,  2.0, 2.0, 1 ],
							 [ -1.5,  1.5, 0.0, 1 ]
							
						],
						// U = 1
						[ // V = 0..3
							 [ 0, 0, 3.0, 1 ],
							 [ 0, -2.0, 3.0, 5 ],
							 [ 0,  2.0, 3.0, 5 ],
							 [ 0,  0, 3.0, 1 ]							 
						],
						// U = 2
						[ // V = 0..3							 
							 [ 1.5, -1.5, 0.0, 1 ],
							 [ 2.0, -2.0, 2.0, 1 ],
							 [ 2.0,  2.0, 2.0, 1 ],
							 [ 1.5,  1.5, 0.0, 1 ]
						]
					], // translation of surface 
					[2.5,0,0]);

	this.makeSurface("3", 2, // degree on U: 3 control vertexes U
					3, // degree on V: 4 control vertexes on V
					[0, 0, 0, 1, 1, 1], // knots for U
					[0, 0, 0, 0, 1, 1, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..3;
							 [ -2.0, -2.0, 1.0, 1 ],
							 [ -2.0, -1.0, -2.0, 1 ],
							 [ -2.0, 1.0, 5.0, 1 ],
							 [ -2.0, 2.0, -1.0, 1 ]
						],
						// U = 1
						[ // V = 0..3
							 [ 0, -2.0, 0, 1 ],
							 [ 0, -1.0, -1.0, 5 ],
							 [ 0, 1.0, 1.5, 5 ],
							 [ 0, 2.0, 0, 1 ]
						],
						// U = 2
						[ // V = 0..3
							 [ 2.0, -2.0, -1.0, 1 ],
							 [ 2.0, -1.0, 2.0, 1 ],
							 [ 2.0, 1.0, -5.0, 1 ],
							 [ 2.0, 2.0, 1.0, 1 ]
						]
					], // translation of surface 
					[7.5,0,0]);*/
	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Plane.prototype.makeSurface = function (id, degree1, degree2, knots1, knots2, controlvertexes, translation) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this, getSurfacePoint, 20, 20);
	this.surfaces.push(obj);	
	this.translations.push(translation);

}

Plane.prototype.display = function () {

	for (i = 0; i < this.surfaces.length; i++) {
		this.pushMatrix();
	
		this.translate(this.translations[i][0], this.translations[i][1], this.translations[i][2]);

		this.surfaces[i].display();
		this.popMatrix();
	}
}
