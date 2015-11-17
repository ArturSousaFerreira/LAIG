function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
 
MySceneGraph.prototype.onXMLReady=function() {
	
	console.log("\nXML Loaded!");
	
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Calls for different functions to parse the various blocks
	
	var error = this.parseInitials(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
		
	var error = this.parseAnimations(rootElement);
		if (error != null) {
		this.onXMLError(error);
		return;
	}

	var error = this.parseIllumination(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseLights(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	
	var error = this.parseTextures(rootElement);
		if (error != null) {
		this.onXMLError(error);
		return;
	}

	var error = this.parseMaterials(rootElement);
		if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseLeaves(rootElement);
		if (error != null) {
		this.onXMLError(error);
		return;
	}	
	
	var error = this.parseNodes(rootElement);
		if (error != null) {
		this.onXMLError(error);
		return;
	}
	
	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


/*
 * Method that parses translate
 */

MySceneGraph.prototype.parseTranslate = function(element) {
	
    var arr = [];
    
	arr['x'] = this.reader.getFloat(element, 'x', true);
    arr['y'] = this.reader.getFloat(element, 'y', true);
    arr['z'] = this.reader.getFloat(element, 'z', true);
    
	for(var e in arr){
		if(arr.hasOwnProperty(e)){
			if(typeof(arr[e]) != "number")
				console.error('Error parsing ' + e + ' in parseTranslate');
        }
    }
    
	arr['type'] = 'translation';

    return arr;
};


/*
 * Method that parses rotation 
 */
 
MySceneGraph.prototype.parseRotation = function(element) {
  
	var arr = [];
    
	arr['axis'] = this.reader.getString(element, 'axis', true);
    
	if(arr['axis'] != 'x' && arr['axis'] != 'y' && arr['axis'] != 'z'){    
    console.error('Error parsing axis in parseRotation');
    }
    
	arr['angle'] = this.reader.getFloat(element, 'angle', true);
    
	if(typeof(arr['angle']) != "number"){
        console.error('Error parsing angle in parseRotation');
    }
    
	arr['type'] = 'rotation';
  
	return arr;
};


/*
 * Method that parses scale
 */
 
MySceneGraph.prototype.parseScale = function(element) {

    var arr = [];

    arr['sx'] = this.reader.getFloat(element, 'sx', true);
    arr['sy'] = this.reader.getFloat(element, 'sy', true);
    arr['sz'] = this.reader.getFloat(element, 'sz', true);
    
	for(var e in arr){
		if(arr.hasOwnProperty(e)){
			if(typeof(arr[e]) != "number")
                console.error('Error parsing ' + e + ' in parseScale');
        }
    }    
	
	arr['type'] = 'scale';
    
	return arr;
};


/*
 * Method that parses frustum element in INITIALS tag
 */
 
MySceneGraph.prototype.parseFrustum = function(element) {

    var arr = [];

    arr['near'] = this.reader.getFloat(element, 'near', true);
    arr['far'] = this.reader.getFloat(element, 'far', true);

    for(var e in arr){
        if(arr.hasOwnProperty(e)){
            if(typeof(arr[e]) != "number" || arr[e] < 0 )
                console.error('Error parsing ' + e + ' in parseFrustum');
        }
    }

    return arr;
};

/*
 * Method that parses elements of INITIALS tag and stores information in a data structure
 */
 
MySceneGraph.prototype.parseInitials= function(rootElement) {
	
	console.log("\nINITIALS:");

	this.initials={};
	
	var elems =  rootElement.getElementsByTagName('INITIALS');
	if(elems == null) return "Initials element is missing!";
	if(elems.length != 1) return "More than one 'initials' elements found. Expected only one!";
	
	var init = elems[0];
	
	//Frustum
	var elems =  rootElement.getElementsByTagName('frustum');
	if(elems == null) return "Frustum element is missing!";
	if(elems.length != 1) return "More than one 'frustum' elements found. Expected only one!";
	
	this.initials['frustum'] = this.parseFrustum(elems[0]);

	if(isNaN(this.initials.frustum["near"])) return "Invalid frustum near!";
	if(isNaN(this.initials.frustum["far"])) return "Invalid frustum far!";
	
	//Translate
	var elems =  rootElement.getElementsByTagName('translation');
	if(elems == null) return "translation element is missing!";
	if(elems.length != 1) return "More than one 'translation' elements found. Expected only one!";
	
	 this.initials['translation'] = this.parseTranslate(elems[0]);    
	
	if(this.initials.translation["x"] == undefined) return "Invalid translation x!";
	if(this.initials.translation["y"] == undefined) return "Invalid translation y!";
	if(this.initials.translation["z"] == undefined) return "Invalid translation z!";

	if(isNaN(this.initials.translation["x"])) return "Invalid translation x!";
	if(isNaN(this.initials.translation["y"])) return "Invalid translation y!";
	if(isNaN(this.initials.translation["z"])) return "Invalid translation z!";

	//Rotation
	var elems =  rootElement.getElementsByTagName('rotation');
	if(elems == null) return "rotation element is missing!";
	if(elems.length != 3) return "Wrong number of 'rotation' elements found. Expected exactly 3!";
	
	this.initials['rotate3'] = this.parseRotation(elems[0]);
    this.initials['rotate2'] = this.parseRotation(elems[1]);
    this.initials['rotate1'] = this.parseRotation(elems[2]);
	
	if(isNaN(this.initials['rotate3'].angle)) return "Invalid rotation value!";
	if(isNaN(this.initials['rotate2'].angle)) return "Invalid rotation value!";
	if(isNaN(this.initials['rotate1'].angle)) return "Invalid rotation value!";

	//Scale
	var elems =  rootElement.getElementsByTagName('scale');
	if(elems == null) return "scale element is missing!";
	if(elems.length != 1) return "More than one 'scale' elements found. Expected only one!";

	this.initials['scale'] = this.parseScale(elems[0]);
	
	if(isNaN(this.initials['scale'].sx)) return "Invalid scale value!";
	if(isNaN(this.initials['scale'].sy)) return "Invalid scale value!";
	if(isNaN(this.initials['scale'].sz)) return "Invalid scale value!";
	
	//Reference
	var elems =  rootElement.getElementsByTagName('reference');
	if(elems == null) return "reference element is missing!";
	if(elems.length != 1) return "More than one 'reference' elements found. Expected only one!";

	var reference = elems[0];

	this.initials.reference=this.reader.getFloat(reference,'length',true);

	if(isNaN(this.initials.reference)) return "ERROR! Value of reference invalid! Expected float, found a element different than a number!";
	
	console.log(this.initials);
};

/*
 * Method that parses elements of ANIMATIONS tag and stores information in a data structure
 */ 

MySceneGraph.prototype.parseAnimations= function(rootElement) {

	console.log("\nANIMATIONS:");
   
   	var elems = rootElement.getElementsByTagName('ANIMATIONS');
    
    if (elems == null)
    	return "Animation element is missing.";

	var animes = elems[0];
	
   	this.animations = {};

    var nAnimations = animes.children.length;
    for (var i = 0; i < nAnimations; i++) {
        var animation = animes.children[i];
        this.animations[animation.id] = this.parseAnimation(animation);
    }
	
	console.log(this.animations);
};

/*
 * Method that parses each animation
 */

MySceneGraph.prototype.parseAnimation = function(element) {

    var animation = {};
	
	animation['id'] = this.reader.getString(element, 'id');
    animation['span'] = this.reader.getFloat(element, 'span', true);
	animation['type'] = this.reader.getString(element, 'type', true);
	
	if(animation['type'] === 'circular') {
		
	animation['radius'] = this.reader.getFloat(element, 'radius', true);
		animation['startang'] = this.reader.getFloat(element, 'startang', true);
		animation['rotang'] = this.reader.getFloat(element, 'rotang', true);
		
		var coords = this.reader.getString(element,"center",true);
		var center= coords.trim().split(/\s+/);
		var centerPoints = [];
		
		centerPoints.push(vec3.fromValues(center[0], center[1], center[2]));
		
		animation["center"]	= centerPoints;
	}
	else if(animation['type'] === 'linear') {
		var control_points = element.getElementsByTagName("CONTROLPOINT");

		var ctrPoints = [];
		for(var j = 0 ; j < control_points.length ; j++) {
			var x = this.reader.getFloat(control_points[j], "xx", true);
			var y = this.reader.getFloat(control_points[j], "yy", true);
			var z = this.reader.getFloat(control_points[j], "zz", true);

			if(isNaN(x) || isNaN(y) || isNaN(z))
                return "Invalid number in tag CONTROLPOINT!";
			
			ctrPoints.push(vec3.fromValues(x,y,z));
		}
		
		animation['control_points'] = ctrPoints;
	} else
		return "Invalid type of animation!";

    return animation;
};

/*
 * Method that parses elements of ILLUMINATION tag and stores information in a data structure
 */
	
MySceneGraph.prototype.parseIllumination = function(rootElement) {
	
	console.log("\nILLUMINATION:");

	this.illu = {};
	
	var illuminations = rootElement.getElementsByTagName('ILLUMINATION');
	
	if(illuminations == null) return "Illumination element is missing!";
	if(illuminations.length != 1) return "More than one 'illumination' elements found. Expected only one!";

	var illuminationElems = illuminations[0];
	
	//ambient
	var ambients = illuminationElems.getElementsByTagName("ambient");
	
	if(ambients == null) return "Ambient values missing!";
	if(ambients.length != 1) return "More than one 'ambient' elements found. Expected only one!";

	var ambient = ambients[0];
	
	this.illu.ambient = {};
	this.illu.ambient["r"] = this.reader.getFloat(ambient, "r", true);
	this.illu.ambient["g"] = this.reader.getFloat(ambient, "g", true);
	this.illu.ambient["b"] = this.reader.getFloat(ambient, "b", true);
	this.illu.ambient["a"] = this.reader.getFloat(ambient, "a", true);

	//background
	var backgrounds = illuminationElems.getElementsByTagName("background");
	
	if(backgrounds == null) return "Backgrounds values missing!";
	if(backgrounds.length != 1) return "More than one 'backgrounds' element found. Expected only one!";

	var background = backgrounds[0];
	
	this.illu.background = {};
	this.illu.background["r"] = this.reader.getFloat(background, "r", true);
	this.illu.background["g"] = this.reader.getFloat(background, "g", true);
	this.illu.background["b"] = this.reader.getFloat(background, "b", true);
	this.illu.background["a"] = this.reader.getFloat(background, "a", true);

	console.log(this.illu);
}

/*
 * Method that parses elements of LIGHTS tag and stores information in a data structure
 */
 
MySceneGraph.prototype.parseLights = function(rootElement) {
		
	console.log("\nLIGHTS:");
	
	this.lights = {};
	
	var lights = rootElement.getElementsByTagName("LIGHTS");
	if(lights == null) return "light values missing";
	if(lights.length != 1) return "0 or more lights were found";

	var first_lights = lights[0];

	//LIGHT
	var light = first_lights.getElementsByTagName("LIGHT");
	if(light == null) return "light values missing";
	if(light.length < 1) return "0 light elements were found";

	
	for(var i=0; i<light.length; i++) {
		var currLight = {};
		var iterLight = light[i];

		//stores ids
		currLight["id"] = this.reader.getString(iterLight,"id",true);

		//enable/disable
		var enables = iterLight.getElementsByTagName("enable");
		var enable = enables[0];
		currLight["enable"] = this.reader.getBoolean(enable, "value", true);


		//light position
		var positions = iterLight.getElementsByTagName("position");
		var position = positions[0];
		currLight["position"] = {};
		currLight["position"]["x"] = this.reader.getFloat(position, "x", true);
		currLight["position"]["y"] = this.reader.getFloat(position, "y", true);
		currLight["position"]["z"] = this.reader.getFloat(position, "z", true);
		currLight["position"]["w"] = this.reader.getFloat(position, "w", true);

		//ambient component
		var ambients = iterLight.getElementsByTagName("ambient");
		var ambient = ambients[0];
		currLight["ambient"] = {};
		currLight["ambient"]["r"] = this.reader.getFloat(ambient, "r", true);
		currLight["ambient"]["g"] = this.reader.getFloat(ambient, "g", true);
		currLight["ambient"]["b"] = this.reader.getFloat(ambient, "b", true);
		currLight["ambient"]["a"] = this.reader.getFloat(ambient, "a", true);

		//diffuse component
		var diffuses = iterLight.getElementsByTagName("diffuse");
		var diffuse = diffuses[0];
		currLight["diffuse"] = {};
		currLight["diffuse"]["r"] = this.reader.getFloat(diffuse, "r", true);
		currLight["diffuse"]["g"] = this.reader.getFloat(diffuse, "g", true);
		currLight["diffuse"]["b"] = this.reader.getFloat(diffuse, "b", true);
		currLight["diffuse"]["a"] = this.reader.getFloat(diffuse, "a", true);

		//specular component
		var speculars = iterLight.getElementsByTagName("specular");
		var specular = speculars[0];
		currLight["specular"] = {};
		currLight["specular"]["r"] = this.reader.getFloat(specular, "r", true);
		currLight["specular"]["g"] = this.reader.getFloat(specular, "g", true);
		currLight["specular"]["b"] = this.reader.getFloat(specular, "b", true);
		currLight["specular"]["a"] = this.reader.getFloat(specular, "a", true);

		this.lights[currLight["id"]]=currLight;
	}
		console.log(this.lights);	
};

/*
 * Method that parses elements of TEXTURES tag and stores information in a data structure
 */
 
MySceneGraph.prototype.parseTextures = function(rootElement) {
	
	console.log("\nTEXTURES:");
	
	this.textures = {};
	
	var textures = rootElement.getElementsByTagName("TEXTURES");
	if(textures == null) return "Textures element missing!";
	if(textures.length != 1) return "More than one 'TEXTURES' element found. Expected only one!";

	var first_textures = textures[0];


	//Texture
	var texture = first_textures.getElementsByTagName("TEXTURE");
	if(texture == null) return "light values missing";
	if(texture.length < 1) return "0 light elements were found";

	for(var i=0; i<texture.length; i++) {
		var currText = {};
		var iterText = texture[i];

	//stores ids
	currText["id"] = this.reader.getString(iterText,"id",true);

	//path
	var path = iterText.getElementsByTagName("file");
	var file = path[0];
	currText["file"] = this.reader.getString(file,"path",true);

	//amplif_factor
	var amplif_factor = iterText.getElementsByTagName("amplif_factor");
	var factor = amplif_factor[0];
		
	currText["amplif_factor"]={};
	currText["amplif_factor"]['s']=this.reader.getFloat(factor,'s',true);
	currText["amplif_factor"]['t']=this.reader.getFloat(factor,'t',true);
	
	this.textures[currText["id"]]=currText;
	}

	console.log(this.textures);

};

/*
 * Method that parses elements of MATERIALS tag and stores information in a data structure
 */
 
MySceneGraph.prototype.parseMaterials = function(rootElement) {
	
	console.log("\nMATERIALS:");
	
	this.materials = {};	
	
	var materials = rootElement.getElementsByTagName("MATERIALS");
	if(materials == null) return "Materials element missing!";
	if(materials.length != 1) return "More than one 'MATERIALS' element found. Expected only one!";

	var first_materials = materials[0];

	//Material
	
	var material = first_materials.getElementsByTagName("MATERIAL");
	if(material == null) return "Material element missing!";
	if(material.length < 1) return "Zero 'Material' elements were found. Expected at least one!";

	for(var i=0; i<material.length; i++) {
		var currMaterial = {};
		var iterMaterial = material[i];

		//stores ids
		currMaterial["id"] = this.reader.getString(iterMaterial,"id",true);

		//Shininess

		var shininess = iterMaterial.getElementsByTagName("shininess");
		var valor = shininess[0];
		currMaterial["shininess"] = this.reader.getString(valor,"value",true);
		 
		 //Specular
		var speculars = iterMaterial.getElementsByTagName("specular");
		var specular = speculars[0];
		
		currMaterial["specular"]={};
		currMaterial["specular"]["r"] = this.reader.getFloat(specular, "r", true);
		currMaterial["specular"]["g"] = this.reader.getFloat(specular, "g", true);
		currMaterial["specular"]["b"] = this.reader.getFloat(specular, "b", true);
		currMaterial["specular"]["a"] = this.reader.getFloat(specular, "a", true);
		
		//diffuse
		var diffuses = iterMaterial.getElementsByTagName("diffuse");
		var diffuse = diffuses[0];
		currMaterial["diffuse"] = {};
		currMaterial["diffuse"]["r"] = this.reader.getFloat(diffuse, "r", true);
		currMaterial["diffuse"]["g"] = this.reader.getFloat(diffuse, "g", true);
		currMaterial["diffuse"]["b"] = this.reader.getFloat(diffuse, "b", true);
		currMaterial["diffuse"]["a"] = this.reader.getFloat(diffuse, "a", true);
		
		//ambient 
		var ambients = iterMaterial.getElementsByTagName("ambient");
		var ambient = ambients[0];
		currMaterial["ambient"] = {};
		currMaterial["ambient"]["r"] = this.reader.getFloat(ambient, "r", true);
		currMaterial["ambient"]["g"] = this.reader.getFloat(ambient, "g", true);
		currMaterial["ambient"]["b"] = this.reader.getFloat(ambient, "b", true);
		currMaterial["ambient"]["a"] = this.reader.getFloat(ambient, "a", true);
		
		//emission
		var emissions = iterMaterial.getElementsByTagName("emission");
		var emission = emissions[0];
		currMaterial["emission"] = {};
		currMaterial["emission"]["r"] = this.reader.getFloat(emission, "r", true);
		currMaterial["emission"]["g"] = this.reader.getFloat(emission, "g", true);
		currMaterial["emission"]["b"] = this.reader.getFloat(emission, "b", true);
		currMaterial["emission"]["a"] = this.reader.getFloat(emission, "a", true);

	
		this.materials[currMaterial["id"]]=currMaterial;
	}

	console.log(this.materials);
};


/*
 * Method that parses elements of LEAVES tag and stores information in a data structure
 */
 
MySceneGraph.prototype.parseLeaves = function(rootElement) {
		
	console.log("\nLEAVES:");
	
    var elems = rootElement.getElementsByTagName('LEAVES');
    if(elems == null)	return "Leaves element is missing!";
    if(elems.length != 1)	return "More than one 'LEAVES' element found. Expected only one!";
	var leaves_elements = elems[0];
	
    this.leaves = {};

    for (var i=0; i < leaves_elements.children.length; i++) {
        var leaf = leaves_elements.children[i];

        this.leaves[leaf.id] = this.parseLeaf(leaf);
    }
	
	console.log(this.leaves);	
};

/*
 * Method that parses each leaf
 */

MySceneGraph.prototype.parseLeaf = function(element) {
    
	var leaf = {};
    var tempArgs;
	
    leaf['type'] = this.reader.getString(element, 'type', true);

    if( leaf['type'] == "patch" ) {	// Parse patch leaf
		leaf['order'] = this.reader.getFloat(element, 'order', true);
		leaf['partsU'] = this.reader.getFloat(element, 'partsU', true);
		leaf['partsV'] = this.reader.getFloat(element, 'partsV', true);

		var control_points = element.getElementsByTagName("CONTROLPOINT");

		var ctrPoints = [];
		for(var i = 0 ; i < control_points.length ; i++) {
			var x = this.reader.getFloat(control_points[i], "x", true);
			var y = this.reader.getFloat(control_points[i], "y", true);
			var z = this.reader.getFloat(control_points[i], "z", true);
			var w = this.reader.getFloat(control_points[i], "w", true);

			if(isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w))
                return "Invalid number in control_points!";
			
			ctrPoints.push(vec4.fromValues(x,y,z,w));
		}
		
		leaf['control_points'] = ctrPoints;
	} 
    else if ( leaf['type'] == "plane" ) { // Parse plane leaf
    	leaf['parts'] = this.reader.getFloat(element, 'parts', true);
    }
    else if( leaf['type'] == "terrain" ) { // Parse terrain leaf
		leaf["texture"] = this.reader.getString(element, 'texture', true);
		leaf["heightmap"] = this.reader.getString(element, 'heightmap', true);             
	} else { // Parse all other leaves that have args as attribute
    	tempArgs = this.reader.getString(element, 'args', true);
    	leaf['args'] = tempArgs.split(' ');

    	for( var i = 0; i < leaf['args'].length; i++ ) {
			leaf['args'][i] = parseFloat(leaf['args'][i]);
		}
    }  
	
    return leaf;
};

/*
 * Method that parses elements of NODES tag and stores information in a data structure
 */
 
MySceneGraph.prototype.parseNodes= function(rootElement) {

    var elems = rootElement.getElementsByTagName('NODES')[0];
    if (elems == null)
    	return "NODES element is missing.";    

    var root_node = elems.getElementsByTagName('ROOT')[0];
    this.root_id = this.reader.getString(root_node, 'id');

    console.log("\nNODES:");

   	this.nodes = {};

    this.nodes['root'] = elems.children[0].id;
    var nModes = elems.children.length;
    for (var i = 1; i < nModes; i++) {
        var node = elems.children[i];
        this.nodes[node.id] = this.parseNode(node);
    }

	console.log(this.nodes);

};

/*
 * Method that parses each node
 */

MySceneGraph.prototype.parseNode = function(element) {

    var node = {};	
	
	node['id']= this.reader.getString(element, 'id', true);;
	
    node['material'] = this.reader.getString(element.children[0], 'id', true);
    node['texture'] = this.reader.getString(element.children[1], 'id', true);
			
	var j = 0;
	var k = 2;
	
	var tempAnimations = [];
	var existAnimation = element.getElementsByTagName('ANIMATIONREF');

	for( ; j < existAnimation.length ; j++)
	{
	tempAnimations[j] = existAnimation[j].id;
	k++;
	}

	if(tempAnimations.length > 0)
		node['animations'] = tempAnimations;
	
	node["matrix"] = mat4.create();
	mat4.identity(node["matrix"]);

    var transformations = [];
	
    for(var i = j+2; i < element.children.length; i++) {

		if(element.children[i].tagName === 'TRANSLATION') {
			var translation = this.parseTranslate(element.children[i]);
			mat4.translate(node["matrix"],node["matrix"],[translation["x"],translation["y"],translation["z"]]);
		}
		else if(element.children[i].tagName === 'ROTATION') {
			var rotation = this.parseRotation(element.children[i]);			
			var axis;

			if(rotation["axis"] == 'x')
				axis = [1,0,0];
			else if(rotation["axis"] == 'y')
				axis = [0,1,0];
			else if(rotation["axis"] == 'z')
				axis = [0,0,1];

			mat4.rotate(node["matrix"],node["matrix"],rotation["angle"]*Math.PI/180.0, axis);
		}	
		else if(element.children[i].tagName === 'SCALE'){
			var scale = this.parseScale(element.children[i])
			var scalem= [scale["sx"],scale["sy"],scale["sz"]];
			mat4.scale(node["matrix"],node["matrix"],scalem);
		} 
		else
			break;
	}

	node["timer"] =0;
	
	node['descendants'] = this.parseDescendants(element.children[i]);

    return node;
};

/*
 * Descendants Parser of node
 */ 
 
MySceneGraph.prototype.parseDescendants = function(element) {

    var descendants = [];
    for (var i = 0; i < element.children.length; i++) {
        descendants.push(this.reader.getString(element.children[i],'id', true));
    }

    return descendants;
};

/*
 * Callback to be executed on any read error
 */ 
 
MySceneGraph.prototype.onXMLError=function (message) {
	
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;

};






