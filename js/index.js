
var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1,1000);
var mag = 160;
var camera = new THREE.OrthographicCamera(window.innerWidth / -mag, window.innerWidth / mag, window.innerHeight / mag, window.innerHeight / -mag, 0.1, 1000);

var light = new THREE.PointLight();
light.position.set( -20, 30, 50 );
camera.add(light);
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize (window.innerWidth-20, window.innerHeight-20);
document.body.appendChild(renderer.domElement);

var group = new THREE.Group();


function addSphere( coords ) {
  var geometry = new THREE.IcosahedronGeometry(0.1, 1);
  var material = new THREE.MeshPhongMaterial({color: 0xee11ff, flatShading: false});
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position.set( coords[0], coords[1], coords[2] );
  group.add( sphere );

  var edgematerial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 5
  });

  var edge = new THREE.Geometry();
  edge.vertices.push(
    new THREE.Vector3( coords[0], coords[1], coords[2] ),
    new THREE.Vector3( coords[0] + 0.707107, coords[1] + 0.408248, coords[2] + 0.288675 )
  );
  var edgeline = new THREE.Line( edge, edgematerial );
  group.add( edgeline );

  var edge = new THREE.Geometry();
  edge.vertices.push(
    new THREE.Vector3( coords[0], coords[1], coords[2] ),
    new THREE.Vector3( coords[0] - 0.707107, coords[1] + 0.408248, coords[2] + 0.288675 )
  );
  var edgeline = new THREE.Line( edge, edgematerial );
  group.add( edgeline );

  var edge = new THREE.Geometry();
  edge.vertices.push(
    new THREE.Vector3( coords[0], coords[1], coords[2] ),
    new THREE.Vector3( coords[0] + 0, coords[1] - 0.816497, coords[2] + 0.288675 )
  );
  var edgeline = new THREE.Line( edge, edgematerial );
  group.add( edgeline );

  var edge = new THREE.Geometry();
  edge.vertices.push(
    new THREE.Vector3( coords[0], coords[1], coords[2] ),
    new THREE.Vector3( coords[0] + 0, coords[1] + 0, coords[2] + -0.866025 )
  );
  var edgeline = new THREE.Line( edge, edgematerial );
  group.add( edgeline );

  var material = new THREE.MeshPhongMaterial({color: 0x11eeff, flatShading: false});
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position.set( coords[0] + 0.707107, coords[1] + 0.408248, coords[2] + 0.288675);
  group.add( sphere );

}



//var geometry = new THREE.SphereGeometry(9, 12, 12);
var geometry = new THREE.IcosahedronGeometry(9, 1);
var geometry2 = new THREE.IcosahedronGeometry(9.01, 1);
var material = new THREE.MeshPhongMaterial({color: 0xee11ff, flatShading: false});
//var material = new THREE.MeshBasicMaterial ({color: 0xee11ff});
var sphere = new THREE.Mesh(geometry, material);
var wireframe = new THREE.WireframeGeometry( geometry2 );

positions.forEach(coords => addSphere( coords ));

//group.add( sphere );


var line = new THREE.LineSegments( wireframe );
//line.material.depthTest = false;
//sphere.material.opacity = 0.25;
line.material.transparent = false;

//group.add( line );

scene.add( group );

camera.position.z= 35;
//camera.position.x= 10;

var controls = new THREE.TrackballControls( camera );

function render(){

  // stats.begin();

  requestAnimationFrame (render);

  //group.rotateX(0.01);
  //group.rotateY(0.02);
  //line.rotation.x += 0.01;
  //line.rotation.y -= 0.01;
  //line.rotation.z -= 0.01;
  //sphere.rotation.x += 0.02;
  //sphere.rotation.y += 0.02;
  controls.update();
  stats.update();

  // stats.end();

  renderer.render (scene, camera);

}

    function createStats() {
      var stats = new Stats();
      // stats.setMode(0);

      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0';
      stats.domElement.style.top = '0';

      return stats;
    }



var stats;
stats = createStats();
document.body.appendChild( stats.domElement );


render();



/*
var isMouseDown = false;
var lastMouseDownPosition = {};

document.addEventListener('mousedown', function(event) { 
    if ( event.which ) isMouseDown = true;
	lastMouseDownPosition.x = event.clientX;
	lastMouseDownPosition.y = event.clientY;
}, true);

document.addEventListener('mouseup', function(event) { 
    if ( event.which ) isMouseDown = false;
}, true);

document.addEventListener('mousemove', onDocumentMouseMove, false);





function onDocumentMouseMove( event ) {

    event.preventDefault();

    if ( isMouseDown ) {
		console.log("Down");
		newx = event.clientX;
		newy = event.clientY;
        dx = newx - lastMouseDownPosition.x;
        dy = newy - lastMouseDownPosition.y;
//		group.rotateX(dy * 0.001);
//		group.rotateY(dx * 0.001);
		lastMouseDownPosition.x = newx;
		lastMouseDownPosition.y = newy;

    }

    //interact();
    //render();

}






*/
/*
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);



var geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);


cube.opacity = 0.25;

scene.add(cube);



camera.position.z = 10;
var render = function () {
    requestAnimationFrame(render);

    cube.rotateX(0.01);
    //cube.rotateY(0.005);
    
    renderer.render(scene, camera);
};

render();
*/
