<template>
    <div ref="raycasterDom"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { model, mesh1, mesh2, mesh3 } from './model.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const raycasterDom = ref(null);

const width = computed(() => {
    return window.innerWidth - 174;
});
const height = computed(() => {
    return window.innerHeight - 136;
});
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
const camera = new THREE.PerspectiveCamera(30, width.value / height.value, 1, 3000);
camera.position.set(350, 250, 300);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio); //防止输出模糊
renderer.setSize(width.value, height.value);

// 相机轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {
    renderer.render(scene, camera);
});

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', () => {
    renderer.setSize(width.value, height.value);
    camera.aspect = width.value / height.value;
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

onMounted(() => {
    renderer.setClearColor(0x444544, 0.4);
    raycasterDom.value?.appendChild(renderer.domElement);
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

// window.addEventListener('click', (event) => {
//     const px = event.offsetX;
//     const py = event.offsetY;

//     // 屏幕坐标px,py 转标设备坐标x，y
//     // width和height 表示canvas 画布宽高度

//     const x = (px / width.value) * 2 - 1;
//     const y = -(py / height.value) * 2 + 1;
//     console.log('x, y============', x, y);
// });

renderer.domElement.addEventListener('click', (event) => {
    // 1、屏幕坐标转为标准设备坐标
    const px = event.offsetX;
    const py = event.offsetY;
    const x = (px / width.value) * 2 - 1;
    const y = -(py / height.value) * 2 + 1;

    // 计算射线方法
    // 创建一个射线投射器 raycaster
    const raycaster = new THREE.Raycaster();
    // .setFromCamera() 计算射线投射器的射线属性.ray
    // 形象点说就是在点击位置创建一条射线，用来选中拾取模型对象
    raycaster.setFromCamera(new THREE.Vector3(x, y), camera);
    // interscctObjects 对参数中的网格模型对象进行射线交叉计算
    const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3]);
    if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000);
    }
});
</script>
