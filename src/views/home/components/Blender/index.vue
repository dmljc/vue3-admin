<template>
    <div ref="webgl"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const webgl = ref(null);
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(40, 40, 40);
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('/earth.jpg');
const material = new THREE.MeshLambertMaterial({
    map: texture,
    // color: 0xffffff
});
const mesh = new THREE.Mesh(geometry, material);


// const loader = new GLTFLoader();

// loader.load('/gltf.gltf', (gltf) => {
//     console.log('===========gltf====>', gltf.scene);
//     scene.add(gltf.scene);
// });


scene.add(mesh); 

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight); 

const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(292, 223, 185); 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height); 
renderer.render(scene, camera); 

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function () {
    renderer.render(scene, camera);
});

renderer.setClearColor(0x444544, 1);

const gui = new GUI();
const obj = {
    x: 0,
    y: 0,
    z: 0,
    color: 0x00ff00,
};

gui.add(obj, 'x', 0, 200).onChange((val) => {
    mesh.position.x = val;
    renderer.render(scene, camera);
});
gui.add(obj, 'y', 0, 200).onChange((val) => {
    mesh.position.y = val;
    renderer.render(scene, camera);
});
gui.add(obj, 'z', 0, 200).onChange((val) => {
    mesh.position.z = val;
    renderer.render(scene, camera);
});

gui.addColor(obj, 'color').onChange((val) => {
    mesh.material.color.set(val);
    renderer.render(scene, camera);
});

gui.domElement.style.top = '112px';
gui.domElement.style.right = '48px';




onMounted(() => {
    renderer.render(scene, camera); 
    webgl.value.appendChild(renderer.domElement);
});
</script>
