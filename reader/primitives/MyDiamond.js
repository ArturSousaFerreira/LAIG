function MyDiamond(scene, length, width) {
    CGFobject.call(this,scene);

    this.length = length;
    this.width = width;

    this.initBuffers();
}

MyDiamond.prototype = Object.create(CGFobject.prototype);

MyDiamond.prototype.constructor = MyDiamond;

MyDiamond.prototype.initBuffers = function() {

    this.vertices = [
        0, this.length/2, 0,
        this.width/2, this.length, 0,
        this.width, this.length/2, 0,
        this.width/2, 0, 0
    ];

    this.indices = [
    	0, 1, 2,
    	0, 2, 3
    ];

    this.normals = [
		0,0,1,
		0,0,1,
		0,0,1,
		0,0,1
    ];

    this.texCoords = [
		1, 0,
		0, 0,
		0, 1,
		1, 1
	];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}