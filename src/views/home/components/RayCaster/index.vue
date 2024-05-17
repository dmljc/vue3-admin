<template>
    <div ref="well"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { message } from 'ant-design-vue';
// 引入CSS2模型对象CSS2DObject
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { group, boxMesh } from './model.js';

const well = ref(null);

const width = computed(() => {
    return window.innerWidth - 174;
});
const height = computed(() => {
    return window.innerHeight - 136;
});
// 场景
const scene = new THREE.Scene();

scene.add(group);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(500);
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
camera.position.set(1000, 1000, 1000);
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
    well.value?.appendChild(renderer.domElement);
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

// 添加点击事件监听
function onClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 将鼠标位置转换成归一化设备坐标(-1 到 +1)
    mouse.x = (event.clientX / width.value) * 2 - 1;
    mouse.y = -(event.clientY / height.value) * 2 + 1;

    // 使用鼠标位置和相机进行射线投射
    raycaster.setFromCamera(mouse, camera);

    // 计算物体和射线的交点
    const intersects = raycaster.intersectObjects(scene.children);

    // 如果有交点，输出信息
    if (intersects.length > 0) {
        const pointList = [];
        intersects.forEach((item) => {
            pointList.push(item.point);
        });

        console.log('pointlistt=====', pointList.length, pointList);

        const material = new THREE.LineBasicMaterial({
            color: 0xff0000
        });
        const geometry = new THREE.BufferGeometry().setFromPoints(pointList);

        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }
}

// 监听鼠标点击事件
renderer.domElement.addEventListener('click', onClick, false);
</script>

<style scoped>
#tag {
    width: 40px;
    height: 40px;
    background-color: red;
    border-radius: 100%;
}
</style>
