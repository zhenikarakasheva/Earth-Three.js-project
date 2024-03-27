import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const scene = new THREE.Scene();

//the earth
const geometry = new THREE.SphereGeometry(4, 64, 64);
const material = new THREE.MeshPhongMaterial({
  roughness: 1,
  metalness: 0,
  map: new THREE.TextureLoader().load("../texture/earthmap.jpg"),
  bumpMap: new THREE.TextureLoader().load("../texture/earthbump.jpg"),
  bumpScale: 0.2,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//the clouds
const cloudGeometry = new THREE.SphereGeometry(4.3, 64, 64);
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load("../texture/earthCloud.png"),
  transparent: true,
});

const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudMesh);

//the sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//the light
let light = new THREE.AmbientLight(0xffffff, 1, 100);
light.position.set(1, 10, 10);
scene.add(light);

//the camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

//the canvas + its renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//on each resizing event the object gets rezised accordingly
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const constrols = new OrbitControls(camera, canvas);
constrols.enableDamping = true;
constrols.enablePan = false;
constrols.enableZoom = false; //disable zooming
constrols.autoRotate = true; //enable autorotating
constrols.autoRotateSpeed = 2; //autorotation speed

const loop = () => {
  constrols.update(); //update the controls
  renderer.render(scene, camera); //render the scene again
  window.requestAnimationFrame(loop);
};
loop();

const timeline = gsap.timeline({ defaults: { duration: 1 } });
timeline.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: -1, y: 1 });
timeline.fromTo("nav", { y: "-100%" }, { y: "0%" });
timeline.fromTo(".title", { opacity: 0 }, { opacity: 1 });

let changedLight = false;

document.getElementById("lightUp").addEventListener("click", function (e) {
  if (!changedLight || light.intensity <= 0) {
    changedLight = true;
    light.intensity += 2;
  }
});

document.getElementById("lightDown").addEventListener("click", function (e) {
  if (light.intensity > 0) {
    light.intensity -= 2;
  }
});
