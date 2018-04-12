/**
 * sources: 
 * 1.OrbitControls.js: This set of controls performs orbiting, dollying (zooming), and panning. 
 * 2.Three.js makes WebGL simpler. 
 */
var sub = document.getElementById("sub");
var sub3 = document.getElementById("sub3");
var sub2 = document.getElementById("cal_slices");
    
sub3.addEventListener("click", function(){
var center_x = document.getElementById("center_x").value;
var center_y = document.getElementById("center_y").value;
var center_z = document.getElementById("center_z").value;
var radius_draw = document.getElementById("radius_draw").value;
var height_draw = document.getElementById("height_draw").value;
var angle_draw = document.getElementById("angle_draw").value;
var difference_draw = document.getElementById("difference_draw").value;

init(center_x,center_y,center_z,radius_draw,height_draw,angle_draw,difference_draw);
render();
			},false);
			
sub.addEventListener("click", function(){
var radius = document.getElementById("radius").value;
var height = document.getElementById("height").value;
var n = document.getElementById("n_slices").value;
var w_v = document.getElementById("w_v").value;

var Sp = n*Math.pow(radius,2)*Math.sin(2*Math.PI/n)/2;
var Sc = Math.PI *  Math.pow(radius,2);
		document.getElementById("demo").innerHTML = Sp/Sc;
			},false);

sub2.addEventListener("click", function(){
document.getElementById("report_slices").innerHTML = 8;
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
//init()
 function init(center_x,center_y,center_z,radius_draw,height_draw,angle_draw,difference_draw) {
 //put renderer inside of init: so re-draw...
 renderer = new THREE.WebGLRenderer({
    canvas});
    renderer.setClearColor(0xffffff);
     scene = new THREE.Scene();

// camera
var d = 4/3;
camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 1000);

camera.position.set( 20, 20, 20 ); 
camera.lookAt( scene.position );


var geometry = new THREE.CylinderGeometry( radius_draw, radius_draw, height_draw, 32, 1, false, 0, angle_draw/180 * Math.PI );
var material = new THREE.MeshNormalMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var cylinder = new THREE.Mesh( geometry, material );
cylinder.position.set(center_x, center_y, center_z); 
scene.add( cylinder );
}


function render(){
	renderer.render(scene, camera );
}

