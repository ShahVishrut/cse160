// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_globalAngle;
  void main() {
    gl_Position = u_globalAngle * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_globalAngle;
let neck_Angle = 0;
let head_Angle = 0;
let ears_Angle = 0;
let leg1_Angle = 0;
let leg2_Angle = 0;
let horn_Scale = 0;
let animation = false;
let click_Animation = false;
let click_Pos;
let x_Rotate = 0;
let y_Rotate = 0;
let x_Delta = 0;
let y_Delta = 0;
let mouseDown = false;
let vertexBuffer;
let tail = null;


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
  vertexBuffer = gl.createBuffer();
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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_globalAngle = gl.getUniformLocation(gl.program, 'u_globalAngle');
  if (!u_globalAngle) {
    console.log('Failed to get the storage location of u_globalAngle');
    return;
  }
}

function main() {
  setupWebGL();

  connectVariablesToGLSL();

  canvas.onmousedown = click;
  canvas.onmousemove = move;
  canvas.onmouseup = release;

  //viewingAngle = document.getElementById("cameraAngle").value;
  //viewingAnglez = document.getElementById("cameraAnglez").value;
  document.getElementById("cameraAngle").addEventListener('input', function() {x_Rotate = this.value; x_Delta = 0; renderScene();})
  //document.getElementById("cameraAnglez").addEventListener('input', function() {viewingAnglez = this.value; renderScene();})
  //document.getElementById("neck").addEventListener('input', function() {renderScene();})
  //document.getElementById("head").addEventListener('input', function() {renderScene();})
  //document.getElementById("ears").addEventListener('input', function() {renderScene();})

  document.getElementById("animation").onclick = function(ev) {animation = !animation;}

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
 
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  requestAnimationFrame(tick);
}

var g_shapesList = [];

function click(ev) {
  if (ev.shiftKey) {
    click_Animation = true;
    clickAnimation();
  }
  mouseDown = true;
  click_Pos = convertCoordinatesEventToGL(ev);
}

function move(ev) {
  if (!mouseDown) {
    return;
  }
  let temp = convertCoordinatesEventToGL(ev);
  
  x_Delta = 40 * (temp[0] - click_Pos[0]);
  y_Delta = -40 * (temp[1] - click_Pos[1]);
}

