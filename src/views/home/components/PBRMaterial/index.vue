<template>
    <div ref="webgl"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import model from './model';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const webgl = ref(null);
const scene = new THREE.Scene();
scene.add(model);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(-340, 212, 91);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function () {
    renderer.render(scene, camera);
});

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', () => {
    const w = window.innerWidth - 296;
    const h = window.innerHeight - 136;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    renderer.render(scene, camera);
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

onMounted(() => {
    // 设置 Canvas 背景颜色和官网demo一致。
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x444544, 1);
    renderer.render(scene, camera);
    webgl.value.appendChild(renderer.domElement);
});
</script>
