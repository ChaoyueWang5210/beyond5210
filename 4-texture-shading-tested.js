/**
 * sources: 
 * 1.OrbitControls.js: This set of controls performs orbiting, dollying (zooming), and panning. 
 * 2.Three.js makes WebGL simpler.
 */
var renderer, scene, camera

var skybox;  // The cube with cubemap texture that is used as a skybox
var skyboxTexture;  // The cubemap texture

var model;  // The reflecting object, inside the box.

var rotateX = 0;   // rotation of object about its x-axis
var rotateY = 0;   // rotation of object about its y-axis

var controls;  // an OrbitControls object for rotating the view.

var skyboxTextureFolder = [  // folders containing available cubemap textures.
    "images/images1",     //    Note that files are aleays named posx.jpg, negx.jpg, etc.
    "images/images2",
    "images/images3",
    "images/images4"
];

var baseColor = [  // available colors for the base material color
    0xFFFFFF,
    0x8888CC,
    0xCC8888,
    0x88BB88
];
var currentColor = 0xFFFFFF;  // currently selected 


function render() {
    controls.update();
    renderer.render(scene, camera);
}

/**
 *  Called when the clicks one of the radio buttons for selecting the skybox texture.
 *  Creates the texture and the skybox cube and adds the cube to the scene.
 */
function createSkybox(textureNumber) {
    document.getElementById("bttn").focus();  // to prevent key presses from going to the radio buttons
    if (skybox)
       scene.remove(skybox);
    var textureURLs = [];
    textureURLs.push(skyboxTextureFolder[textureNumber] + "/posx.jpg" );
    textureURLs.push(skyboxTextureFolder[textureNumber] + "/negx.jpg" );
    textureURLs.push(skyboxTextureFolder[textureNumber] + "/posy.jpg" );
    textureURLs.push(skyboxTextureFolder[textureNumber] + "/negy.jpg" );
    textureURLs.push(skyboxTextureFolder[textureNumber] + "/posz.jpg" );
    textureURLs.push(skyboxTextureFolder[textureNumber] + "/negz.jpg" );
    skyboxTexture = THREE.ImageUtils.loadTextureCube( textureURLs, undefined, render );
    var shader = THREE.ShaderLib[ "cube" ]; // contains the required shaders
        shader.uniforms[ "tCube" ].value = skyboxTexture; // data for the shaders
        var material = new THREE.ShaderMaterial( {
                    // A ShaderMaterial uses custom vertex and fragment shaders.
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: shader.uniforms,  // the texture is part of this object
                depthWrite: false,
                side: THREE.BackSide
        } );
    skybox = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), material );
    scene.add(skybox);
    if (model) {
        if (model.material) { // it's a basic geometry model
            model.material = makeReflectionMaterial();
            model.material.needsUpdate = true;
        }
        else { // it's a JSON model and the actual model object is model.children[0]
            model.children[0].material = makeReflectionMaterial();
            model.children[0].needsUpdate = true;
        }
    }
    render();
}

/**
 *  Creates the material to use on the models.  This is a MeshBasicMaterial with
 *  the skybox as an environment map.  The base color, which is blended with the
 *  environment map, is taken from the current color selection.
 */
function makeReflectionMaterial() {
    return new THREE.MeshBasicMaterial( { color: currentColor, envMap: skyboxTexture } );
}

/**
 *  Called when the user clicks one of the model choice radio buttons, for the four
 *  buttons that correspond to basic geometries.
 */
function installModel(modelNum) {
    document.getElementById("bttn").focus();  // to prevent key presses from going to the radio buttons
    if (model)
        scene.remove(model);
    var geometry;
    switch (modelNum) {
        case 0: geometry = new THREE.CubeGeometry(1,1,1); break;
        case 1: geometry = new THREE.CylinderGeometry(0.5,0.5,1,32,1); break;
        case 2: geometry = new THREE.TorusGeometry(0.4,0.25,64,32); break;
        case 3: geometry = new THREE.SphereGeometry(0.6,32,16); break;
    }
    var material = makeReflectionMaterial();
    model = new THREE.Mesh(geometry, material);
    rotateX = rotateY = 0;
    scene.add(model);
    render();
}

/**
 * The callback function that is called by the JSONLoader when it
 * has finished loading the object.  This function creates a three.js
 * function to hold the object.  It translates the object so that
 * its center is in the origin.  It wraps the object in another object
 * that is used to scale and rotate the object.  The scale is set
 * so that the maximum coordinate in its vertices, in absolute
 * value, is scaled to 1.  The rotation is controlled by the arrow
 * keys.  (The material from the JSON loader file is ignored.)
 */ 
