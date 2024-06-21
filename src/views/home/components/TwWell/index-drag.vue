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
import * as THREE from 'three';
import { ref, onMounted, onUnmounted } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import {
    CreateTwin,
    box3Center,
    getRayCasterPoint,
    createSphere,
    createRectPoints,
    drawRectWithFourPoints,
    createMarkLength,
    getDistance,
    css2RendererStyle
    // removeDblClicCreateRect,
} from 'twin/index';

const webgl = ref<HTMLDivElement>();
const planeMarkIng = ref<boolean>(true);

const twin = new CreateTwin();
const loader = new GLTFLoader();

let clickNum: number = 0; //记录点击次数
let p1: THREE.Vector3 = null;
let p2: THREE.Vector3 = null;
let rectLine: THREE.Object3D = null; // 矩形剖面线条

let pageNum = 1;

// let sizeAC;
// let sizeDB;
// let sizeAD;
// let sizeCB;

// let dragStartPoint = null;
// let dragEndPoint = null;
// let dragList = [];

// let dragRectLine = null;

// 剖面标注组，包含：矩形4条边和4条边对应的尺寸
// let planeMarkGroup = new THREE.Group();

// 加载gltf文件
loader.load('/图维建模数据/textured_output08.gltf', (gltf) => {
    const mesh = gltf.scene.children[0];
    box3Center(mesh);
    twin.scene.add(mesh);
});

// 辅助观察坐标系
// const axesHelper = new THREE.AxesHelper(2);
// twin.scene.add(axesHelper);

// 剖面标注
const onPlaneMark = () => {
    planeMarkIng.value = !planeMarkIng.value;
};

// 边界场景处理
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
                // 画矩形
                const points = createRectPoints(p1, p2);
                const rectLine = drawRectWithFourPoints(points, '双击');

                // 逆时针顺序解构出对应的4个顶点
                const [A, D, B, C] = points;
                // 长
                const sizeAC = createMarkLength(A, C, getDistance(A, C));
                const sizeDB = createMarkLength(D, B, getDistance(D, B));
                // 宽
                const sizeAD = createMarkLength(A, D, getDistance(A, D));
                const sizeCB = createMarkLength(C, B, getDistance(C, B));

                twin.scene.add(sizeAC, sizeDB, sizeAD, sizeCB, rectLine);
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

// twin.renderer.domElement.addEventListener('mousedown', () => {
//     twin.scene.traverse((item) => {
//         if (item.name.includes(`剖面序号`)) {
//             dragList.push(item);
//         }
//     });
// });

// // 拖放控制器
// const dragControls = new DragControls(dragList, twin.camera, twin.renderer.domElement);

// // 拖拽开始
// dragControls.addEventListener('dragstart', (e) => {
//     twin.controls.enabled = false;
//     const curName = e.object.name.split('-')[0];
//     // 找到当前页面的起点坐标
//     const curPageStartPoint = dragList.filter((el) => {
//         if (el.name.includes(`${curName}-起点坐标`)) {
//             return el;
//         }
//     });
//     dragStartPoint = curPageStartPoint?.[0]?.position;

//     p1 = null;
//     p2 = null;
//     rectLine = null;
//     twin.scene.remove(rectLine);
// });

// 拖拽中
// dragControls.addEventListener('drag', (e) => {
//     dragEndPoint = e.object.position;

//     if (dragRectLine) {
//         twin.scene.remove(dragRectLine);
//     }

//     // if (sizeAC || sizeDB || sizeAD || sizeCB) {
//     //     twin.scene.remove(sizeAC, sizeDB, sizeAD, sizeCB);
//     // }

//     if (dragStartPoint && dragEndPoint) {

//         const points = createRectPoints(dragStartPoint, dragEndPoint);
//         dragRectLine = drawRectWithFourPoints(points, '拖拽');

//         // 销毁掉双击创建的剖面标注
//         removeDblClicCreateRect(twin);

//         // 逆时针顺序解构出对应的4个顶点
//         const [A, D, B, C] = points;
//         // 长
//         sizeAC = createMarkLength(A, C, getDistance(A, C));
//         sizeDB = createMarkLength(D, B, getDistance(D, B));
//         // 宽
//         sizeAD = createMarkLength(A, D, getDistance(A, D));
//         sizeCB = createMarkLength(C, B, getDistance(C, B));

//         twin.scene.add(sizeAC, sizeDB, sizeAD, sizeCB, dragRectLine);

//         twin.renderOnce();
//     }
// });

// 拖拽结束
// dragControls.addEventListener('dragend', () => {
//     twin.controls.enabled = true;
//     drawSphere(dragStartPoint, '起');
//     drawSphere(dragEndPoint, '终');
//     twin.renderOnce();
// });

document.addEventListener('keydown', onKeyDown);
twin.renderer.domElement.addEventListener('dblclick', onDblClick);
twin.renderer.domElement.addEventListener('mousemove', onMouseMove);

onMounted(() => {
    twin.renderer.setClearColor(0x444544);
    webgl.value.appendChild(twin.renderer.domElement);
    webgl.value.appendChild(twin.css2Renderer.domElement);
});

onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown);
    twin.renderer.domElement.removeEventListener('dblclick', onDblClick);
    twin.renderer.domElement.removeEventListener('mousemove', onMouseMove);
    clickNum = 1;
    rectLine = null;
    // dragRectLine = null;
    // dragStartPoint = null;
    // dragEndPoint = null;
    // dragList = [];
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
