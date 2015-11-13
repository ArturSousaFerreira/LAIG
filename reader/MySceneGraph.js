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
 
MySceneGraph.prototype.onXMLReady=function() 
{
	
	console.log("XML Loaded!");
	
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Calls for different functions to parse the various blocks
	
	var error = this.parseInitials(rootElement);
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

	var error = this.parseAnimations(rootElement);
		if (error != null) {
		this.onXMLError(error);
		return;
	}

	var error = this.parsePatches(rootElement);
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
 * Method that parses frustum element
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
 * Method that parses elements of Initials block and stores information in a specific data structure
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
 * Method that parses elements of Illumination block and stores information in a specific data structure
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
 * Method that parses elements of Lights block and stores information in a specific data structure
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
 * Method that parses elements of Textures block and stores information in a specific data structure
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
 * Method that parses elements of Materials block and stores information in a specific data structure
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
 * Method that parses elements of Materials block and stores information in a specific data structure
 */
 
MySceneGraph.prototype.parseLeaves = function(rootElement) {
		
	console.log("\nLEAVES:");
	
    var elems = rootElement.getElementsByTagName('LEAVES');
    if(elems == null)	return "Leaves element is missing!";
    if(elems.length != 1)	return "More than one 'LEAVES' element found. Expected only one!";
	var leaves_elements = elems[0];
	
    this.leaves = {};

    for (var i=0; i < leaves_elements.children.length; i++)
    {
        var leaf = leaves_elements.children[i];

        this.leaves[leaf.id] = this.parseLeaf(leaf);
    }
	
	console.log(this.leaves);
	
};

MySceneGraph.prototype.parseLeaf = function(element) {
    
	var leaf = {};
    var tempArgs;

    leaf['type'] = this.reader.getString(element, 'type', true);
    tempArgs = this.reader.getString(element, 'args', true);
    leaf['args'] = tempArgs.split(' ');
	
    for(var i = 0; i < leaf['args'].length; i++){
    leaf['args'][i] = parseFloat(leaf['args'][i]);
    }
	
    return leaf;
};


/*
 * Method that parses nodes elements of Materials block and stores information in a specific data structure
 */
 
MySceneGraph.prototype.parseNodes= function(rootElement) {

    var elems = rootElement.getElementsByTagName('NODES')[0];
    if (elems == null) return "NODES element is missing.";    

    var root_node = elems.getElementsByTagName('ROOT')[0];
    this.root_id = this.reader.getString(root_node, 'id');

    console.log("\nNODES: ");

   	this.nodes = {};

    this.nodes['root'] = elems.children[0].id;
    var nModes = elems.children.length;
    for (var i = 1; i < nModes; i++)
    {
        var node = elems.children[i];
        this.nodes[node.id] = this.parseNode(node);
    }

	console.log(this.nodes);

};


/*
 * Method that parses node
 */

MySceneGraph.prototype.parseNode = function(element) {

    var node = {};
	
	
	node['id']= this.reader.getString(element, 'id', true);;
	
    node['material'] = this.reader.getString(element.children[0], 'id', true);
    node['texture'] = this.reader.getString(element.children[1], 'id', true);
		
	var animations = element.getElementsByTagName('ANIMATIONREF');
	
	var j=0;
	var k = 2;
	if(animations.length != 0){
		node['animationref'] = this.reader.getString(element.children[k], 'id', true);
		j++;
		k++;
		
	}
	
	
	/*for(; j < animations.length; j++){
		
		node['animations'][j]=this.reader.getString(animations[j], 'id', true);
		
	}
	console.log("pilas");
	*/
	
	node["matrix"] = mat4.create();
	mat4.identity(node["matrix"]);

    var transformations = [];
	
	
    for(var i = j+2; i < element.children.length; i++){

		if(element.children[i].tagName === 'TRANSLATION'){
			var translation = this.parseTranslate(element.children[i]);
			mat4.translate(node["matrix"],node["matrix"],[translation["x"],translation["y"],translation["z"]]);
		}
		else if(element.children[i].tagName === 'ROTATION'){
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
 * Animations Parser
 */ 
 

MySceneGraph.prototype.parseAnimations= function(rootElement) {

	console.log("\nAnimations");
   
   var elems = rootElement.getElementsByTagName('ANIMATIONS');
    if (elems == null) return "Animation element is missing."; 
	var animes = elems[0];
	
   	this.animations = {};

    var nAnimations = animes.children.length;
    for (var i = 0; i < nAnimations; i++)
    {
        var animation = animes.children[i];
        this.animations[animation.id] = this.parseAnimation(animation);
    }

	console.log(this.animations);
};

/*
 * Method that parses animation
 */
 /*
 MySceneGraph.prototype.parseAnimation = function(animation) {
	var id = this.reader.getString(animation, "id");
	if (id in this.animations)
		return "Animation id already in animation: " + id;

	var span = this.reader.getFloat(animation, "span");
	var type = this.reader.getString(animation, "type");

	if(type == "circular") {
		var center = this.reader.getCenter(animation, "center");
		var radius = this.reader.getFloat(animation, "radius");
		var startang = this.reader.getFloat(animation, "startang");
		var rotang = this.reader.getFloat(animation, "rotang");
		
		
		this.animations[id] = new CircularAnimation(id, span, vec3.fromValues(center[0], center[1], center[2]), startang * Math.PI / 180, rotang * Math.PI / 180, radius);
	}
	else if(type == "linear"){
		var controlPoints = [];
		for (var i = 0; i < animation.children.length; ++i) {
			var controlpoint = animation.children[i];
			var x = this.reader.getFloat(controlpoint, "xx");
			var y = this.reader.getFloat(controlpoint, "yy");
			var z = this.reader.getFloat(controlpoint, "zz");
			controlPoints.push(vec3.fromValues(x,y,z));
		}
		this.animations[id] = new LinearAnimation(id, span, controlPoints);
	}
	else return "Unknown animation type: " + type;
}*/


MySceneGraph.prototype.parseAnimation = function(element) {

    var animation = {};
	
	animation['id'] = this.reader.getString(element, 'id');
    animation['span'] = this.reader.getFloat(element, 'span', true);
	animation['type'] = this.reader.getString(element, 'type', true);
	
	if(animation['type'] === 'circular'){
		
		animation['radius'] = this.reader.getFloat(element, 'radius', true);
		animation['startang'] = this.reader.getFloat(element, 'startang', true);
		animation['rotang'] = this.reader.getFloat(element, 'rotang', true);
	
				var coords = this.reader.getString(element,"center",true);
				animation["center"]	= coords.trim().split(/\s+/);
				
				for(var j = 0 ; j < animation['center'].length ; j++){
        		animation['center'][j] = parseFloat(animation['center'][j]);
				}
	
	} else if(animation['type'] === 'linear') {
		var control_points = element.getElementsByTagName("CONTROLPOINT");

		var ctrPoints = [];
		for(var j = 0 ; j < control_points.length ; j++) {
				var x = this.reader.getFloat(control_points[j], "xx", true);
				var y = this.reader.getFloat(control_points[j], "yy", true);
				var z = this.reader.getFloat(control_points[j], "zz", true);

				if(isNaN(x) || isNaN(y) || isNaN(z))
	                return " invalid number in control_points!";
				
			ctrPoints.push(vec3.fromValues(x,y,z));
			}
			animation['control_points']=ctrPoints;

		
	} else
		return "invalid type of animation!";

    return animation;
};


/*
 * Method to parse Patches
 */ 


MySceneGraph.prototype.parsePatches = function(rootElement) {
	
	console.log("\nPatches: ");
	
	var elems = rootElement.getElementsByTagName('PATCHES');
	if (elems == null) return "<PATCHES> element is missing.";
	if (elems.length != 1) return "More than one <PATCHES> element found.";

	var nnodes=elems[0].getElementsByTagName('PATCH');
	if (nnodes == null || nnodes.length == 0) return "0 <PATCH> elements found";
	this.patchList = [];

	for (var i=0; i<nnodes.length; i++) {
		var patch = nnodes[i];
		var currentPatch = [];

		currentPatch["id"] = this.reader.getString(patch,"id",true);
		if(this.patchList[currentPatch["id"]] != null) return "Repeated <PATCH> id's.";

		//DEGREE_U

		var tempDegreeU = patch.getElementsByTagName("DEGREE_U");
		if(tempDegreeU == null) return "<DEGREE_U> element is missing";
		if(tempDegreeU.length != 1) return "<More than one <DEGREE_U> element found";
		
		var degreeU = tempDegreeU[0];
		currentPatch["degree_u"] = this.reader.getFloat(degreeU, "value", true);

		//DEGREE_V

		var tempDegreeV = patch.getElementsByTagName("DEGREE_V");
		if(tempDegreeV == null) return "<DEGREE_V> element is missing";
		if(tempDegreeV.length != 1) return "<More than one <DEGREE_V> element found";
		
		var degreeV = tempDegreeV[0];
		currentPatch["degree_v"] = this.reader.getFloat(degreeV, "value", true);
		
		//KNOTS1
		currentPatch["knots1"] = [];
		var tempKnots1 = patch.getElementsByTagName("KNOTS1");

		if(tempKnots1 == null) return "<KNOTS1> element is missing";
		if(tempKnots1.length != 1) return "<More than one <KNOTS1> element found";
		
		var knots1 = tempKnots1[0];
		var tempKnots1args =  this.reader.getString(knots1,"args",true);


		var argsKnots1 = tempKnots1args.split(" ");
		if(argsKnots1.length != (currentPatch["degree_u"] *2 +2)) return "Invalid number of args for <KNOTS1> found";
		else {
			for(var j=0; j<argsKnots1.length; j++){
				currentPatch["knots1"].push(argsKnots1[j]);
			}
		}

		//KNOTS2
		currentPatch["knots2"] = [];
		var tempKnots2 = patch.getElementsByTagName("KNOTS2");
		if(tempKnots2 == null) return "<KNOTS2> element is missing";
		if(tempKnots2.length != 1) return "<More than one <KNOTS2> element found";
		
		var knots2 = tempKnots2[0];
		var tempKnots2args =  this.reader.getString(knots2,"args",true);
		var argsKnots2 = tempKnots2args.split(" ");
		if(argsKnots2.length != (currentPatch["degree_v"] *2 +2)) return "Invalid number of args for <KNOTS2> found";
		else {
			for(var j=0; j<argsKnots2.length; j++){
				currentPatch["knots2"].push(argsKnots2[j]);
			}
		}

		//CONTROL VERTEXES

		currentPatch["c_vertexes"] = [];

		var tempKnots = patch.getElementsByTagName("C_VERTEXES");
		if(tempKnots == null) return "<C_VERTEXES> element is missing";
		if(tempKnots.length != currentPatch["degree_u"] + 1) return "<Invalid number of <C_VERTEXES> elements found for U degree";
	
		for(var j=0; j<tempKnots.length; j++){

			var currentKnots = tempKnots[j];
			var tempKnot = currentKnots.getElementsByTagName("C_VERTEX");

			if(tempKnot.length != (currentPatch["degree_v"]+1 )) return "Invalid number of <C_VERTEX> elements found for V degree";

			else {
				currentPatch["c_vertexes"][j] = [];
				for(var k=0; k<tempKnot.length;k++){
					var currentKnot = tempKnot[k];
					currentPatch["c_vertexes"][j][k] = [];
					
					var args = this.reader.getString(currentKnot,"values",true);
					var argsCVertex = args.split(" ");

					if(argsCVertex.length != 4) return "Invalid number of values for a <C_VERTEX>";
					for(var l=0; l<argsCVertex.length; l++) currentPatch["c_vertexes"][j][k].push(argsCVertex[l]); 
				}
			}

		}

		var tempDivs = patch.getElementsByTagName("DIVS");
		if(tempDivs == null) return "<C_VERTEXES> element is missing";
		if(tempDivs.length != 1) return "<Invalid number of <DIVS> elements found";

		var div = tempDivs[0];
		currentPatch["divs"] = this.reader.getFloat(div,"value",true);

		this.patchList[currentPatch["id"]] = currentPatch;
	}
	console.log(this.patchList);
}


/*
 * Callback to be executed on any read error
 */ 
 
MySceneGraph.prototype.onXMLError=function (message) {
	
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;

};






