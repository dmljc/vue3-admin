<template>
    <div class="tools">
        <div @click="onPlaneMark">
            剖面标注:
            {{ planeMarkIng ? '结束' : '开始' }}
        </div>
    </div>
    <div ref="webgl"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {
    CreateTwin,
    box3Center,
    getRayCasterPoint,
    createSphere,
    createRectPoints,
    drawRectWithFourPoints,
    // createMarkLength,
    getDistance,
} from 'twin/index';

const webgl = ref<HTMLDivElement>();
const planeMarkIng = ref<boolean>(false);

const twin = new CreateTwin();
const loader = new GLTFLoader();

let clickNum: number = 0; //记录点击次数
let p1: THREE.Vector3 = null;
let p2: THREE.Vector3 = null;
let distance: string = null; // 两点之间的距离
let rectLine: THREE.Object3D; // 矩形剖面线条

// 加载gltf文件
loader.load('/图维建模数据/textured_output08.gltf', (gltf) => {
    const mesh = gltf.scene.children[0];
    box3Center(mesh);
    twin.scene.add(mesh);
    twin.renderOnce();
});

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(2);
twin.scene.add(axesHelper);

// 剖面标注
const onPlaneMark = () => {
    planeMarkIng.value = !planeMarkIng.value;
};

// 画小圆点
const drawSphere = (point) => {
    if (!point) {
        return console.warn('请点击网格模型区域');
    }
    const sphere = createSphere(point, twin.camera);
    twin.scene.add(sphere);
};

const onKeyDown = (event) => {
    // console.log('code====', event.code);
    // Escape: Esc 键
    if (['Escape'].includes(event.code)) {
        // planeMarkIng.value = false;
        onPlaneMark();
    }
};

const css2RendererStyle = () => {
    twin.css2Renderer.domElement.style.position = 'absolute';
    twin.css2Renderer.domElement.style.top = '100px';
    twin.css2Renderer.domElement.style.border = '10px solod red';
    twin.css2Renderer.domElement.style.pointerEvents = 'none';
};

const onMouseDown = (event) => {
    event.preventDefault();
    if (planeMarkIng.value) {
        clickNum += 1;
        if (clickNum === 1) {
            const point = getRayCasterPoint(event, twin);
            p1 = point;
            drawSphere(point);
        } else {
            const point = getRayCasterPoint(event, twin);
            p2 = point;
            drawSphere(point);

            if (p1 && p2) {
                distance = getDistance(p1, p2);

                const points = createRectPoints(p1, p2);
                const line = drawRectWithFourPoints(points);
                twin.scene.add(line);

                // const sizeMesh = createMarkLength(points[0], points[1], distance);
                // twin.scene.add(sizeMesh);

                css2RendererStyle();

            }
            clickNum = 0;
            p1 = null;
            p2 = null;
        }
    }
};

const onMouseMove = (event) => {
    event.preventDefault();
    const point = getRayCasterPoint(event, twin);
    if (rectLine) {
        twin.scene.remove(rectLine);
    }
    if (p1 && point) {
        const points = createRectPoints(p1, point);
        rectLine = drawRectWithFourPoints(points);
        twin.scene.add(rectLine);

        // console.log('p2', point);
    }
};

document.addEventListener('keydown', onKeyDown);
twin.renderer.domElement.addEventListener('mousedown', onMouseDown);
twin.renderer.domElement.addEventListener('mousemove', onMouseMove);

onMounted(() => {
    webgl.value.appendChild(twin.renderer.domElement);
    twin.renderer.setClearColor(0x444544);
});

onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown);
    twin.renderer.domElement.removeEventListener('mousedown', onMouseDown);
    twin.renderer.domElement.removeEventListener('mousemove', onMouseMove);
});
</script>

<style lang="less" scoped>
.tools {
    position: absolute;
    left: 200px;
    top: 200px;

    div {
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        border-radius: 100%;
        background: v-bind("planeMarkIng ? '#ddd' : 'rgba(255, 255, 255, 0.4)'");

        &:hover {
            cursor: pointer;
        }
    }
}
</style>