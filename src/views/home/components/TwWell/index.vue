<template>
    <div class="tools">
        <div
            @click="onMark"
            :style="{
                background: planeMarkIng ? '#ddd' : 'rgba(255, 255, 255, 0.4)'
            }"
        >
            剖面标注:
            {{ planeMarkIng ? '结束' : '开始' }}
        </div>
        <div
            @click="onMark"
            :style="{
                background: holeMarkIng ? '#ddd' : 'rgba(255, 255, 255, 0.4)'
            }"
        >
            圆形管孔标注:
            {{ holeMarkIng ? '结束' : '开始' }}
        </div>
        <a-select
            v-model:value="hole"
            :options="circleHoleEnum"
            style="width: 100px"
            @change="handleChange"
        />

        <br />
        <a-button @click="onSubmit">提 交</a-button>
    </div>
    <div ref="webgl"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { ref, onMounted, onUnmounted } from 'vue';
import { message, type SelectProps } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
    CreateTwin,
    box3Center,
    getRayCasterPoint,
    createSphere,
    css2RendererStyle,
    drewRect,
    drewCircleHole,
    average,
    box3IsContainsPoint
} from 'twin/index';
import { circleHoleEnum, isExist } from './utils';
import UseHoleDrag from './useHoleDrag.js';
import UsePlaneDrag from './usePlaneDrag.js';
import './index.less';

const webgl = ref<HTMLDivElement>();
const planeMarkIng = ref<boolean>(true); // 剖面标注
const holeMarkIng = ref<boolean>(false); // 管孔标注

const twin = new CreateTwin();
const loader = new GLTFLoader();
const hole = ref<number>(175); // 管孔直径尺寸

let clickNum: number = 0; // 记录点击次数
let p1: THREE.Vector3 = null; // 起点坐标
let p2: THREE.Vector3 = null; // 终点坐标
let pageNum: number = 1; // 剖面的序号

let sphereEndDragList = []; // 剖面终点小球列表
let holeDragList = []; // 圆形管孔列表

const planeGroup = new THREE.Group(); // 一个独立的剖面标注组

let sphereStart; // 起点小红点
let sphereEnd; // 终点小红点

const planeParamsList = []; // 剖面参数列表
const holeParamsList = []; // 管孔参数列表

UsePlaneDrag({ twin, sphereEndDragList, planeParamsList });
const { holeDragedList } = UseHoleDrag({ twin, holeDragList });

const handleChange: SelectProps['onChange'] = (val: number) => {
    hole.value = val;
};

// 加载gltf文件
loader.load('/图维建模数据/textured_output08.gltf', (gltf) => {
    const mesh = gltf.scene.children[0];
    box3Center(mesh);
    mesh.name = '3d scanner 模型';
    twin.scene.add(mesh);
});

// 剖面标注
const onMark = () => {
    planeMarkIng.value = !planeMarkIng.value;
    holeMarkIng.value = !holeMarkIng.value;
};

const onSubmit = () => {
    const length = Math.ceil(average(planeParamsList, 'length'));
    const depth = Math.ceil(average(planeParamsList, 'depth'));
    const width = Math.ceil(average(planeParamsList, 'width'));

    // 剖面列表
    planeParamsList.forEach((plane) => {
        // holeParamsList 是双击创建的初始数据
        // holeDragedList.value 是拖拽之后生成的最新位置的数据
        // 循环遍历的时候用最新的数据
        holeDragedList.value.forEach((hole) => {
            // 管孔列表
            const isContain = box3IsContainsPoint(plane, hole, twin);
            if (isContain && !isExist(plane.holeList, hole)) {
                plane.holeList.push(hole);
            }
        });
    });

    const paramsData = {
        modelPropertyMap: {
            wellLength: length,
            wellWidth: width,
            wellDepth: depth
        },
        facadeDataList: cloneDeep(planeParamsList)
    };

    console.log('paramsData', paramsData.facadeDataList);
};

// 画小圆点
const drawSphere = (point: THREE.Vector3, type: string) => {
    if (!point) {
        clickNum = 0;
        return console.warn('请点击网格模型区域');
    }
    const sphere = createSphere(point, twin.camera);
    const eventType = 'drag';
    sphere.name = `${eventType}-剖面序号${pageNum}-${type}`;
    sphere.userData = {
        pageNum,
        type,
        eventType
    };
    return sphere;
};

const onKeyDown = (event: { code: string }) => {
    if (['Escape'].includes(event.code)) {
        onMark();
    }
};

