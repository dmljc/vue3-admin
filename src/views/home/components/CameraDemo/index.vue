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

// 透视投影相机
const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(40, 122, 390);
camera.lookAt(0, 0, 0);

// 正投影相机
// const width = window.innerWidth - 296;
// const height = window.innerHeight - 136;
// const k = width / height;
// // 根据包围盒大小调整s，包围盒y方向 尺寸的一半左右
// const s = 4;
// const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 8000);
// // 与观察点x、y一样，地图平行与canvas画布
// const x = 113.51,
//     y = 33.88;
// camera.position.set(x, y, 300);
// camera.lookAt(x, y, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);

// 相机轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(x, y, 0); // 与lookAt参数保持一致
// controls.update(); // update()函数内会执行camera.lookAt(controls.target)

controls.addEventListener('change', () => {
    renderer.render(scene, camera);
});

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', () => {
    const width = window.innerWidth - 296;
    const height = window.innerHeight - 136;
    // 1. WebGL渲染器渲染的Cnavas画布尺寸更新
    renderer.setSize(width, height);
    camera.aspect = width / height;
    // 2.1.更新相机参数
    // canvas画布宽高比会影响left, right需要跟着更新
    // const k = width / height; //canvas画布宽高比
    // camera.left = -s * k;
    // camera.right = s * k;
    // 2.2.相机的left, right等属性变化了，通知threejs系统
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
let angle = 0;
let R = 100;
const render = () => {
    // 相机圆周运动
    angle += 0.01;
    camera.position.x = R * Math.cos(angle);
    camera.position.z = R * Math.sin(angle);
    // 相机直线运动动画
    // camera.position.z -= 0.2;

    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};
render();
</script>