function modelLoadedCallback(geometry) {

    /* create the object from the geometry and materials that were loaded.  There
       can be multiple materials, which can be applied to the object using MeshFaceMaterials.
       Note tha the material can include references to texture images might finish
       loading later. */

    var material = makeReflectionMaterial();
    var object = new THREE.Mesh(geometry, material);

    /* Determine the ranges of x, y, and z in the vertices of the geometry. */

    var xmin = Infinity;
    var xmax = -Infinity;
    var ymin = Infinity;
    var ymax = -Infinity;
    var zmin = Infinity;
    var zmax = -Infinity;
    for (var i = 0; i < geometry.vertices.length; i++) {
        var v = geometry.vertices[i];
        if (v.x < xmin)
            xmin = v.x;
        else if (v.x > xmax)
            xmax = v.x;
        if (v.y < ymin)
            ymin = v.y;
        else if (v.y > ymax)
            ymax = v.y;
        if (v.z < zmin)
            zmin = v.z;
        else if (v.z > zmax)
            zmax = v.z;
    }
    
    /* translate the center of the object to the origin */
    var centerX = (xmin+xmax)/2;
    var centerY = (ymin+ymax)/2; 
    var centerZ = (zmin+zmax)/2;
    var max = Math.max(centerX - xmin, xmax - centerX);
    max = Math.max(max, Math.max(centerY - ymin, ymax - centerY) );
    max = Math.max(max, Math.max(centerZ - zmin, zmax - centerZ) );
    var scale = 1/max;
    object.position.set( -centerX, -centerY, -centerZ );
    console.log("Loading finished, scaling object by " + scale);
    console.log("Center at ( " + centerX + ", " + centerY + ", " + centerZ + " )");
    
    /* Create the wrapper, model, to scale and rotate the object. */
    
    model = new THREE.Object3D();
    model.add(object);
    model.scale.set(scale,scale,scale);
    rotateX = rotateY = 0;
    scene.add(model);
    render();

}

/**
 *  Called when the user clicks one of the mode choice radio buttons, for the
 *  three radio buttons that corresponding to JSON models.
 */
function installJSONModel(modelNum) {
    document.getElementById("bttn").focus();  // to prevent key presses from going to the radio buttons
    if (model)
        scene.remove(model);
    var loader = new THREE.JSONLoader();
 
    render();
}

/**
 *  Called when the user clicks one of the color choice radio buttons to change
 *  the color setting.
 */
function setObjectColor(colorNum) {
    currentColor = baseColor[colorNum];
    if (model) {
        if (model.material) { // it's a basic geometry model
            model.material = makeReflectionMaterial();
            model.material.needsUpdate = true;
        }
        else { // it's a JSON model and the actual model object is model.children[0]
            model.children[0].material = makeReflectionMaterial();
            model.children[0].needsUpdate = true;
        }
    }
    render();
}

/**
 *  Called when user clicks the button.  Resets model rotation to zero.
 */
function resetRotation() {
    rotateX = rotateY = 0;
    model.rotation.set(0,0,0);
    render();
}

/**
 *  An event listener for the keydown event.  It is installed by the init() function.
 *  The arrow keys are used to rotate the model about its own axis.
 */
function doKey(evt) {
    var rotationChanged = true;
	switch (evt.keyCode) {
	    case 37: rotateY -= 0.05; break;        // left arrow
	    case 39: rotateY +=  0.05; break;       // right arrow
	    case 38: rotateX -= 0.05; break;        // up arrow
	    case 40: rotateX += 0.05; break;        // down arrow
	    case 13: rotateX = rotateY = 0; break;  // return
	    case 36: rotateX = rotateY = 0; break;  // home
	    default: rotationChanged = false;
	}
	if (rotationChanged) {
       model.rotation.set(rotateX,rotateY,0);	
       render();
	   evt.preventDefault();
	}
}

/**
 *  This page uses THREE.OrbitControls to let the user use the mouse to rotate
 *  the view.  OrbitControls are designed to be used during an animation, where
 *  the rotatino is updated as part of preparing for the next frame.  The scene
 *  is not automatically updated just because the user drags the mouse.  To get
 *  the rotation to work without animation, I add another mouse listener to the
 *  canvas, just to call the render() function when the user drags the mouse.
 *  The render() function includes updating of the OrbitControls.  The element
 *  parameter here will be the canvas, and the dragAction is render.
 */
function setupDragAction(element, dragAction) {
    function move() {
        dragAction();
    }
    function down() {
        document.addEventListener("mousemove", move, false);
    }
    function up() {
        document.removeEventListener("mousemove", move, false);
    }
    element.addEventListener("mousedown", down, false);
}

/**
 *  This function is called by the body onload event.
 */
function init() {
    try {
        var theCanvas = document.getElementById("cnvs");
        if (!theCanvas || !theCanvas.getContext) {
            document.getElementById("message").innerHTML = 
                             "Sorry, your browser doesn't support canvas graphics.";
            return;
        }
        try {  // try to create a WebGLRenderer
            if (window.WebGLRenderingContext) {
                renderer = new THREE.WebGLRenderer( { 
                   canvas: theCanvas, 
                   antialias: true
                } );
            } 
        }
        catch (e) {
        }
        if (!renderer) { // If the WebGLRenderer couldn't be created, give up.
            document.getElementById("message").innerHTML =
                          "WebGL is requrid but is not availabl.";
            return;
        }
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, theCanvas.width/theCanvas.height, 0.1, 100);
        camera.position.z = 3;
        scene.add(camera);  // add the camera+light to the scene
        controls = new THREE.OrbitControls(camera, theCanvas);
        createSkybox(0);
        installJSONModel(0);
        render();
        setupDragAction(theCanvas, render);
        document.addEventListener("keydown", doKey, false);
        document.getElementById("s1").checked = true;
        document.getElementById("m1").checked = true;
        document.getElementById("c1").checked = true;
     }
     catch (e) {
        //document.getElementById("message").innerHTML = "Sorry, an error occurred: " + e;
       // alert(e.stack);
     }
}