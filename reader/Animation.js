function Animation(scene) {
    this.scene = scene;

    //this.initBuffers();
}
Animation.prototype.constructor = Animation;
Animation.prototype.init = function () {

};

Animation.prototype.update = function () {

};

Animation.prototype.calculateMatrix = function() {
    var matrix = mat4.create();
    mat4.identity(matrix);

    return matrix;
}
