function MyDiamond(scene, lenght, width) {
    CGFobject.call(this.scene);

    this.length = length;
    this.width = width;

    this.initBuffers();
}

MyDiamond.prototype = Object.create(CGFobject.prototype);

MyDiamond.prototype.constructor = MyDiamond;

MyDiamond.prototype.initBuffers() = function() {

    this.vertices = [
        this.width/2, this.lenght, 0
        this.];
}