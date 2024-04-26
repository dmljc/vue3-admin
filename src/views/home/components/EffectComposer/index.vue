<template>
    <div ref="effectComposer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { model, mesh, mesh2, mesh3 } from './model.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

const effectComposer = ref(null);
// 场景
const scene = new THREE.Scene();

scene.add(model);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

// 灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 60, 50);
scene.add(directionalLight);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 相机
const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
// camera.position.set(40, 122, 390);
camera.position.set(292, 223, 185);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio); //防止输出模糊
renderer.setSize(width, height);

// 创建后处理对象EffectComposer，WebGL渲染器作为参数
const composer = new EffectComposer(renderer);
// 创建一个渲染器通道，场景和相机作为参数
const renderPass = new RenderPass(scene, camera);
// 设置renderPass通道
composer.addPass(renderPass);

// 创建OutlinePass通道,显示模型外轮廓边框
const v2 = new THREE.Vector2(window.innerWidth - 296, window.innerHeight - 136);
// 创建OutlinePass通道，第一个参数v2的尺寸和canvas画布保持一致
const outlinePass = new OutlinePass(v2, scene, camera);
//设置需要高亮发光描边的模型对象
outlinePass.selectedObjects = [mesh];
// 设置OutlinePass通道
composer.addPass(outlinePass);

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
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

onMounted(() => {
    renderer.setClearColor(0x444544, 0.4);
    effectComposer.value?.appendChild(renderer.domElement);
});

onUnmounted(() => {
    renderer.dispose();
});

// 渲染循环
const render = () => {
    // 使用后处理模块EffectComposer，可通过该对象的render方法调用渲染器的render方法
    composer.render();
    // renderer.render(scene, camera);
    requestAnimationFrame(render);
};
render();
</script>
