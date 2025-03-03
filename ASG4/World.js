// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;

  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec4 a_ModelMatrix0;
  attribute vec4 a_ModelMatrix1;
  attribute vec4 a_ModelMatrix2;
  attribute vec4 a_ModelMatrix3;
  attribute vec4 a_NormalMatrix0;
  attribute vec4 a_NormalMatrix1;
  attribute vec4 a_NormalMatrix2;
  attribute vec4 a_NormalMatrix3;
  attribute vec4 a_BaseColor;
  attribute float a_TexColorWeight0;
  attribute float a_TexColorWeight1;
  attribute vec3 a_Normal;

  varying vec2 v_UV;
  varying vec4 v_BaseColor;
  varying float v_TexColorWeight0;
  varying float v_TexColorWeight1;
  varying vec3 v_NormalDir;
  varying vec3 v_LightDir;
  varying vec3 v_EyeDir;
  varying vec3 v_SpotDir;
  varying float v_SpotIntensity;

  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform vec4 u_LightPos;
  uniform vec3 u_CameraPos;
  uniform vec4 u_SpotPos;
  uniform vec3 u_SpotNormal;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3) * a_Position;
    v_NormalDir = normalize(vec3(mat4(a_NormalMatrix0, a_NormalMatrix1, a_NormalMatrix2, a_NormalMatrix3) * vec4(a_Normal, 0)));
    v_LightDir = normalize(vec3(u_LightPos - mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3) * a_Position));
    v_EyeDir = normalize(u_CameraPos - vec3(mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3) * a_Position));

    v_SpotDir = normalize(vec3(u_SpotPos - mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3) * a_Position));
    v_SpotIntensity = floor(dot((-1.0 * v_SpotDir), u_SpotNormal) * 0.6667 - 0.5) + 1.0;
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
  varying vec3 v_NormalDir;
  varying vec3 v_LightDir;
  varying vec3 v_EyeDir;
  varying vec3 v_SpotDir;
  varying float v_SpotIntensity;

  varying float v_TexColorWeight0;
  varying float v_TexColorWeight1;

  uniform vec4 u_LightColor;
  uniform vec4 u_SpotColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;

  uniform bool u_NormalVisualization;

  void main() {
    if (u_NormalVisualization) {
      gl_FragColor = vec4(v_NormalDir, 1.0);
    } else {
      vec4 color = (1.0 - v_TexColorWeight0 - v_TexColorWeight1) * v_BaseColor + v_TexColorWeight0 * texture2D(u_Sampler0, v_UV) + v_TexColorWeight1 * texture2D(u_Sampler1, v_UV);
      vec4 diffuse = (0.6 * color) * u_LightColor * max(0.0, dot(v_NormalDir, v_LightDir));
      vec4 specular = u_LightColor * pow(max(0.0, dot(2.0 * dot(v_LightDir, v_NormalDir) * v_NormalDir - v_LightDir, v_EyeDir)), 3.0);
      vec4 ambient = (0.4 * color) * u_LightColor;
      vec4 spot_diffuse = (0.6 * color) * (v_SpotIntensity * u_SpotColor) * max(0.0, dot(v_NormalDir, v_SpotDir));
      vec4 spot_specular = (v_SpotIntensity * u_SpotColor) * pow(max(0.0, dot(2.0 * dot(v_SpotDir, v_NormalDir) * v_NormalDir - v_SpotDir, v_EyeDir)), 3.0);
      vec4 spot_ambient = (0.4 * color) * (v_SpotIntensity * u_SpotColor);
      gl_FragColor = vec4(vec3(diffuse + specular + ambient + spot_diffuse + spot_specular + spot_ambient), color[3]);
    }
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
let a_NormalMatrix0;
let a_NormalMatrix1;
let a_NormalMatrix2;
let a_NormalMatrix3;
let a_BaseColor;
let a_TexColorWeight0;
let a_TexColorWeight1;
let a_Normal;

let u_ProjectionMatrix;
let u_ViewMatrix;
let u_LightPos;
let u_CameraPos;
let u_LightColor;
let u_SpotColor;
let u_SpotNormal;
let u_SpotPos;
let u_Sampler0;
let u_Sampler1;
let u_NormalVisualization;

let g_shapesList = [];
let map;
let map_pos;

let light_pos = [0, 0, 9, 1];
let light_color = [1.0, 1.0, 1.0, 1.0];
let light_active = true;
let spotlight_pos = [5.0,6.0,7.0,1];
let spot_active = true;
let normal_visualization = false;
let light_animation = true;

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

  a_NormalMatrix0 = gl.getAttribLocation(gl.program, 'a_NormalMatrix0');
  if (!a_NormalMatrix0) {
    console.log('Failed to get the storage location of a_NormalMatrix0');
    return;
  }

  a_NormalMatrix1 = gl.getAttribLocation(gl.program, 'a_NormalMatrix1');
  if (!a_NormalMatrix1) {
    console.log('Failed to get the storage location of a_NormalMatrix1');
    return;
  }

  a_NormalMatrix2 = gl.getAttribLocation(gl.program, 'a_NormalMatrix2');
  if (!a_NormalMatrix2) {
    console.log('Failed to get the storage location of a_NormalMatrix2');
    return;
  }

  a_NormalMatrix3 = gl.getAttribLocation(gl.program, 'a_NormalMatrix3');
  if (!a_NormalMatrix3) {
    console.log('Failed to get the storage location of a_NormalMatrix3');
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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (!a_Normal) {
    console.log('Failed to get the storage location of a_Normal');
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

  u_LightPos = gl.getUniformLocation(gl.program, 'u_LightPos');
  if (!u_LightPos) {
    console.log('Failed to get the storage location of u_LightPos');
    return;
  }

  u_CameraPos = gl.getUniformLocation(gl.program, 'u_CameraPos');
  if (!u_CameraPos) {
    console.log('Failed to get the storage location of u_CameraPos');
    return;
  }

  u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  if (!u_LightColor) {
    console.log('Failed to get the storage location of u_LightColor');
    return;
  }

  u_SpotColor = gl.getUniformLocation(gl.program, 'u_SpotColor');
  if (!u_SpotColor) {
    console.log('Failed to get the storage location of u_SpotColor');
    return;
  }

  u_SpotPos = gl.getUniformLocation(gl.program, 'u_SpotPos');
  if (!u_SpotPos) {
    console.log('Failed to get the storage location of u_SpotPos');
    return;
  }

  u_SpotNormal = gl.getUniformLocation(gl.program, 'u_SpotNormal');
  if (!u_SpotNormal) {
    console.log('Failed to get the storage location of u_SpotNormal');
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

  u_NormalVisualization = gl.getUniformLocation(gl.program, 'u_NormalVisualization');
  if (!u_NormalVisualization) {
    console.log('Failed to get the storage location of u_NormalVisualization');
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
  light_color[0] = document.getElementById("light_r").value / 255;
  light_color[1] = document.getElementById("light_g").value / 255;
  light_color[2] = document.getElementById("light_b").value / 255;

  document.onkeydown = keydown;

  document.getElementById("normal").addEventListener("click", function(){ normal_visualization = !normal_visualization; gl.uniform1i(u_NormalVisualization, normal_visualization);});
  document.getElementById("light_animation").addEventListener("click", function(){ light_animation = !light_animation; });
  document.getElementById("light_r").addEventListener("input", function(){ light_color[0] = document.getElementById("light_r").value / 255;});
  document.getElementById("light_g").addEventListener("input", function(){ light_color[1] = document.getElementById("light_g").value / 255;});
  document.getElementById("light_b").addEventListener("input", function(){ light_color[2] = document.getElementById("light_b").value / 255;});
  document.getElementById("light_pos").addEventListener("input", function(){ light_pos[0] = document.getElementById("light_pos").value; light_pos[1] = document.getElementById("light_pos").value;});
  document.getElementById("point_light").addEventListener("click", function() { light_active = !light_active});
  document.getElementById("spot_light").addEventListener("click", function() { spot_active = !spot_active});

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
 
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  addShapes();
  requestAnimationFrame(tick);
}

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

  let sphere = new Sphere();
  sphere.color = [1,0,0,1.0];
  sphere.matrix.translate(25,25,3);
  sphere.matrix.rotate(180,1,0,0);
  g_shapesList.push(sphere);

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
  gl.uniform4fv(u_LightPos, new Float32Array(light_pos));
  gl.uniform3fv(u_CameraPos, new Float32Array(camera.eye.elements));
  if (light_active) {
    gl.uniform4fv(u_LightColor, new Float32Array(light_color));
  } else {
    gl.uniform4fv(u_LightColor, new Float32Array([0.0,0.0,0.0,1.0]));
  }
  if (spot_active) {
    gl.uniform4fv(u_SpotColor, new Float32Array([1.0,1.0,1.0,1.0]));
  } else {
    gl.uniform4fv(u_SpotColor, new Float32Array([0.0,0.0,0.0,1.0]));
  }  
  gl.uniform4fv(u_SpotPos, new Float32Array(spotlight_pos));
  gl.uniform3fv(u_SpotNormal, new Float32Array([0.2, 0.2, -1.0]));

  let light_cube = new Cube();
  light_cube.matrix.translate(light_pos[0], light_pos[1], light_pos[2]);
  light_cube.prepareRender();

  let spot_light = new Cube();
  spot_light.matrix.translate(spotlight_pos[0],spotlight_pos[1],spotlight_pos[2]);
  spot_light.matrix.rotate(90, 1, 1, 0);
  spot_light.color = [1.0,1.0,0,1];
  spot_light.prepareRender();

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
  Aggregate.renderAll();

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
  } else if (ev.keyCode == 37) {
    camera.panLeft();
  } else if (ev.keyCode == 39) {
    camera.panRight();
  } else if (ev.keyCode == 38) {
    camera.panUp();
  } else if (ev.keyCode == 40) {
    camera.panDown();
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
  }
}


var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;
function tick() {
  g_seconds=performance.now()/1000.0-g_startTime;
  if (light_animation) {
    if (Math.floor(g_seconds / 8) % 2 == 0) {
      light_pos[0] = 4 * (g_seconds % 8);
      light_pos[1] = 4 * (g_seconds % 8);
    } else {
      light_pos[0] = 32 - 4 * (g_seconds % 8);
      light_pos[1] = 32 - 4 * (g_seconds % 8);
    }
    light_pos[1] = (light_pos[1] + 1.3) % 51;
  } 

  renderScene();

  requestAnimationFrame(tick);
}