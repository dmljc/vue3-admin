<template>
    <div ref="curve"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import model from './model.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const curve = ref(null);
// 场景
const scene = new THREE.Scene();

scene.add(model);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

// 灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(100, 60, 50);
scene.add(directionalLight);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 相机
const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(40, 122, 390);
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

// 禁止右键平移
// controls.enablePan = false;
// 禁止缩放
// controls.enableZoom = false;
// 禁止旋转
// controls.enableRotate = false;

// 上下旋转设置为90度
controls.maxPolarAngle = Math.PI / 2;

// 左右旋转范围
controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4;

// 相机位置与目标观察点距离
const dis = controls.getDistance();
console.log('dis', dis); // 410
controls.minDistance = 200;
controls.maxDistance = 300;

controls.addEventListener('change', () => {
    // 相机位置与目标观察点距离
    const dis = controls.getDistance();
    console.log('change--dis', dis);
});

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', () => {
    const w = window.innerWidth - 296;
    const h = window.innerHeight - 136;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

onMounted(() => {
    // renderer.setClearColor(0x444544, 0.4);
    curve.value.appendChild(renderer.domElement);
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
