<template>
    <div ref="canvas"></div>
    <div class="pos">
        <div id="red" class="bu" @click="changeColor(0xff0000)">红</div>
        <div id="green" class="bu" @click="changeColor(0x00ff00)" style="margin-left: 10px">绿</div>
    </div>

    <button id="download" @click="onDownload">下载</button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
// import model from './model';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = ref(null);
// 场景
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(6, 6, 6);
const material = new THREE.MeshStandardMaterial({
    color: 0x0000ff
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// 灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(20, 20, 20);
scene.add(directionalLight);

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
    antialias: true,
    // alpha: true,
    // 想把canvas画布上内容下载到本地，需要设置为true
    preserveDrawingBuffer: true
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

const onDownload = () => {
    // 创建一个超链接元素，用来下载保存数据的文件
    const link = document.createElement('a');
    const canvas = renderer.domElement; // 获取canvas对象
    // 通过超链接herf属性，设置要保存到文件中的数据
    link.href = canvas.toDataURL('image/png');
    link.download = 'threejs.png'; // 下载文件名
    link.click(); // js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
};

onMounted(() => {
    // 设置 Canvas 背景颜色和官网demo一致。
    renderer.setClearColor(0x444544, 0.4);
    // renderer.setClearAlpha(0.5);
    canvas.value.appendChild(renderer.domElement);
    // js 方案改变材质颜色
    // document.getElementById("red").addEventListener('click', function(){
    //     mesh.material.color.set(0xff0000);
    // });
    // document.getElementById("green").addEventListener('click', function(){
    //     mesh.material.color.set(0x00ff00);
    // });

    // 鼠标单击id为download的HTML元素，threejs渲染结果以图片形式下载到本地
    document.getElementById('download').addEventListener('click', function () {
        onDownload();
    });
});

// vue方案改变材质颜色
const changeColor = (color: number) => {
    mesh.material.color.set(color);
};

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

<style lang="less" scoped>
.bu {
    background: rgba(255, 255, 255, 0.1);
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    display: inline-block;
    border-radius: 30px;
}

.bu:hover {
    cursor: pointer;
    background: #aaa;
}

.pos {
    position: absolute;
    left: 52%;
    bottom: 100px;
}
</style>
