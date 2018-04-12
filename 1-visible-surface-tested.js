/**
 * sources: 
 * 1.OrbitControls.js: This set of controls performs orbiting, dollying (zooming), and panning. 
 * 2.Three.js makes WebGL simpler.
 */
    var sub = document.getElementById("sub");
    
    sub.addEventListener("click", function(){
    var v1 = document.getElementById("v1").value;
	var x1 = v1.split(",")[0];
	var y1 = v1.split(",")[1];
	var z1 = v1.split(",")[2];
    var v2 = document.getElementById("v2").value;
	var x2 = v2.split(",")[0];
	var y2 = v2.split(",")[1];
	var z2 = v2.split(",")[2];
    var v3 = document.getElementById("v3").value;
	var x3 = v3.split(",")[0];
	var y3 = v3.split(",")[1];
	var z3 = v3.split(",")[2];
    var v4 = document.getElementById("v4").value;
	var x4 = v4.split(",")[0];
	var y4 = v4.split(",")[1];
	var z4 = v4.split(",")[2];
    var center1 = document.getElementById("center1").value;
	var x5 = center1.split(",")[0];
	var y5 = center1.split(",")[1];
	var z5 = center1.split(",")[2];
	var center2 = document.getElementById("center2").value;
	var x6 = center2.split(",")[0];
	var y6 = center2.split(",")[1];
	var z6 = center2.split(",")[2];
	var center3 = document.getElementById("center3").value;
	var x7 = center3.split(",")[0];
	var y7 = center3.split(",")[1];
	var z7 = center3.split(",")[2];
    var radius1 = document.getElementById("radius1").value;
    var radius2 = document.getElementById("radius2").value;
    var radius3 = document.getElementById("radius3").value;
    var height1 = document.getElementById("height1").value;
    var height2 = document.getElementById("height2").value;
    init(x1,y1,z1,x2,x2,y2,z2,x3,y3,z3,x4,y4,z4,x5,y5,z5,x6,y6,z6,x7,y7,z7,radius1,radius2,radius3,height1,height2);
	render();
			},false);
			
 var canvas = document.getElementById('Canvas');
 var renderer = null;
 var mesh = null;
 var control = null;
 var scene = null;
 var id = null;
 var shape = null;
 var material = null;
//-------------------------------------------------------------------------------------



 function init(x1,y1,z1,x2,x2,y2,z2,x3,y3,z3,x4,y4,z4,x5,y5,z5,x6,y6,z6,x7,y7,z7,radius1,radius2,radius3,height1,height2) {
 
 renderer = new THREE.WebGLRenderer({
    canvas});
    renderer.setClearColor(0xCCCCCC);
     scene = new THREE.Scene();


var d = 4/3;
camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 1000);

camera.position.set( 50, 0, 20 ); 
camera.lookAt( scene.position );

	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render );
	controls.enableZoom = true;
	controls.enablePan = true;
	controls.maxPolarAngle = Math.PI / 2;

var prismGeometry = new THREE.Geometry(); 
prismGeometry.vertices.push(new THREE.Vector3(x1,  y1, z1));  
prismGeometry.vertices.push(new THREE.Vector3(x2, y2, z2)); 
prismGeometry.vertices.push(new THREE.Vector3(x3, y3, z3));
prismGeometry.vertices.push(new THREE.Vector3(x4, y4, z4));

prismGeometry.faces.push(new THREE.Face3(0, 1, 2));
prismGeometry.faces.push(new THREE.Face3(1, 2, 3));
prismGeometry.faces.push(new THREE.Face3(0, 1, 3));
prismGeometry.faces.push(new THREE.Face3(0, 2, 3));


var cylinderGeometry = new THREE.CylinderGeometry( radius1, radius1, height1, 32 );
var cylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xBBBAA} );
var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
cylinder.position.set(x5, y5 , z5);
scene.add( cylinder );

var primsMaterial = new THREE.MeshNormalMaterial({ 
side:THREE.DoubleSide 
});

var prism = new THREE.Mesh(prismGeometry, primsMaterial); 
scene.add(prism); 

var coneGeometry = new THREE.ConeGeometry( radius2, height2, 32 );
var coneMaterial = new THREE.MeshBasicMaterial( {color: 0xCCffBB} );
var cone = new THREE.Mesh( coneGeometry, coneMaterial );
cone.position.set(x6, y6, z6);
scene.add( cone );

var sphereGeometry = new THREE.SphereGeometry( radius3, 16, 16 );
var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xAABBCC } );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.set(x7, y7, z7);
scene.add( sphere );

}


function render(){
	renderer.render(scene, camera );
}




