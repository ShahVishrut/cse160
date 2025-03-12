// Desk Lamp by Pookage Hayes [CC-BY] via Poly Pizza
// TIME HOTEL 4.01 by S. Paul Michael [CC-BY] via Poly Pizza

import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    if (this.pickedObject) {
      this.pickedObject.visible = true;
      this.pickedObject = undefined;
    }
 
    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      if ((time * 8) % 2 > 1) {
        this.pickedObject.visible = false;
      } else {
        this.pickedObject.visible = true;
      }
    }
  }
}

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 2;

const scene = new THREE.Scene();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const sphere_geo = new THREE.SphereGeometry(1);
const chair_geo = new THREE.CylinderGeometry(2,1.5,1.5);
const umbrella_geo = new THREE.CylinderGeometry(0.3,0.3,1.6,32,1,true);
const pencil_geo = new THREE.CylinderGeometry(0.05,0.05,1.6);
const pencil_shave = new THREE.ConeGeometry(0.05,0.15);

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

const color = 0x5DDB51;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const amb_color = 0xFFFFFF;
const amb_intensity = 1;
const amb_light = new THREE.AmbientLight(amb_color, amb_intensity);
scene.add(amb_light);

const spot_color = 0xFFFFFF;
const spot_intensity = 150;
const spot_light = new THREE.SpotLight(spot_color, spot_intensity);
spot_light.position.set(0, 5, -3);
spot_light.target.position.set(0, 0, 0);
spot_light.angle = 0.4;
scene.add(spot_light);
scene.add(spot_light.target);

const planeSize = 40;
 
const loader = new THREE.TextureLoader();
const texture = loader.load('resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);
{
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
  mtlLoader.load('resources/models/lamp.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    
    objLoader.load('resources/models/lamp.obj', (root) => {
      root.scale.set(4,4,4);
      root.position.z = -4;
      root.position.y = 4.8;
      scene.add(root);
    });
});
}

{
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
mtlLoader.load('resources/models/umbrella.mtl', (mtl) => {
  mtl.preload();
  objLoader.setMaterials(mtl);
  
  objLoader.load('resources/models/umbrella.obj', (root) => {
    root.scale.set(0.5,0.5,0.5);
    root.rotation.x = 0.2;
    root.position.z = 7.2;
    root.position.y = 1.5;
    scene.add(root);
  });
});
}

