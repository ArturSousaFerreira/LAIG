function MyPlane(scene, parts) {
    this.parts = parts;

	var nurbsSurface = new CGFnurbsSurface(1, 1, [0, 0, 1, 1], [0, 0, 1, 1], 
						[	// U = 0
						[ // V = 0..1;
							[-0.5, 0.0,  0.5, 1 ],
							[-0.5, 0.0, -0.5, 1 ]
						],
						// U = 1
						[ // V = 0..1
							[ 0.5, 0.0,  0.5, 1 ],
							[ 0.5, 0.0, -0.5, 1 ]
						]
					]);

	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	CGFnurbsObject.call(this, scene, getSurfacePoint, this.parts, this.parts);


    /*this.makeSurface(1, // degree on U: 2 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					 [0, 0, 1, 1], // knots for U
					 [0, 0, 1, 1], // knots for V
					 [ // U = 0
					 	[ // V = 0..1;
					 		[-0.5, -0.5, 0.0, 1 ],
					 		[-0.5,  0.5, 0.0, 1 ]
					 	],
					 	// U = 1
					 	[ // V = 0..1
					 		[ 0.5, -0.5, 0.0, 1 ],
					 		[ 0.5,  0.5, 0.0, 1 ]                                                   
					 	]
					 ]);*/
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	
}