function box() {
  let getBottomWidth = Number($("#bottom_width").val() || 30);
  let length = Number($("#length").val() || 30);
  let thickness = Number($("#thickness").val() || 10);
  let topWidth = Number($("#top_width").val() || 20);
  let topEdge = Number($("#top_edge").val() || 10);
  let leftEdge = Number($("#left_edge").val() || 20);

  //
  let defaultTopWidthValue = Number(
    document.querySelector("#top_width").defaultValue
  );
  let defaultTopEdgeValue = Number(
    document.querySelector("#top_edge").defaultValue
  );
  let defaultLeftEdgeValue = Number(
    document.querySelector("#left_edge").defaultValue
  );
  validationTopWidthAndEdge(
    getBottomWidth,
    topWidth,
    "top_width",
    defaultTopWidthValue,
    "top width"
  );

  validationTopWidthAndEdge(
    length,
    leftEdge,
    "left_edge",
    defaultLeftEdgeValue,
    "left edge"
  );
  validationTopWidthAndEdge(
    length,
    topEdge,
    "top_edge",
    defaultTopEdgeValue,
    "top edge"
  );

  //
  function validationTopWidthAndEdge(
    bottomWidth,
    topWidth,
    inputId,
    defaultValue,
    message
  ) {
    const getWidth = eval(bottomWidth);
    const getTopWidth = eval(topWidth);
    const getInput = document.getElementById(`${inputId}`);
    const getFinalTopWidth =
      getInput.value >= 8 && getWidth >= 8 ? getInput.value - 2 : getTopWidth;

    if (getTopWidth > getWidth) {
      getInput.style.border = "2px solid red";

      getInput.value = getFinalTopWidth;
      alert(`The ${message} is too large.`);
    } else {
      getInput.style.border = "1px solid #8c8f94";
    }
  }
  //

  createPrism(thickness, length, getBottomWidth, topWidth, topEdge, leftEdge);
}

// Define the PrismGeometry constructor
function PrismGeometry(vertices, height) {
  var Shape = new THREE.Shape();

  (function f(ctx) {
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  })(Shape);

  var settings = {
    amount: height,
    bevelEnabled: false,
  };

  THREE.ExtrudeGeometry.call(this, Shape, settings);
}

PrismGeometry.prototype = Object.create(THREE.ExtrudeGeometry.prototype);

// Function to create the prism shape
function createPrism(
  thickness,
  length,
  bottomWidth,
  topWidth,
  topEdge,
  leftEdge
) {
  // Set up scene
  var camera = new THREE.PerspectiveCamera();
  camera.position.set(-25, 40, 150);
  // roation
  camera.rotation.x = -0.2;
  camera.rotation.y = -0.4;
  camera.rotation.z = -0.04;
  var scene = new THREE.Scene();
  setupLights(scene);

  // Set up renderer
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.querySelector(".product-preview").innerHTML = "";
  document.querySelector(".product-preview").appendChild(renderer.domElement);

  //  window.addEventListener("resize", onWindowResize, false);

  var xColor = $('input[name="color"]:checked').val();
  if (xColor == "blue") {
    xColor = 0x00b2fc;
  } else if (xColor == "yellow") {
    xColor = 0xffd500;
  }

  if (!xColor) {
    xColor = 0x00b2fc;
  }

  // Set up material
  var material = new THREE.MeshPhongMaterial({
    color: xColor,
    specular: xColor,
    shininess: 20,
  });

  // Set up geometry
  var geometry = new PrismGeometry(
    vectorInputs(length, bottomWidth, topWidth, topEdge, leftEdge),
    thickness
  );

  // Create and add prism to scene
  var prism = new THREE.Mesh(geometry, material);
  scene.add(prism);

  // Render the scene
  renderer.render(scene, camera);
}

// Function to set up lights in the scene
function setupLights(scene) {
  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(50, 500, 600);
  scene.add(light);

  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-100, 0, 0);
  scene.add(light);
}

// Function to handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to add camera to the scene
function AddCamera(X, Y, Z) {
  camera = new THREE.PerspectiveCamera();
  camera.position.set(X, Y, Z);
}

// Function to perform range transformation
function rangeFun(input) {
  return input * 0.1;
}

// Function to generate vector inputs for the prism
function vectorInputs(length, bottomWidth, topWidth, topEdge, leftEdge) {
  console.log({ bottomWidth, length, topWidth, topEdge, leftEdge });

  let defaultWidth = Number(
    document.querySelector("#bottom_width").defaultValue
  );

  let getIncreaseWidthVal = bottomWidth - defaultWidth;

  console.log({ getIncreaseWidthVal, defaultWidth });

  let bX = bottomWidth - getIncreaseWidthVal;
  let bY = 0;

  let cX = bottomWidth - getIncreaseWidthVal;
  let cY = leftEdge;

  let dX = topWidth;
  let dY = length;

  let eX = topEdge;
  let eY = length;

  //

  let A = new THREE.Vector2(-bottomWidth + defaultWidth, 0);
  let B = new THREE.Vector2(bX, bY);
  let C = new THREE.Vector2(cX, cY);
  let D = new THREE.Vector2(dX, dY);
  let E = new THREE.Vector2(eX - bottomWidth + defaultWidth, eY);

  console.log({ A, B, C, D, E });

  return [A, B, C, D, E];
}
