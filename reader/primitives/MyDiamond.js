function MyDiamond(scene, x, y) {
    CGFobject.call(this,scene);

    this.largura = x;
    this.altura = y;

    this.initBuffers();
}

MyDiamond.prototype = Object.create(CGFobject.prototype);

MyDiamond.prototype.constructor = MyDiamond;

MyDiamond.prototype.initBuffers = function() {

    this.vertices = [
        0, 0, 0,
        this.largura/2, this.altura/2, 0,
        this.largura, 0, 0,
        this.largura/2, -this.altura/2, 0
    ];

    this.indices = [
    	2,1,0,
    	3, 2, 0
    ];

    this.normals = [
		0,0,1,
		0,0,1,
		0,0,1,
		0,0,1
    ];

    this.texCoords = [
		0, 0.5,
		0.5, 0,
		1, 0.5,
		0.5, 1
	];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}