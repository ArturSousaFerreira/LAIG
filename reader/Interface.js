function Interface() {
    CGFinterface.call(this);
};


Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {

    CGFinterface.prototype.init.call(this, application);
    application.interface = this;
    
	this.gui = new dat.GUI();

    return true;
};


Interface.prototype.setScene = function(scene) {
    this.scene = scene;
    scene.interface = this;
};

Interface.prototype.create_interface = function() {
    
	var lights_group = this.gui.addFolder("Lights");
    lights_group.open();

    var inter = this;

    for (enable_element in this.scene.lights_enable) {
        lights_group.add(this.scene.lights_enable, enable_element).onChange(function(value) {
            inter.scene.Toggle_Light(this.property, value);
        });
    }
};