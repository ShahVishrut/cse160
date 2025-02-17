// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;

  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec4 a_ModelMatrix0;
  attribute vec4 a_ModelMatrix1;
  attribute vec4 a_ModelMatrix2;
  attribute vec4 a_ModelMatrix3;
  attribute vec4 a_BaseColor;
  attribute float a_TexColorWeight0;
  attribute float a_TexColorWeight1;

  varying vec2 v_UV;
  varying vec4 v_BaseColor;
  varying float v_TexColorWeight0;
  varying float v_TexColorWeight1;

  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3) * a_Position;
    v_UV = a_UV;
    v_BaseColor = a_BaseColor;
    v_TexColorWeight0 = a_TexColorWeight0;
    v_TexColorWeight1 = a_TexColorWeight1;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;

  varying vec2 v_UV;
  varying vec4 v_BaseColor;

  varying float v_TexColorWeight0;
  varying float v_TexColorWeight1;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;

  void main() {
    gl_FragColor = (1.0 - v_TexColorWeight0 - v_TexColorWeight1) * v_BaseColor + v_TexColorWeight0 * texture2D(u_Sampler0, v_UV) + v_TexColorWeight1 * texture2D(u_Sampler1, v_UV);
  }`

let canvas;
let gl;
let camera;

let a_Position;
let a_UV;
let a_ModelMatrix0;
let a_ModelMatrix1;
let a_ModelMatrix2;
let a_ModelMatrix3;
let a_BaseColor;
let a_TexColorWeight0;
let a_TexColorWeight1;

let u_ProjectionMatrix;
let u_ViewMatrix;
let u_Sampler0;
let u_Sampler1;

let g_shapesList = [];
let prevMousePos = null;
let map;
let map_pos;

let gameActive = false;
let gameCubeIndex;
let gameCubeX;
let gameCubeY;
let gameCubeZ;
let secCorrect = 0;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_ModelMatrix0 = gl.getAttribLocation(gl.program, 'a_ModelMatrix0');
  if (!a_ModelMatrix0) {
    console.log('Failed to get the storage location of a_ModelMatrix0');
    return;
  }

  a_ModelMatrix1 = gl.getAttribLocation(gl.program, 'a_ModelMatrix1');
  if (!a_ModelMatrix1) {
    console.log('Failed to get the storage location of a_ModelMatrix1');
    return;
  }

  a_ModelMatrix2 = gl.getAttribLocation(gl.program, 'a_ModelMatrix2');
  if (!a_ModelMatrix2) {
    console.log('Failed to get the storage location of a_ModelMatrix2');
    return;
  }

  a_ModelMatrix3 = gl.getAttribLocation(gl.program, 'a_ModelMatrix3');
  if (!a_ModelMatrix3) {
    console.log('Failed to get the storage location of a_ModelMatrix3');
    return;
  }

  a_BaseColor = gl.getAttribLocation(gl.program, 'a_BaseColor');
  if (!a_BaseColor) {
    console.log('Failed to get the storage location of a_BaseColor');
    return;
  }

  a_TexColorWeight0 = gl.getAttribLocation(gl.program, 'a_TexColorWeight0');
  if (!a_TexColorWeight0) {
    console.log('Failed to get the storage location of a_TexColorWeight0');
    return;
  }

  a_TexColorWeight1 = gl.getAttribLocation(gl.program, 'a_TexColorWeight1');
  if (!a_TexColorWeight1) {
    console.log('Failed to get the storage location of a_TexColorWeight1');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }
}

function initTextures() {
  var image = new Image();
  var image2 = new Image();

  image.onload = function() { loadTexture(image, 0);};
  image2.onload = function() {loadTexture(image2, 1);};

  image.src = 'sky.jpg';
  image2.src = 'block.jpg';
}

function loadTexture(image, texUnit) {
  var texture = gl.createTexture();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
  } else {
    gl.activeTexture(gl.TEXTURE1);
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  if (texUnit == 0) {
    gl.uniform1i(u_Sampler0, 0);
  } else {
    gl.uniform1i(u_Sampler1, 1);
  }
}

function main() {
  setupWebGL();

  connectVariablesToGLSL();

  initTextures();

  camera = new Camera();

  document.onkeydown = keydown;
  document.onmousemove = mousemove;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
 
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  addShapes();
  requestAnimationFrame(tick);
}

// function convertCoordinatesEventToGL(ev) {
//   var x = ev.clientX; // x coordinate of a mouse pointer
//   var y = ev.clientY; // y coordinate of a mouse pointer
//   var rect = ev.target.getBoundingClientRect();

//   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
//   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

//   return([x,y]);
// }

function addShapes() {
  var sky = new Cube();
  sky.textureWeight0 = 1;
  sky.matrix.translate(-500, -500, -500);
  sky.matrix.scale(1000, 1000, 1000);
  g_shapesList.push(sky);

  var ground = new Cube();
  ground.color = [0.60, 0.86, 0.26, 1.0];
  ground.matrix.translate(-500, -500, -3);
  ground.matrix.scale(1000, 1000, 1);
  g_shapesList.push(ground);

  map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,0,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1], 
    [1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1], 
    [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1]
  ]
}

function renderScene() {
  // Clear <canvas>

  var startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projection.elements);

  for (var i = 0; i < g_shapesList.length; i++) {
    g_shapesList[i].prepareRender();
  }

  let block = new Cube();
  block.textureWeight1 = 1;
  for (var x = 0; x < map.length; x++) {
    for (var y = 0; y < map[0].length; y++) {
      for (q = 0; q < map[x][y]; q++) {
          let matrix = new Matrix4();
          matrix.translate(x, y, q);
          block.matrix = matrix;
          block.prepareRender();
      }
    }
  }
  map_pos = camera.getMapPosition();
  if (isValidPosition(map_pos)) {
    let indicator = new Cube();
    indicator.color = [1,0,0,1.0];
    indicator.matrix.translate(map_pos[0] + 0.4, map_pos[1] + 0.4, 0);
    indicator.matrix.scale(0.2,0.2,1000);
    indicator.prepareRender();
  }
  Cube.renderAll();

  var duration = performance.now() - startTime;
  document.getElementById("fps").innerHTML = " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000 / duration);
}

function isValidPosition(pos) {
   return pos[0] >= 0 && pos[0] < map.length && pos[1] >= 0 && pos[1] < map[0].length;
}

function keydown(ev) {
  if (ev.keyCode == 87) {
    camera.moveForward();
  } else if (ev.keyCode == 83) {
    camera.moveBackwards();
  } else if (ev.keyCode == 65) {
    camera.moveLeft();
  } else if (ev.keyCode == 68) {
    camera.moveRight();
  } else if (ev.keyCode == 81) {
    camera.panLeft();
  } else if (ev.keyCode == 69) {
    camera.panRight();
  } else if (ev.keyCode == 90) {
    if (isValidPosition(map_pos)) {
      map[map_pos[0]][map_pos[1]]++;
    }
  } else if (ev.keyCode == 88) {
    if (isValidPosition(map_pos)) {
      map[map_pos[0]][map_pos[1]] = Math.max(0, map[map_pos[0]][map_pos[1]] - 1);
    }
  } else if (ev.keyCode == 82) {
    camera.reset();
    prevMousePos = null;
  }
}

function mousemove(ev) {
  let temp = [ev.clientX, ev.clientY];
  if (prevMousePos === null) {
    prevMousePos = temp;
    return;
  }
  let dx = temp[0] - prevMousePos[0];
  let dy = temp[1] - prevMousePos[1];

  camera.panSideways(dx);
  camera.panUpwards(-dy);

  prevMousePos = temp;
  
}

function startGame() {
  gameActive = true;
  for (var x = 0; x < map.length; x++) {
    for (var y = 0; y < map[0].length; y++) {
      map[x][y] = Math.floor(Math.random() * 5);
    }
  }
  var target = new Cube();
  gameCubeX = Math.floor(Math.random() * map.length);
  gameCubeY = Math.floor(Math.random() * map[0].length);
  gameCubeZ = Math.floor(Math.random() * 5);
  target.matrix.translate(-0.1 + gameCubeX, -0.1 + gameCubeY, gameCubeZ);
  target.matrix.scale(1.2, 1.2, 1);
  g_shapesList.push(target);
  gameCubeIndex = g_shapesList.length - 1;
}

function updateGame() {
  if (secCorrect == 15) {
    secCorrect = 0;
    gameCubeX = Math.floor(Math.random() * map.length);
    gameCubeY = Math.floor(Math.random() * map[0].length);
    gameCubeZ = Math.floor(Math.random() * 5);
    g_shapesList[gameCubeIndex].matrix = new Matrix4();
    g_shapesList[gameCubeIndex].matrix.translate(-0.1 + gameCubeX, -0.1 + gameCubeY, gameCubeZ);
    g_shapesList[gameCubeIndex].color = [1,1,1,1.0];
  } else if (map[gameCubeX][gameCubeY] == gameCubeZ + 1) {
    g_shapesList[gameCubeIndex].color = [0,1,0,1.0];
    secCorrect++;
  } else {
    g_shapesList[gameCubeIndex].color = [1,1,1,1.0];
    secCorrect = 0;
  }
}



var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;
function tick() {
  g_seconds=performance.now()/1000.0-g_startTime;

  renderScene();

  if (gameActive) {
    updateGame();
  }

  requestAnimationFrame(tick);
}
