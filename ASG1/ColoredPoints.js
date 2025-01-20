// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
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
let u_Size;
let curShape = 0;
let customSquare = 0;
let customCircle = 0;


function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function main() {
  setupWebGL();

  connectVariablesToGLSL();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmouseup = release;
  canvas.onmousemove = click;

  document.getElementById("points").onclick = function(ev) {curShape = 0;}
  document.getElementById("triangles").onclick = function(ev) {curShape = 1;}
  document.getElementById("circles").onclick = function(ev) {curShape = 2;}

  document.getElementById("customSquare").onclick = function(ev) {customSquare = 1; customCircle = 0;}
  document.getElementById("customCircle").onclick = function(ev) {customCircle = 1; customSquare = 0;}

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
 
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

function drawHalloween() {
  g_shapesList.push(new Circle()); g_shapesList[g_shapesList.length-1].position = [-0.5, 0, 0]; g_shapesList[g_shapesList.length-1].color = [0.96, 0.60, 0.26, 1.0]; g_shapesList[g_shapesList.length-1].size = 150.0; g_shapesList[g_shapesList.length-1].segments = 20;
  g_shapesList.push(new Point()); g_shapesList[g_shapesList.length-1].position = [-0.5, 0.45, 0]; g_shapesList[g_shapesList.length-1].color = [0.14, 0.75, 0.04, 1.0]; g_shapesList[g_shapesList.length-1].size = 20.0;
  g_shapesList.push(new Point()); g_shapesList[g_shapesList.length-1].position = [-0.5, 0.34, 0]; g_shapesList[g_shapesList.length-1].color = [0.14, 0.75, 0.04, 1.0]; g_shapesList[g_shapesList.length-1].size = 20.0;
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.75, 0.05, -0.55, 0.05, -0.65, 0.2]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.25, 0.05, -0.45, 0.05, -0.35, 0.2]; g_shapesList[g_shapesList.length-1].color =  [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.75, -0.1, -0.54, -0.25, -0.54, -0.1]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.25, -0.1, -0.46, -0.25, -0.46, -0.1]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.55, -0.1, -0.51, -0.25, -0.51, -0.1]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.45, -0.1, -0.49, -0.25, -0.49, -0.1]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.75, -0.1, -0.69, -0.25, -0.49, -0.1]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.25, -0.1, -0.31, -0.25, -0.51, -0.1]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.75, -0.1, -0.69, -0.1, -0.72, 0.0]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.65, -0.1, -0.59, -0.1, -0.62, 0.0]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.25, -0.1, -0.31, -0.1, -0.28, 0.0]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.35, -0.1, -0.41, -0.1, -0.38, 0.0]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.73, 0.3, -0.63, 0.3, -0.58, 0.2]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [-0.27, 0.3, -0.37, 0.3, -0.42, 0.2]; g_shapesList[g_shapesList.length-1].color = [1, 0.95, 0.6, 1.0];
  g_shapesList.push(new Circle()); g_shapesList[g_shapesList.length-1].position = [0.5, 0.1, 0]; g_shapesList[g_shapesList.length-1].size = 100.0; g_shapesList[g_shapesList.length-1].segments = 20;
  g_shapesList.push(new Circle()); g_shapesList[g_shapesList.length-1].position = [0.5, -0.17, 0]; g_shapesList[g_shapesList.length-1].size = 55.0; g_shapesList[g_shapesList.length-1].segments = 20;
  g_shapesList.push(new Circle()); g_shapesList[g_shapesList.length-1].position = [0.41, 0.15, 0]; g_shapesList[g_shapesList.length-1].color = [0, 0, 0, 1.0]; g_shapesList[g_shapesList.length-1].size = 25.0; g_shapesList[g_shapesList.length-1].segments = 20;
  g_shapesList.push(new Circle()); g_shapesList[g_shapesList.length-1].position = [0.59, 0.15, 0]; g_shapesList[g_shapesList.length-1].color = [0, 0, 0, 1.0]; g_shapesList[g_shapesList.length-1].size = 25.0; g_shapesList[g_shapesList.length-1].segments = 20;
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [0.5, 0, 0.45, -0.06, 0.55, -0.06]; g_shapesList[g_shapesList.length-1].color = [0, 0, 0, 1];
  g_shapesList.push(new CustomTriangle()); g_shapesList[g_shapesList.length-1].vertices = [0.4, -0.2, 0.6, -0.2, 0.6, -0.16]; g_shapesList[g_shapesList.length-1].color = [0, 0, 0, 1];
  renderAllShapes();
}

function release(ev) {
  customSquare = 0;
  customCircle = 0;
}

function click(ev) {
  if (ev.buttons != 1) {
    return;
  }
  if (customSquare != 0) {
    var convert = convertCoordinatesEventToGL(ev);
    if (customSquare == 1) {
      g_shapesList.push(new Rectangle());
      g_shapesList[g_shapesList.length - 1].vertices[0] = convert[0];
      g_shapesList[g_shapesList.length - 1].vertices[1] = convert[1];
      customSquare = 2;
    }
    g_shapesList[g_shapesList.length - 1].vertices[2] = convert[0];
    g_shapesList[g_shapesList.length - 1].vertices[3] = convert[1];

    var r = document.getElementById('red').value / 100;
    var g = document.getElementById('green').value / 100;
    var b = document.getElementById('blue').value / 100;
    g_shapesList[g_shapesList.length - 1].color = [r, g, b, 1.0];
    renderAllShapes();
    return;
  }
  if (customCircle != 0) {
    var convert = convertCoordinatesEventToGL(ev);
    if (customCircle == 1) {
      g_shapesList.push(new Circle());
      g_shapesList[g_shapesList.length - 1].segments = document.getElementById("segments").value;
      g_shapesList[g_shapesList.length - 1].position = convert;
      customCircle = 2;
    }

    var dist = 400 * Math.sqrt((convert[0] - g_shapesList[g_shapesList.length - 1].position[0])*(convert[0] - g_shapesList[g_shapesList.length - 1].position[0]) + (convert[1] - g_shapesList[g_shapesList.length - 1].position[1]) * (convert[1] - g_shapesList[g_shapesList.length - 1].position[1]));
    g_shapesList[g_shapesList.length - 1].size = dist;

    var r = document.getElementById('red').value / 100;
    var g = document.getElementById('green').value / 100;
    var b = document.getElementById('blue').value / 100;
    g_shapesList[g_shapesList.length - 1].color = [r, g, b, 1.0];
    renderAllShapes();
    return;
  }
  var point;
  if (curShape == 0) {
    point = new Point();
  } else if (curShape == 1) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = document.getElementById("segments").value;
  }

  point.position = convertCoordinatesEventToGL(ev);

  var r = document.getElementById('red').value / 100;
  var g = document.getElementById('green').value / 100;
  var b = document.getElementById('blue').value / 100;
  point.color = [r, g, b, 1.0];

  point.size = document.getElementById('size').value;
  g_shapesList.push(point);

  renderAllShapes();
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
  renderAllShapes();
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}