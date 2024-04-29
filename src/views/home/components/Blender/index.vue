<template>
    <div ref="webgl"></div>
    <div class="pos">
        <div id="px" class="bu">X轴正</div>
        <div id="nx" class="bu">X轴负</div>
        <div id="y" class="bu">y轴</div>
        <div id="pz" class="bu">z轴正</div>
        <div id="nz" class="bu">z轴负</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const webgl = ref(null);
const scene = new THREE.Scene();

const loader = new GLTFLoader();

const width = computed(() => {
    return window.innerWidth - 196;
});

const height = computed(() => {
    return window.innerHeight - 136;
});

loader.load('/图维建模数据/textured_output14.gltf', (gltf) => {
    scene.add(gltf.scene);

    const mesh = gltf.scene.children[0];

    // 计算模型的边界，以便找到模型的中心点
    const box = new THREE.Box3().setFromObject(mesh);
    // 计算边界中心并创建一个新的中心点向量
    const center = new THREE.Vector3();
    box.getCenter(center);
    // 将模型的位置设置为其当前位置减去计算出的中心点
    mesh.position.sub(center);

    renderer.render(scene, camera);
});

// max
// 0.44912999868392944
// 0.19499999284744263
// 0.6837999820709229

// min
// -1.0529999732971191
// -0.618939995765686
// -0.6411600112915039

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(30, width.value / height.value, 1, 3000);
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width.value, height.value);
renderer.render(scene, camera);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function () {
    renderer.render(scene, camera);
});

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', () => {
    renderer.setSize(width.value, height.value);
    camera.aspect = width.value / height.value;
    renderer.render(scene, camera);
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

onMounted(() => {
    webgl.value.appendChild(renderer.domElement);

    // 通过UI按钮改变相机观察角度
    document.getElementById('px').addEventListener('click', () => {
        camera.position.set(5, 0, 0);
        camera.lookAt(0, 0, 0); //重新计算相机视线方向
        renderer.render(scene, camera);
    });
    document.getElementById('nx').addEventListener('click', () => {
        camera.position.set(-5, 0, 0);
        camera.lookAt(0, 0, 0); //重新计算相机视线方向
        renderer.render(scene, camera);
    });

    document.getElementById('y').addEventListener('click', () => {
        camera.position.set(0, 5, 0); //y轴方向观察
        camera.lookAt(0, 0, 0); //重新计算相机视线方向
        renderer.render(scene, camera);
    });

    document.getElementById('pz').addEventListener('click', () => {
        camera.position.set(0, 0, 5); //z轴方向观察
        camera.lookAt(0, 0, 0); //重新计算相机视线方向
        renderer.render(scene, camera);
    });
    document.getElementById('nz').addEventListener('click', () => {
        camera.position.set(0, 0, -5); //z轴方向观察
        camera.lookAt(0, 0, 0); //重新计算相机视线方向
        renderer.render(scene, camera);
    });
});
</script>

<style scoped>
.pos {
    position: absolute;
    left: 200px;
    top: 200px;
}
.bu {
    background: rgba(255, 255, 255, 0.1);
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    border-radius: 30px;
}

.bu:hover {
    cursor: pointer;
}
</style>