// 绘制剖面
const onDrewPlane = (event: MouseEvent) => {
    clickNum += 1;
    if (clickNum === 1) {
        const point = getRayCasterPoint(event, twin);
        p1 = point;
        sphereStart = drawSphere(point, '起点坐标');
        planeGroup.add(sphereStart);
        const eventType = 'dblclick';
        planeGroup.name = `${eventType}-剖面标注组${pageNum}`;
        planeGroup.userData = {
            pageNum,
            eventType
        };
        twin.scene.add(planeGroup);
    } else {
        const point = getRayCasterPoint(event, twin);
        p2 = point;
        if (p1 && p2) {
            // 画剖面
            const { length, width, depth } = drewRect(p1, p2, pageNum);
            sphereEnd = drawSphere(point, '终点坐标');

            const params = { p1, p2, pageNum, length, width, depth, holeList: [] };
            planeParamsList.push(params);

            pageNum += 1;
        }
        clickNum = 0;
        p1 = null;
        p2 = null;
    }
};

// 绘制管孔
const onDrewHole = (event: MouseEvent) => {
    const _pageNum = pageNum;
    const point = getRayCasterPoint(event, twin);

    const ellipse = drewCircleHole(point, hole.value, _pageNum - 1, message);
    ellipse.name = `剖面序号${_pageNum - 1}-管孔直径${ellipse.userData.hole}`;
    if (!ellipse) return;
    holeDragList.push(ellipse);

    const holeParams = {
        hole: hole.value,
        point,
        mesh: ellipse
    };

    holeParamsList.push(cloneDeep(holeParams)); // 深拷贝之后就不能修改管孔颜色了
    twin.scene.add(ellipse);
};

// 双击事件
const onDblClick = (event: MouseEvent) => {
    event.preventDefault();
    // event.button 枚举：0 代表左键，1 代表中键，2 代表右键；
    // 仅左键支持绘制，因为右键绘制和拖拽功能冲突;
    if (event.button !== 0) return;

    // 剖面标注
    planeMarkIng.value && onDrewPlane(event);

    // 圆形管孔标注
    holeMarkIng.value && onDrewHole(event);

    // 最后记得重新渲染 canvas 画布
    css2RendererStyle(twin);
};

const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    const point = getRayCasterPoint(event, twin);
    if (!planeMarkIng.value || !point) {
        clickNum = 0; // 重置点击次数
        console.warn('请点击网格模型区域');
        return;
    }

    sphereEnd = drawSphere(point, '终点坐标');

    // 移除实时创建的网格模型
    twin.scene.traverse((item: any) => {
        // 移除双击创建的网格模型
        if (item.isGroup) {
            let groupedByName: any = {};
            // 把拖拽的同一个剖面标注的数据放在同一个数组
            item.children.forEach((el: any) => {
                const sName = el.name.slice(0, 10);
                if (!groupedByName[sName]) {
                    groupedByName[sName] = [];
                }

                groupedByName[sName].push(el);
            });

            // 从同一个数组中删除最后一次滚动之前的数据，保留最后一次拖拽的剖面标注数据
            for (const key in groupedByName) {
                if (Object.prototype.hasOwnProperty.call(groupedByName, key)) {
                    const record = groupedByName[key];
                    const startRecord = record.slice(0, record.length - 8);
                    item.remove(...startRecord);
                }
            }
        }
    });

    if (p1 && point) {
        const { rect, sizeAC, sizeDB, sizeAD, sizeCB, pageNumber } = drewRect(p1, point, pageNum);

        planeGroup.add(sizeAC, sizeDB, sizeAD, sizeCB, pageNumber, rect, sphereStart, sphereEnd);
        sphereEndDragList.push(sphereEnd);
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

// 销毁全局变量，防止内存泄漏
const destroyGlobalVariable = () => {
    clickNum = 0;
    p1 = null;
    p2 = null;
    pageNum = null;
    sphereEndDragList = null;
    holeDragList = null;
    sphereStart = null;
    sphereEnd = null;
};

onUnmounted(() => {
    destroyGlobalVariable();
    document.removeEventListener('keydown', onKeyDown);
    twin.renderer.domElement.removeEventListener('dblclick', onDblClick);
    twin.renderer.domElement.removeEventListener('mousemove', onMouseMove);
});

// 创建辅助坐标轴
// const axesHelper = new THREE.AxesHelper(80);
// twin.scene.add(axesHelper);
</script>
