<template>
    <div id="UvTexture"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { onMounted } from 'vue';
import { mesh, texture } from './mesh.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 场景
const scene = new THREE.Scene();

scene.add(mesh);

// 辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// 添加一个辅助网格地面
const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
scene.add(gridHelper);

// 环境光
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.decay = 0.0; //光源光照强度不随距离改变衰减
pointLight.position.set(400, 200, 300);
scene.add(pointLight);

// 渲染器和相机
const width = 1300;
const height = 700;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(292, 223, 185);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
// controls.update();

// 监听鼠标、键盘事件
controls.addEventListener('change', function () {
    // mesh.rotateY(0.01);
    renderer.render(scene, camera);
});

// 渲染循环
function render() {
    texture.offset.x += 0.1; //设置纹理动画
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();

onMounted(() => {
    document.getElementById('UvTexture')?.appendChild(renderer.domElement);
});
</script>
