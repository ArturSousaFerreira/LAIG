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

	
	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
	
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
	
	var elems = init.getElementsByTagName('frustum');
	if(elems == null) return "Frustum element is missing!";
	if(elems.length != 1) return "More than one 'frustum' elements found. Expected only one!";

	var frustum = elems[0];

	this.initials.frustum={};
	
	this.initials.frustum['near']=this.reader.getFloat(frustum,'near',true);
	this.initials.frustum['far']=this.reader.getFloat(frustum,'far',true);
	
	if(isNaN(this.initials.frustum['near'])) return "ERROR! Frustum near invalid! Expected float, found a element different than a number!";
	if(isNaN(this.initials.frustum['far'])) return "ERROR! Frustum far invalid! Expected float, found a element different than a number!";
	
	
	//Translate
	
	var elems = init.getElementsByTagName('translation');
	if (elems == null)  return "Translate element is missing!";
	//if (elems.length != 1) return "More than one 'translate' elements found. Expected only one!";

	var translate = elems[0];

	this.initials.translate={};
	this.initials.translate['x']=this.reader.getFloat(translate,'x',true);
	this.initials.translate['y']=this.reader.getFloat(translate,'y',true);
	this.initials.translate['z']=this.reader.getFloat(translate,'z',true);
	
	if(isNaN(this.initials.translate['x'])) return "ERROR! Value of translate in x axis invalid! Expected float, found a element different than a number!";
	if(isNaN(this.initials.translate['y'])) return "ERROR! Value of translate in y axis invalid! Expected float, found a element different than a number!";
	if(isNaN(this.initials.translate['z'])) return "ERROR! Value of translate in z axis invalid! Expected float, found a element different than a number!";

	
	//Rotation
	
	var elems = init.getElementsByTagName('rotation');
	if (elems == null)  return "rotation element is missing.";
	if (elems.length != 3) return "Invalid number of 'rotation' elements found. Expected exactly three!";

	this.initials.rotation={};
	for (var i=0; i<3; i++)
	{
		
		this.initials.rotation[this.reader.getString(elems[i],'axis',true)] = this.reader.getFloat(elems[i],'angle',true);
		
	
	
	}
	
	if(isNaN(this.initials.rotation[this.reader.getString(elems[0],'axis',true)])) return "ERROR! Value of angle rotation in x axis invalid! Expected float, found a element different than a number!";
	if(isNaN(this.initials.rotation[this.reader.getString(elems[1],'axis',true)])) return "ERROR! Value of angle rotation in y axis invalid! Expected float, found a element different than a number!";
	if(isNaN(this.initials.rotation[this.reader.getString(elems[2],'axis',true)])) return "ERROR! Value of angle rotation in z axis invalid! Expected float, found a element different than a number!";

	
	if(this.reader.getString(elems[0],'axis',true) != "x") return "ERROR! Value of the first axis invalid! Expected  'x'!"
	if(this.reader.getString(elems[1],'axis',true) != "y")	return "ERROR! Value of the first axis invalid! Expected  'y'!"
	if(this.reader.getString(elems[2],'axis',true) != "z")	return "ERROR! Value of the first axis invalid! Expected  'z'!"

	
	//Scale
	
	var elems = init.getElementsByTagName('scale');
	if (elems == null)  return "Scale element is missing!";
	if (elems.length != 1) return "More than one 'scale' elements found. Expected only one!";

	var scale = elems[0];

	this.initials.scale={};
	this.initials.scale['sx']=this.reader.getFloat(scale,'sx',true);
	this.initials.scale['sy']=this.reader.getFloat(scale,'sy',true);
	this.initials.scale['sz']=this.reader.getFloat(scale,'sz',true);
	
	if(isNaN(this.initials.scale['sx'])) return "ERROR! Value of scale in x axis invalid! Expected float, found a element different than a number!";
	if(isNaN(this.initials.scale['sy'])) return "ERROR! Value of scale in y axis invalid! Expected float, found a element different than a number!";
	if(isNaN(this.initials.scale['sz'])) return "ERROR! Value of scale in z axis invalid! Expected float, found a element different than a number!";

	

	//Reference

	var elems = init.getElementsByTagName('reference');
	if (elems == null)  return "Reference element is missing!";
	if (elems.length != 1) return "More than one 'reference' elements found. Expected only one!";

	var reference = elems[0];

	this.initials.reference=this.reader.getFloat(reference,'length',true);

	if(isNaN(this.initials.reference)) return "ERROR! Value of reference invalid! Expected float, found a element different than a number!";
	
	console.log(this.initials);
};



