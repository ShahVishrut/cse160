// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color

  const v1 = new Vector3([2.25,2.25,0]);
  drawVector(v1, "red");
}

function drawVector(v, color) {
  ctx.strokeStyle = color;
  const x0 = canvas.width/2;
  const y0 = canvas.height/2;
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0 + 20 * v.elements[0], y0 - 20 * v.elements[1]);
  ctx.stroke();
}

function handleDrawEvent() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  const x1 = document.getElementById("xv1").value;
  const y1 = document.getElementById("yv1").value;
  const v1 = new Vector3([x1,y1,0]);
  const x2 = document.getElementById("xv2").value;
  const y2 = document.getElementById("yv2").value;
  const v2 = new Vector3([x2,y2,0]);
  drawVector(v1, "red");
  ctx.beginPath();
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  const x1 = document.getElementById("xv1").value;
  const y1 = document.getElementById("yv1").value;
  const v1 = new Vector3([x1,y1,0]);
  const x2 = document.getElementById("xv2").value;
  const y2 = document.getElementById("yv2").value;
  const v2 = new Vector3([x2,y2,0]);
  const s = document.getElementById("scalar").value;
  drawVector(v1, "red");
  ctx.beginPath();
  drawVector(v2, "blue");
  ctx.beginPath();
  const selection = document.getElementById("operation").value;

  if (selection == "add") {
    v1.add(v2);
    drawVector(v1, "green");
  } else if (selection == "subtract") {
    v1.sub(v2);
    drawVector(v1, "green");
  } else if (selection == "divide") {
    v1.div(s);
    v2.div(s);
    drawVector(v1, "green");
    drawVector(v2, "green");
  } else if (selection == "multiply") {
    v1.mul(s);
    v2.mul(s);
    drawVector(v1, "green");
    drawVector(v2, "green");
  } else if (selection == "magnitude") {
    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());
  } else if (selection == "normalize") {
    v1.normalize();
    v2.normalize();
    drawVector(v1, "green");
    drawVector(v2, "green");
  } else if (selection == "angle") {
    console.log("Angle: " + angleBetween(v1, v2));
  } else if (selection == "area") {
    console.log("Area of the triangle: " + areaTriangle(v1, v2));
  }
}

function angleBetween(v1, v2) {
  var angle = Vector3.dot(v1, v2);
  angle /= v1.magnitude();
  angle /= v2.magnitude();
  angle = Math.acos(angle);
  angle *= 180;
  angle /= Math.PI;
  return angle;
}

function areaTriangle(v1, v2) {
  const v3 = Vector3.cross(v1, v2);
  return v3.magnitude() / 2;
}