{
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        'resources/images/cubemaps/sky-right.bmp',
        'resources/images/cubemaps/sky-left.bmp',
        'resources/images/cubemaps/sky-top.bmp',
        'resources/images/cubemaps/sky-bottom.bmp',
        'resources/images/cubemaps/sky-front.bmp',
        'resources/images/cubemaps/sky-back.bmp',
      ]);
    scene.background = texture;
  }

  {
    const fog_color = 0xFFFFFF;  // white
    const fog_near = 1;
    const fog_far = 40;
    scene.fog = new THREE.Fog(fog_color, fog_near, fog_far);
  }

  const rubik = makeRubik(geometry);
  rubik.position.y = 3.5;
  

  const desk_face = makeInstance(geometry, 0xE016DA);
  desk_face.scale.set(4.4,0.5,11);
  desk_face.position.y = 2;
  const rtWidth = 512;
  const rtHeight = 512;
  const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
  const rtFov = 75;
  const rtAspect = rtWidth / rtHeight;
  const rtNear = 0.1;
  const rtFar = 5;
  const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera.position.z = 2;
  
  const rtScene = new THREE.Scene();
  rtScene.background = new THREE.Color('red');
  const rtCubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
  ];
  const material1 = new THREE.MeshPhongMaterial({
    map: renderTarget.texture,
  });
  rtScene.add(rtCubes[0]);
  rtScene.add(rtCubes[1]);
  rtScene.add(rtCubes[2]);
  const cube1 = new THREE.Mesh(geometry, material1);
  cube1.position.y = 2;
  cube1.position.x = -8;
  scene.add(cube1);

  const desk_centerleg = makeInstance(geometry, 0xE016DA);
  desk_centerleg.scale.set(0.3,2,0.3);
  desk_centerleg.position.x = -2;
  desk_centerleg.position.y = 1;

  const desk_centerleg2 = makeInstance(geometry, 0xE016DA);
  desk_centerleg2.scale.set(0.3,2,0.3);
  desk_centerleg2.position.x = 2;
  desk_centerleg2.position.y = 1;

  const desk_toplleg = makeInstance(geometry, 0xE016DA);
  desk_toplleg.scale.set(0.3,2,0.3);
  desk_toplleg.position.x = -2;
  desk_toplleg.position.z = -5;
  desk_toplleg.position.y = 1;

  const desk_toprleg = makeInstance(geometry, 0xE016DA);
  desk_toprleg.scale.set(0.3,2,0.3);
  desk_toprleg.position.x = -2;
  desk_toprleg.position.z = 5;
  desk_toprleg.position.y = 1;

  const desk_botrleg = makeInstance(geometry, 0xE016DA);
  desk_botrleg.scale.set(0.3,2,0.3);
  desk_botrleg.position.x = 2;
  desk_botrleg.position.z = 5;
  desk_botrleg.position.y = 1;

  const desk_botlleg = makeInstance(geometry, 0xE016DA);
  desk_botlleg.scale.set(0.3,2,0.3);
  desk_botlleg.position.x = 2;
  desk_botlleg.position.z = -5;
  desk_botlleg.position.y = 1;

  const crystal_ball = makeInstance(sphere_geo, 0xC0C0C0);
  crystal_ball.position.y = 2;

  const chair = makeInstance(chair_geo, 0xF54254);
  chair.position.x = 5;
  chair.position.y = 0.75;

  const umbrella_bin = makeInstance(umbrella_geo, 0xC0C0C0);
  umbrella_bin.position.z = 7;
  umbrella_bin.position.y = 0.5;

  const pencil_yellow = makeInstance(pencil_geo, 0xDFAB3F);
  pencil_yellow.position.z = 3;
  pencil_yellow.position.y = 2.3;
  pencil_yellow.rotation.z = 1.571;

  const eraser_pink = makeInstance(pencil_geo, 0xEB5A8D);
  eraser_pink.scale.set(1,0.05,1);
  eraser_pink.position.z = 3;
  eraser_pink.position.y = 2.3;
  eraser_pink.position.x = 0.84;
  eraser_pink.rotation.z = 1.571;

  const pencil_wooden = makeInstance(pencil_shave, 0xDAA696);
  pencil_wooden.position.z = 3;
  pencil_wooden.position.y = 2.3;
  pencil_wooden.position.x = -0.875;
  pencil_wooden.rotation.z = 1.571;

  const sofa_seat = makeInstance(geometry, 0x324CA8);
  sofa_seat.scale.set(5,0.7,8);
  sofa_seat.position.y = 0.85;
  sofa_seat.position.x = -8;

  const sofa_lhandle = makeInstance(geometry, 0x324CA8);
  sofa_lhandle.scale.set(6,2,1);
  sofa_lhandle.position.y = 0.85;
  sofa_lhandle.position.x = -8.5;
  sofa_lhandle.position.z = -4;

  const sofa_rhandle = makeInstance(geometry, 0x324CA8);
  sofa_rhandle.scale.set(6,2,1);
  sofa_rhandle.position.y = 0.85;
  sofa_rhandle.position.x = -8.5;
  sofa_rhandle.position.z = 4;

  const sofa_back = makeInstance(geometry, 0x324CA8);
  sofa_back.scale.set(1,5,7);
  sofa_back.position.y = 0.85;
  sofa_back.position.x = -11;

  const sofa_cushion = makeInstance(geometry, 0x324CA8);
  sofa_cushion.scale.set(4.5, 0.8, 3.3);
  sofa_cushion.position.y = 1.2;
  sofa_cushion.position.x = -8.5;
  sofa_cushion.position.z = -1.7;

  const sofa_cushion2 = makeInstance(geometry, 0x324CA8);
  sofa_cushion2.scale.set(4.5, 0.8, 3.3);
  sofa_cushion2.position.y = 1.2;
  sofa_cushion2.position.x = -8.5;
  sofa_cushion2.position.z = 1.7;

  const pickHelper = new PickHelper();

  const pickPosition = {x: 0, y: 0};
  clearPickPosition();
 
function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}
 
function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
}
 
function clearPickPosition() {
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}
 
window.addEventListener('mousemove', setPickPosition);
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);

requestAnimationFrame(render);

function render(time) {
    time *= 0.001;  // convert time to seconds
   
    rubik.rotation.x = time;
    rubik.rotation.y = time;
    rtCubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });
   
    // draw render target scene to render target
    renderer.setRenderTarget(renderTarget);
    renderer.render(rtScene, rtCamera);
    renderer.setRenderTarget(null);
   
    pickHelper.pick(pickPosition, scene, camera, time);
    renderer.render(scene, camera);
   
    requestAnimationFrame(render);
}

function makeRubik(geometry) {
    const loader = new THREE.TextureLoader();

    const materials = [
        new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/cubemaps/rubik-1.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/cubemaps/rubik-2.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/cubemaps/rubik-3.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/cubemaps/rubik-4.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/cubemaps/rubik-5.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/cubemaps/rubik-6.png')}),
      ];
   
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
   
    return cube;

    function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }
}

function makeInstance(geometry, color, position = 0) {
  const material = new THREE.MeshPhongMaterial({color});
  material.side = THREE.DoubleSide;
 
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = position;
 
  return cube;
}


