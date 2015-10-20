function MySphere(scene, radius, rings, sections) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.sections = sections;
    this.rings = rings;

    this.initBuffers();
}

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function () {
    var alpha = (2 * Math.PI) / this.sections;
    var beta = (2 * Math.PI) / this.rings;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (var i = 0; i < this.rings + 1; i++) {
        for (var j = 0; j < this.sections + 1; j++) {
            this.vertices.push(this.radius * Math.cos(alpha * i) * Math.sin(beta * j), this.radius * Math.sin(alpha * i) * Math.sin(beta * j), this.radius * Math.cos(beta * j));
            this.texCoords.push(i / this.sections, 2 * j / this.rings);
        }
    }

    this.normals = this.vertices.slice(0);

    var nVertices = this.vertices.length / 3;
    for (var i = 0; i < this.sections; i++) {
        for (j = 0; j < this.rings; j++) {
            this.indices.push(j + (this.sections + 1) * i, j + (this.sections + 1) * i + 1, j + (this.sections + 1) * i + this.sections + 2);
            this.indices.push(
                (j + (this.sections + 1) * i + this.sections + 3) % nVertices,
                (j + (this.sections + 1) * i + this.sections + 2) % nVertices,
                (j + (this.sections + 1) * i + 1) % nVertices
            );
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
