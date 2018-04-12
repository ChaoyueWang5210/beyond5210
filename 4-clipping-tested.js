
// standard global variables
var container, scene, camera, renderer, controls;
var view_volume, view_size, object, object_size;
var ShowTimeBtn = document.querySelector("button[id=ShowTimeBtn]");

draw();

read("click");
function read(evtType) {
	ShowTimeBtn.addEventListener(evtType, function () {
		window.requestAnimationFrame(function () {
			var canvas = document.querySelector("canvas");
			canvas.parentNode.removeChild(canvas);
			draw();
		});
	});
}

function draw() {
	var view_volume = split(document.querySelector("input[id=view_volume]").value);
	var view_size = split(document.querySelector("input[id=view_size]").value);
	var object = split(document.querySelector("input[id=object]").value);
	var object_size = split(document.querySelector("input[id=object_size]").value);

	init(view_volume, view_size, object, object_size);
	animate();
}
	
function init(view_volume, view_size, object, object_size) 
{
	// Scene
	scene = new THREE.Scene();
	// Camera
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 40, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(-200,200,500);
	camera.lookAt(scene.position);	
	// Randerer
	if ( Detector.webgl ) {
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	} else {
		renderer = new THREE.CanvasRenderer(); 
	}
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor(0xCCCCCC);
	container = document.getElementById( 'drawing' );
	container.appendChild( renderer.domElement );
	// Events
	THREEx.WindowResize(renderer, camera);
	// Controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// Light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,500,0); // top
	scene.add(light);
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,0,500); // front
	scene.add(light);
	var light = new THREE.PointLight(0xffffff);
	light.position.set(250,0,100); // front right
	scene.add(light);
	var light = new THREE.PointLight(0xffffff);
	light.position.set(-250,0,-100); // rear left
	scene.add(light);
	
	// Using wireframe materials to illustrate shape details.
	var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	var wireframeMaterial = new THREE.MeshStandardMaterial( { color: 0x654321, roughness: 0.5, metalness: 0 } );  
	var greenmultiMaterial = [ darkMaterial, wireframeMaterial ]; 

	
	var shape = new THREE.Mesh(
		new THREE.CubeGeometry(view_size[0], view_size[1], view_size[2]), 
		new THREE.MeshBasicMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.5 } )
		 );
	shape.position.set(view_volume[0], view_volume[1], view_volume[2]);
	scene.add( shape );

	// cube object
	var shape = THREE.SceneUtils.createMultiMaterialObject( 
		new THREE.CubeGeometry(object_size[0], object_size[1], object_size[2]), 
		greenmultiMaterial );
	shape.position.set(object[0], object[1], object[2]);
	scene.add( shape );

}

function split(str1) {
	return str1.split(",");
}

function animate() 
{
    requestAnimationFrame( animate );
	renderer.render( scene, camera );		
	controls.update();
}
