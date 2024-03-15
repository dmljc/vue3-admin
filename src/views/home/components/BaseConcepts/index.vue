<template>
    <div id="container"></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 创建3D场景对象Scene
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(30, 30, 30);
const material = new THREE.MeshLambertMaterial({
    color: 0xff0000
});

// 创建网格模型，参数是几何体和材质对象，表示生活中的一个物体
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
scene.add(mesh);

// 添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff0000, 1);
pointLight.position.set(60, 0, 0);

scene.add(pointLight);

// 点光源辅助观察
const pointLightHelper = new THREE.PointLightHelper(pointLight, 4, 0xff0000);
scene.add(pointLightHelper);

// 创建透视投影相机
const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 8000);
camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);

// 创建3D渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);
renderer.render(scene, camera);

// 创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(80);
scene.add(axesHelper);

// 创建轨道控制器 OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// 监听鼠标，键盘事件
controls.addEventListener('change', () => {
    renderer.render(scene, camera);
});

// 动画
// const renderFn = () => {
//     // mesh.rotateY(0.06);
//     renderer.render(scene, camera);
//     requestAnimationFrame(renderFn);
// };

// renderFn();

// Gui 控制三维场景的UI交互界面
const gui = new GUI();
const obj = {
    x: 0,
    y: 0,
    z: 0,
    color: 0x00ffff,
    translate: 0,
    bool: false
};

// 生成颜色值改变的交互界面
gui.addColor(obj, 'color')
    .name('材质颜色')
    .onChange((value) => {
        mesh.material.color.set(value);
    });

const lightFolfer = gui.addFolder('光源');

lightFolfer.add(ambientLight, 'intensity', 0, 2).name('环境光强度').step(0.1);
lightFolfer.add(pointLight, 'intensity', 0, 2).name('点光源强度').step(0.1);

// 重新定义网格模型的位置
gui.add(obj, 'x', 0, 180).onChange((value) => {
    mesh.position.x = value;
});
gui.add(obj, 'y', 0, 180).onChange((value) => {
    mesh.position.y = value;
});
gui.add(obj, 'z', 0, 180).onChange((value) => {
    mesh.position.z = value;
});

// 平移
// gui.add(obj, 'translate', [-100, 0, 100]).name('沿Y轴移动').onChange((value) => {
//     mesh.position.y = value;
// });
// gui.add(obj, 'translate', {
//     // left: -100, center: 0, right: 100
//     左: -100,
//     中: 0,
//     右: 100
// }).name('沿X轴移动').onChange((value) => {
//     mesh.position.x = value;
// })

// 单选 radio
// gui.add(obj, 'bool').name('是否沿Y轴旋转60度').onChange((value) => {
//     mesh.rotateY(value ? 60 : -60);
// });

gui.domElement.style.top = '112px';
gui.domElement.style.right = '48px';

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', () => {
    const w = window.innerWidth - 296;
    const h = window.innerHeight - 136;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

// 设置 Canvas 背景颜色和官网demo一致。
renderer.setClearColor(0x444544, 1);

onMounted(() => {
    document.getElementById('container')?.appendChild(renderer.domElement);
    renderer.render(scene, camera);
});
</script>
<style scoped lang="less">
#container {
    width: calc(100vw - 280px);
    height: 100%;
}
</style>
