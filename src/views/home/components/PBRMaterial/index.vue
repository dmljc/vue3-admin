<template>
    <div ref="webgl"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import model from './clearcoat';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const webgl = ref(null);
// 场景
const scene = new THREE.Scene();
scene.add(model);

// const cubeTexture = new THREE.CubeTextureLoader()
//     .setPath('/环境贴图/环境贴图1/')
//     .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
// scene.environment = cubeTexture;

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(30);
scene.add(axesHelper);

// 灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(30, 30, 30);
scene.add(directionalLight);

// 平行光辅助器
// const direcLightHelper = new THREE.DirectionalLightHelper(directionalLight, 4, 0xff0000);
// scene.add(direcLightHelper);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 相机
const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(40.0, 40.0, 40.0);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);

// 相机轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {
    renderer.render(scene, camera);
});

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', () => {
    const w = window.innerWidth - 296;
    const h = window.innerHeight - 136;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // renderer.render(scene, camera);
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

onMounted(() => {
    // 设置 Canvas 背景颜色和官网demo一致。
    renderer.setClearColor(0x444544, 1);
    // renderer.render(scene, camera);
    webgl.value.appendChild(renderer.domElement);
});

onUnmounted(() => {
    renderer.dispose();
});

// 渲染循环
const render = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};
render();
</script>