function release(ev) {
  click_Animation = false;
  mouseDown = false;
  x_Rotate += x_Delta;
  y_Rotate += y_Delta;
  x_Delta = 0;
  y_Delta = 0;
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function clearCanvas() {
  g_shapesList = [];
  renderScene();
}

function renderScene() {
  // Clear <canvas>

  var startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var tempMat = new Matrix4().translate(-0.2, -0.2, 0.2);
  tempMat.rotate(x_Rotate + x_Delta, 0, 1, 0);
  tempMat.rotate(y_Rotate + y_Delta, 1, 0, 0);
  gl.uniformMatrix4fv(u_globalAngle, false, tempMat.elements);

  var mat4 = new Matrix4();
  mat4.scale(0.3, 0.15, 0.6);
  drawCube(mat4, [1.0,1.0,1.0,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.22,0.1,0.05);
  mat4.rotate(180 + leg1_Angle, 1, 0, 0);
  mat4.scale(0.05, 0.5, 0.05);
  drawCube(mat4, [1.0,1.0,1.0,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.04,0.1,0.05);
  mat4.rotate(180 + leg2_Angle, 1, 0, 0);
  mat4.scale(0.05, 0.5, 0.05);
  drawCube(mat4, [1.0,1.0,1.0,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.22,0.1,0.45);
  mat4.rotate(180 + leg1_Angle, 1, 0, 0);
  mat4.scale(0.05, 0.5, 0.05);
  drawCube(mat4, [1.0,1.0,1.0,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.04,0.1,0.45);
  mat4.rotate(180 + leg2_Angle, 1, 0, 0);
  mat4.scale(0.05, 0.5, 0.05);
  drawCube(mat4, [1.0,1.0,1.0,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle, 1, 0, 0);
  mat4.scale(0.09, 0.8, 0.09);
  drawCube(mat4, [0.87,0.75,0.33,1.0]);


  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.scale(0.2, 0.2, 0.2);
  drawCube(mat4, [0.87,0.75,0.33,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.02,0,0.16);
  mat4.scale(0.15, 0.07, 0.2);
  drawCube(mat4, [0.87,0.75,0.33,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.02,0.05,0.16);
  mat4.scale(0.15, 0.07, 0.15);
  drawCube(mat4, [0.87,0.75,0.33,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.02,0.10,0.16);
  mat4.scale(0.15, 0.05, 0.10);
  drawCube(mat4, [0.87,0.75,0.33,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.15,0.14,0.19);
  mat4.scale(0.05, 0.05, 0.05);
  drawCube(mat4, [0,0,0,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0,0.14,0.19);
  mat4.scale(0.05, 0.05, 0.05);
  drawCube(mat4, [0,0,0,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.02,0.2,0.11);
  mat4.scale(0.15, 0.1, 0.1);
  drawCube(mat4, [0.87,0.75,0.33,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.18,0.22,0.11);
  mat4.rotate(ears_Angle, 1, 0, 0);
  mat4.scale(0.1, 0.1, 0.03);
  drawCube(mat4, [1,1,0.33,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(-0.07,0.22,0.11);
  mat4.rotate(ears_Angle, 1, 0, 0);
  mat4.scale(0.1, 0.1, 0.03);
  drawCube(mat4, [1,1,0.33,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0, horn_Scale, 0);
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.02,0.25,0.07);
  mat4.scale(0.05, 0.1, 0.05);
  drawCube(mat4, [1,1,1,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0, horn_Scale, 0);
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.12,0.25,0.07);
  mat4.scale(0.05, 0.1, 0.05);
  drawCube(mat4, [1,1,1,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0, horn_Scale, 0);
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.02,0.32,0.07);
  mat4.scale(0.07, 0.07, 0.07);
  drawCube(mat4, [0.58,0.30,0.19,1.0]);

  mat4 = new Matrix4();
  mat4.translate(0, horn_Scale, 0);
  mat4.translate(0.11,0.08,0.54);
  mat4.rotate(neck_Angle-10, 1, 0, 0);
  mat4.translate(-0.06,0.57,0.05);
  mat4.rotate(head_Angle, 1, 0, 0);
  mat4.translate(0.12,0.32,0.07);
  mat4.scale(0.07, 0.07, 0.07);
  drawCube(mat4, [0.58,0.30,0.19,1.0]);

  mat4 = new Matrix4();
  if (tail === null) {
    tail = new Cylinder();
    
    tail.color = [0.58,0.30,0.19,1.0];
  }
  mat4.translate(0, 0, -horn_Scale);
    mat4.translate(0.1,-0.1,-0.05);
    mat4.rotate(200, 1, 0, 0);
    mat4.scale(0.07, 0.27, 0.07);
    tail.matrix = mat4;
  tail.drawCylinder();

  var duration = performance.now() - startTime;
  document.getElementById("fps").innerHTML = " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000 / duration);
}

function updateAnimationAngles() {
  if (animation) {
    if (Math.floor(g_seconds / 5) % 2 == 0) {
      neck_Angle = 14 * (g_seconds % 5);
    } else {
      neck_Angle = 70 - 14 * (g_seconds % 5);
    }
    if (Math.floor(g_seconds / 3) % 2 == 0) {
      head_Angle = 70 - 23 * (g_seconds % 3);
    } else {
      head_Angle = 23 * (g_seconds % 3);
    }
    if (Math.floor(g_seconds / 2) % 2 == 0) {
      ears_Angle = 70 - 35 * (g_seconds % 2);
    } else {
      ears_Angle = 35 * (g_seconds % 2);
    }
    if (Math.floor(g_seconds / 3) % 2 == 0) {
      leg1_Angle = -25 + 16.7 * (g_seconds % 3);
      leg2_Angle = 25 - 16.7 * (g_seconds % 3);
    } else {
      leg1_Angle = 25 - 16.7 * (g_seconds % 3);
      leg2_Angle = -25 + 16.7 * (g_seconds % 3);
    }
  } else {
    neck_Angle = document.getElementById("neck").value;
    head_Angle = document.getElementById("head").value;
    ears_Angle = document.getElementById("ears").value;
  }

  renderScene();
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;
function tick() {
  g_seconds=performance.now()/1000.0-g_startTime;

  updateAnimationAngles();
  clickAnimation();

  requestAnimationFrame(tick);
}

function clickAnimation() {
  if (click_Animation) {
    g_seconds=performance.now()/1000.0-g_startTime;
    if (Math.floor(g_seconds / 4) % 2 == 0) {
      horn_Scale = 0 + (g_seconds % 4) / 8.0;
    } else {
      horn_Scale = 0.5 - (g_seconds % 4) / 8.0;
    }
    renderScene();
  } else {
    horn_Scale = 0;
  }
}