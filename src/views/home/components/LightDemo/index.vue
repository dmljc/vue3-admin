<template>
    <div ref="lightDom"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import model from './model.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const lightDom = ref(null);
// 场景
const scene = new THREE.Scene();
scene.add(model);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(200, 160, 150);
scene.add(directionalLight);

// 2、平行光设置产生阴影的光源对象，开启光源阴影的计算功能
directionalLight.castShadow = true;

// 5、设置三维场景计算阴影的范围
directionalLight.shadow.camera.left = -50 * 6;
directionalLight.shadow.camera.right = 50 * 6;
directionalLight.shadow.camera.top = 200 * 2;
directionalLight.shadow.camera.bottom = -100 * 2;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 400 * 10;

// 可视化平行光阴影对应的正投影相机对象
const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(cameraHelper);

// const spotLight = new THREE.SpotLight(0xffffff, 1.0);
// scene.add(spotLight);
// spotLight.angle = Math.PI / 6;
// spotLight.decay = 0.0;
// spotLight.position.set(0, 50, 0);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xff0000);
// scene.add(spotLightHelper);

// spotLight.target是一个模型对象Object3D，默认在坐标原点
// spotLight.target.position.set(50, 0, 0);
//spotLight.target添加到场景中.target.position才会起作用
// scene.add(spotLight.target);

// 相机
const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
// camera.position.set(40, 122, 390);
camera.position.set(153, 697, 676);
camera.lookAt(0, 0, 0);

// webgl 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);
// 防止输出模糊
renderer.setPixelRatio(window.devicePixelRatio);
// 4、设置渲染器，允许光源阴影渲染
renderer.shadowMap.enabled = true;

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
    // renderer.setClearColor(0x444544, 0.4);
    lightDom.value?.appendChild(renderer.domElement);
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
