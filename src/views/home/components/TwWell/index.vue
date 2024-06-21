<template>
    <div class="tools">
        <div
            @click="onPlaneMark"
            :style="{
                background: planeMarkIng ? '#ddd' : 'rgba(255, 255, 255, 0.4)'
            }"
        >
            剖面标注:
            {{ planeMarkIng ? '结束' : '开始' }}
        </div>
    </div>
    <div ref="webgl"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { ref, onMounted, onUnmounted } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
    CreateTwin,
    box3Center,
    getRayCasterPoint,
    createSphere,
    createRectPoints,
    drawRectWithFourPoints,
    css2RendererStyle,
    drewRect
} from 'twin/index';
import './index.less';

const webgl = ref<HTMLDivElement>();
const planeMarkIng = ref<boolean>(true);

const twin = new CreateTwin();
const loader = new GLTFLoader();

let clickNum: number = 0; //记录点击次数
let p1: THREE.Vector3 = null; // 起点坐标
let p2: THREE.Vector3 = null; // 终点坐标
let rectLine: THREE.Object3D = null; // 矩形剖面线条
let pageNum: number = 1; // 剖面的序号

// 加载gltf文件
loader.load('/图维建模数据/textured_output08.gltf', (gltf) => {
    const mesh = gltf.scene.children[0];
    box3Center(mesh);
    twin.scene.add(mesh);
});

// 剖面标注
const onPlaneMark = () => {
    planeMarkIng.value = !planeMarkIng.value;
};

// 画小圆点
const drawSphere = (point, type) => {
    if (!point) {
        clickNum = 0;
        return console.warn('请点击网格模型区域');
    }
    const sphere = createSphere(point, twin.camera);
    sphere.name = `剖面序号${pageNum}-${type}点坐标`;
    twin.scene.add(sphere);
};

const onKeyDown = (event) => {
    if (['Escape'].includes(event.code)) {
        onPlaneMark();
    }
};

const onDblClick = (event) => {
    event.preventDefault();
    // event.button 枚举：0 代表左键，1 代表中键，2 代表右键；
    // 仅左键支持绘制，因为右键绘制和拖拽功能冲突;
    if (event.button !== 0) return;
    if (planeMarkIng.value) {
        clickNum += 1;
        if (clickNum === 1) {
            const point = getRayCasterPoint(event, twin);
            p1 = point;
            drawSphere(point, '起');
        } else {
            const point = getRayCasterPoint(event, twin);
            p2 = point;
            drawSphere(point, '终');

            if (p1 && p2) {
                // 画剖面
                const { rect, sizeAC, sizeDB, sizeAD, sizeCB, pageNumber } = drewRect(
                    p1,
                    p2,
                    pageNum
                );

                twin.scene.add(sizeAC, sizeDB, sizeAD, sizeCB, pageNumber, rect);
                pageNum += 1;
            }
            clickNum = 0;
            p1 = null;
            p2 = null;
        }

        css2RendererStyle(twin);
    }
};

const onMouseMove = (event) => {
    event.preventDefault();
    if (!planeMarkIng.value) {
        clickNum = 0; // 重置点击次数
        return;
    }
    const point = getRayCasterPoint(event, twin);
    // remove rectLine 避免重复绘制，这行代码很重要
    if (rectLine) {
        twin.scene.remove(rectLine);
    }
    if (p1 && point) {
        const points = createRectPoints(p1, point);
        rectLine = drawRectWithFourPoints(points, '移动');
        twin.scene.add(rectLine);
    }
};

document.addEventListener('keydown', onKeyDown);
twin.renderer.domElement.addEventListener('dblclick', onDblClick);
twin.renderer.domElement.addEventListener('mousemove', onMouseMove);

onMounted(() => {
    twin.renderer.setClearColor(0x444544);
    webgl.value.appendChild(twin.renderer.domElement);
    webgl.value.appendChild(twin.css2Renderer.domElement);
});

//  销毁全局变量，防止内存泄漏
const destroyGlobalVariable = () => {
    clickNum = null;
    p1 = null;
    p2 = null;
    rectLine = null;
    pageNum = null;
};

onUnmounted(() => {
    destroyGlobalVariable();
    document.removeEventListener('keydown', onKeyDown);
    twin.renderer.domElement.removeEventListener('dblclick', onDblClick);
    twin.renderer.domElement.removeEventListener('mousemove', onMouseMove);
});
</script>
