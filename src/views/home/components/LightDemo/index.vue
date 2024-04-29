<template>
    <div ref="lightDom"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import model from './model.js';
import gui from './gui.js';
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

// gui控制环境光光照强度`.intensity`
gui.add(ambientLight, 'intensity', 0, 2).name('环境光.intensity');

const dirHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dirHelper);
// 平行光子菜单
const dirFolder = gui.addFolder('平行光');
dirFolder.add(directionalLight, 'intensity', 0, 2);
dirFolder.add(directionalLight.position, 'y', 0, 300).onChange(function (value) {
    dirHelper.update();
});
const obj = {
    R: 100,
    angle: 0
};
dirFolder.add(obj, 'R', 0, 300).onChange(function (value) {
    directionalLight.position.x = value * Math.cos(obj.angle);
    directionalLight.position.z = value * Math.sin(obj.angle);
    dirHelper.update();
});
dirFolder.add(obj, 'angle', 0, Math.PI * 2).onChange(function (value) {
    directionalLight.position.x = obj.R * Math.cos(value);
    directionalLight.position.z = obj.R * Math.sin(value);
    dirHelper.update();
});

// mapSize属性默认 512x512
// console.log('阴影默认像素', directionalLight.shadow.mapSize);
// directionalLight.shadow.mapSize.set(128, 128);
directionalLight.shadow.mapSize.set(1024, 1024);

// 模糊弱化阴影边缘
// console.log('.shadow.radius', directionalLight.shadow.radius); // 1
// directionalLight.shadow.radius = 3;

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

// 阴影子菜单
const shadowFolder = gui.addFolder('平行光阴影');
const cam = directionalLight.shadow.camera;
// 相机left、right等属性变化执行.updateProjectionMatrix();
// 相机变化了，执行CameraHelper的更新方法.update();
shadowFolder.add(cam, 'left', -500, 0).onChange(function (v) {
    cam.updateProjectionMatrix(); //相机更新投影矩阵
    cameraHelper.update(); //相机范围变化了，相机辅助对象更新
});
shadowFolder.add(cam, 'right', 0, 500).onChange(function (v) {
    cam.updateProjectionMatrix();
    cameraHelper.update();
});
shadowFolder.add(cam, 'top', 0, 500).onChange(function (v) {
    cam.updateProjectionMatrix();
    cameraHelper.update();
});
shadowFolder.add(cam, 'bottom', -500, 0).onChange(function (v) {
    cam.updateProjectionMatrix();
    cameraHelper.update();
});
shadowFolder.add(cam, 'far', 0, 1000).onChange(function (v) {
    cam.updateProjectionMatrix();
    cameraHelper.update();
});

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

// 模型表面产生条纹影响渲染效果，可以改变.shadowMap.type默认值优化
renderer.shadowMap.type = THREE.VSMShadowMap;

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
