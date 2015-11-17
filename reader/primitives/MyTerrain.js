function MyTerrain(scene, texture, heightmap) {
    
    this.scene = scene;
    CGFobject.call(this, this.scene);

    this.texture = texture;
    this.heightmap = heightmap;

    this.materialTerrain = new CGFappearance(this.scene);
    this.materialTerrain.setAmbient(0.5,0.5,0.5,1);
    this.materialTerrain.setDiffuse(0.5,0.5,0.5,1);
    this.materialTerrain.setSpecular(0.5,0.5,0.5,1);
    this.materialTerrain.setShininess(1);
    this.textureTerrain = new CGFtexture(this.scene, this.texture);
    this.heightmapTerrain = new CGFtexture(this.scene, this.heightmap);
    this.materialTerrain.setTexture(this.textureTerrain);

    this.myShader = new CGFshader(this.scene.gl, "scenes/shaders/myShader.vert", "scenes/shaders/myShader.frag");
    this.myShader.setUniformsValues({uSampler2: 1});
    this.myShader.setUniformsValues({scale: 0.5});
    
    this.plane = new MyPlane(this.scene, 200);
 }
 
MyTerrain.prototype = Object.create(CGFobject.prototype);
MyTerrain.prototype.constructor = MyTerrain;
 
MyTerrain.prototype.display = function() {
    this.materialTerrain.apply();
    this.scene.setActiveShader(this.myShader);

    this.scene.pushMatrix();
    
    this.heightmapTerrain.bind(1);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);

    this.scene.popMatrix();
};