function terrain(scene, texture, heightmap) {
    CGFobject.call(this,scene);
    
    this.texture = texture;
    this.heightmap = heightmap;

    this.materialTerrain = new CGFappearance(scene);
    this.materialTerrain.setAmbient(0.5,0.5,0.5,1);
    this.materialTerrain.setDiffuse(0.5,0.5,0.5,1);
    this.materialTerrain.setSpecular(0.5,0.5,0.5,1);
    this.materialTerrain.setShininess(1);
    this.textureTerrain = new CGFtexture(scene, this.texture);
    this.heightmapTerrain = new CGFtexture(scene, this.heightmap);
    this.materialTerrain.setTexture(this.textureTerrain);

    this.myShader = new CGFshader(scene.gl, "scenes/shaders/myShader.vert", "scenes/shaders/myShader.frag");
    this.myShader.setUniformsValues({uSampler2: 1});
    this.myShader.setUniformsValues({scale: 0.5});
    
    this.plane = new plane(scene, 200);
 }
 
terrain.prototype = Object.create(CGFobject.prototype);
terrain.prototype.constructor = terrain;
 
terrain.prototype.display = function() {
    this.materialTerrain.apply();
    this.scene.setActiveShader(this.myShader);

    this.scene.pushMatrix();
    
    this.heightmapTerrain.bind(1);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);

    this.scene.popMatrix();
};