/*
 * Method that parses elements of Illumination block and stores information in a specific data structure
 */
	
MySceneGraph.prototype.parseIllumination = function(rootElement) {
	
	console.log("\n");	
	console.log("ILLUMINATION:");

	
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
	
	console.log("\n");	
	console.log("LIGHTS:");
	
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
	
	console.log("\n");	
	console.log("TEXTURES:");
	
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
	
	console.log("\n");	
	console.log("MATERIALS:");
	
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
 * Method that parses translate transformation
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
 * Method that parses rotation transformation
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
 * Method that parses scale transformation
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
 * Method that parses nodes elements of Materials block and stores information in a specific data structure
 */
 
MySceneGraph.prototype.parseNodes= function(rootElement) {

    var elems = rootElement.getElementsByTagName('NODES')[0];

    if (elems == null) {
        return "NODES element is missing.";
    }    

    var root_node = elems.getElementsByTagName('ROOT')[0];
    this.root_id = this.reader.getString(root_node, 'id');

    console.log("\nNODES: ");

   	this.nodes = {};

    this.nodes['root'] = elems.children[0].id;
    var nModes = elems.children.length;
    for (var i = 1; i < nModes; i++)
    {
        var e = elems.children[i];

        this.nodes[e.id] = this.parseNode(e);
    }
	
	console.log(this.nodes);

};

MySceneGraph.prototype.parseNode = function(element) {

    var node = {};

    node['material'] = this.reader.getString(element.children[0], 'id', true);
    node['texture'] = this.reader.getString(element.children[1], 'id', true);

	node["matrix"] = mat4.create();
	mat4.identity(node["matrix"]);

    var transformations = [];

	/*
	//Translation
		var translation = iterNode.getElementsByTagName("TRANSLATION");
		var currTranslation = translation[0];
		
		currNode.translation ={};
		currNode.translation['x']=this.reader.getFloat(currTranslation,'x',true);
		currNode.translation['y']=this.reader.getFloat(currTranslation,'y',true);
		currNode.translation['z']=this.reader.getFloat(currTranslation,'z',true);

	*/

	var i = 2;
    for(; i < element.children.length; i++){

	if(element.children[i].tagName === 'TRANSLATION'){
			var translation = this.parseTranslate(element.children[i]);
			mat4.translate(node["matrix"],node["matrix"],[translation["x"],translation["y"],translation["z"]]);

        }
		else if(element.children[i].tagName === 'ROTATION'){
            var rotation = this.parseRotation(element.children[i]);
			
			var axis;
			if(rotation["axis"] == 'x') {
				axis = [1,0,0];
			}
			if(rotation["axis"] == 'y') {
				axis = [0,1,0];
			}
			if(rotation["axis"] == 'z') {
				axis = [0,0,1];
			}

			mat4.rotate(node["matrix"],node["matrix"],rotation["angle"]*Math.PI/180.0, axis);
			
		}	
		else if(element.children[i].tagName === 'SCALE'){
            var scale = this.parseScale(element.children[i])
            var scalem= [scale["sx"],scale["sy"],scale["sz"]];
			mat4.scale(node["matrix"],node["matrix"],scalem);
		
        } else
            break;
       
    }
	
   node['descendants'] = this.parseDescendants(element.children[i]);

    return node;

};

MySceneGraph.prototype.parseDescendants = function(element) {

    var descendants = [];

    for (var i = 0; i < element.children.length; i++) {;
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



//********************************************************
//********************************************************


/*
/*
 * Method that parses elements of Leaves block and stores information in a specific data structure
 

MySceneGraph.prototype.parseLeaves = function(rootElement) {
	
	console.log("\n");	
	console.log("LEAVES:");
	
	this.leaves = {};
	
	var leaves = rootElement.getElementsByTagName("LEAVES");
	if(leaves == null) return "Leaves element missing!";
	if(leaves.length != 1) return "More than one 'LEAVES' element found. Expected only one!";

	
	var first_leaves = leaves[0];
	//console.log(first_textures);

	//Leaf
	
	var leaf = first_leaves.getElementsByTagName("LEAF");
	//console.log(leaf[0]);
	if(leaf == null) return "leaf values missing";
	if(leaf.length < 1) return "0 leaf elements were found";

	for(var i=0; i<leaf.length; i++) {
		var currLeaf = {};
		var iterLeaf = leaf[i];

		//stores ids
		currLeaf["id"] = this.reader.getString(iterLeaf,"id",true);

		//type
		currLeaf["type"] = this.reader.getString(iterLeaf,"type",true);

		//args
		currLeaf["args"] = this.reader.getString(iterLeaf,"args",true);
	
		this.leaves[i]=currLeaf;
	}

	console.log(this.leaves);
};
*/




/*
 * Method that parses elements of Nodes block and stores information in a specific data structure
 *
 
MySceneGraph.prototype.parseNodes = function(rootElement) {
	
	console.log("\n");	
	console.log("NODES:");
	
	var nodes = rootElement.getElementsByTagName("NODES");
	if(nodes == null) return "Nodes element missing!";
	if(nodes.length != 1) return "More than one 'NODES' element found. Expected only one!";
	
	var root_node = nodes[0];
	
	this.nodes = {};
	
	var root = root_node.getElementsByTagName("ROOT");
	if(root == null) return "Root element missing!";
	if(root.length != 1) return "More than one 'ROOT' element found. Expected only one!";
	
	this.nodes["root"] = this.reader.getString(root[0],"id",true);
	
	
	
	nodes = root_node.getElementsByTagName("NODE");
	if(nodes == null) return "Node element missing!";
	if(nodes.length < 1) return "More than one 'NODE' element found. Expected only one!";
	
	for(var i=0; i<nodes.length; i++) {
		var currNode = {};
		var iterNode = nodes[i];

		//stores ids
		var currNodeId = this.reader.getString(iterNode,"id",true);
		
		//material 
		var material = iterNode.getElementsByTagName("MATERIAL");
		if(material == null) return "Material element missing!";
		if(material.length != 1) return "More than one 'Material' element found. Expected only one!";
		
		var currMaterial = material[0];
		
		currNode.material = this.materials[this.reader.getString(currMaterial,"id",true)];
		
		//Texture
		var texture = iterNode.getElementsByTagName("TEXTURE");
		if(texture == null) return "Texture element missing!";
		if(texture.length != 1) return "More than one 'Material' element found. Expected only one!";
		
		var currTexture = texture[0];
		
		currNode.texture = this.textures[this.reader.getString(currTexture,"id",true)];
		
		
		
		
		
		//Translation
		var translation = iterNode.getElementsByTagName("TRANSLATION");
		var currTranslation = translation[0];
		
		currNode.translation ={};
		currNode.translation['x']=this.reader.getFloat(currTranslation,'x',true);
		currNode.translation['y']=this.reader.getFloat(currTranslation,'y',true);
		currNode.translation['z']=this.reader.getFloat(currTranslation,'z',true);

		
		//Rotation
		var rotation = iterNode.getElementsByTagName("ROTATION");
		var currRotation = rotation[0];	
		
		currNode.rotation = {};	
		currNode.rotation[this.reader.getString(currRotation,'axis',true)] = this.reader.getFloat(currRotation,'angle',true);
		
		
		//Scale
		
		var scale = iterNode.getElementsByTagName("SCALE");
		var currScale = scale[0];
		
		currNode.scale = {};	
		currNode.scale['sx']=this.reader.getFloat(currScale,'sx',true);
		currNode.scale['sy']=this.reader.getFloat(currScale,'sy',true);
		currNode.scale['sz']=this.reader.getFloat(currScale,'sz',true);
		
		
		
		
		
		var descendants = iterNode.getElementsByTagName("DESCENDANTS");
		var currDes = descendants[0];
	
		var desc = currDes.getElementsByTagName("DESCENDANT");
		currNode.descendant = {};
	
		for(var i=0; i<desc.length; i++){
	
		currNode.descendant= this.reader.getString(descendante[i],"id",true);
		
		}
		
		
		this.nodes[currNodeId]=currNode;
	}
	
	console.log(this.nodes);
	
	
};
*/




