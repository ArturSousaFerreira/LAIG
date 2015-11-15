function MyPlane(scene, parts) {
    this.parts = parts;

    this.initBuffers();
}

MyPlane.prototype = Object.create(MyPatch.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.initBuffers = function() {
	MyPatch.call(this.scene, 1, // degree on U: 2 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 0, 1, 1], // knots for U
					[0, 0, 1, 1], // knots for V
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
					],
					this.divs); // translation of surface );

}