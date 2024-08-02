<template>
    <div class="root">
        <header class="tools">
            <div class="tools__left">
                <span
                    @click="onMark('upload')"
                    :class="['tools__left--item', isMarking === 'upload' && 'tools__left--actived']"
                >
                    <CloudUploadOutlined />
                    <span>上传 3d scanner</span>
                </span>
                <span
                    @click="onMark('plane')"
                    :class="['tools__left--item', isMarking === 'plane' && 'tools__left--actived']"
                >
                    <FormOutlined />
                    <span>剖面标注</span>
                </span>
                <span
                    @click="onMark('hole')"
                    :class="['tools__left--item', isMarking === 'hole' && 'tools__left--actived']"
                >
                    <ExclamationCircleOutlined />
                    <span>管孔标注</span>
                </span>
                <span class="tools__left--item">
                    <MinusCircleOutlined />
                    <span>孔径：</span>
                    <a-select
                        v-model:value="hole"
                        :options="circleHoleEnum"
                        style="width: 90px"
                        @change="handleChange"
                    />
                </span>
                <span
                    @click="onMark('ranging')"
                    :class="[
                        'tools__left--item',
                        isMarking === 'ranging' && 'tools__left--actived'
                    ]"
                >
                    <TagOutlined />
                    <span>测距</span>
                </span>
                <span @click="onMark('election')" class="tools__left--item">
                    <SplitCellsOutlined />
                    <span>生成立视图</span>
                </span>
                <span @click="onScreenshot" class="tools__left--item">
                    <CameraOutlined />
                    <span>快照</span>
                </span>
                <span @click="onSubmit" class="tools__left--item">
                    <SaveOutlined />
                    <span>提交</span>
                </span>
            </div>
            <div class="tools__right">
                <span
                    @click="onView('x')"
                    :class="['tools__left--item', viewType === 'x' && 'tools__left--actived']"
                >
                    <CodeSandboxOutlined />
                    <span>正视图</span>
                </span>
                <span
                    @click="onView('z')"
                    :class="['tools__left--item', viewType === 'z' && 'tools__left--actived']"
                >
                    <CodeSandboxOutlined />
                    <span>侧视图</span>
                </span>
                <span
                    @click="onView('y')"
                    :class="['tools__left--item', viewType === 'y' && 'tools__left--actived']"
                >
                    <CodeSandboxOutlined />
                    <span>俯视图</span>
                </span>
                <span @click="onView('reset')" class="tools__left--item">
                    <SyncOutlined />
                    <span>复位</span>
                </span>
                <span class="tools__left--item">
                    <MoreOutlined />
                </span>
            </div>
        </header>
        <div ref="webgl"></div>
    </div>
</template>
<!-- 移动端项目先在h5项目里边验证是否能正常渲染 -->

<script setup lang="ts">
import * as THREE from 'three';
import { ref, onMounted, onUnmounted } from 'vue';
import {
    FormOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    TagOutlined,
    SplitCellsOutlined,
    CloudUploadOutlined,
    CameraOutlined,
    SaveOutlined,
    CodeSandboxOutlined,
    SyncOutlined,
    MoreOutlined
} from '@ant-design/icons-vue';
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
    box3IsContainsPoint,
    removePlanes,
    rangingFn
} from 'twin/index';
import html2canvas from 'html2canvas';
import { circleHoleEnum, isExist } from './utils';
import UseHoleDrag from './useHoleDrag.js';
import UsePlaneDrag from './usePlaneDrag.js';
import './index.less';

const webgl = ref<HTMLDivElement>();
const isMarking = ref<string>(''); // 当前选中项
const viewType = ref<string>(''); // 视图方向

const twin = new CreateTwin();
const loader = new GLTFLoader();
const hole = ref<number>(175); // 管孔直径尺寸

let currentMesh: THREE.Mesh | null = null; // 当前的模型
let clickNum: number = 0; // 记录点击次数
let p1: THREE.Vector3 = null; // 起点坐标
let p2: THREE.Vector3 = null; // 终点坐标
let pageNum: number = 1; // 剖面的序号

let sphereEndDragList = []; // 剖面终点小球列表
let holeDragList = []; // 圆形管孔列表

const planeGroup = new THREE.Group(); // 一个独立的剖面标注组

let sphereStart: THREE.Object3D<THREE.Object3DEventMap>; // 起点小红点
let sphereEnd: THREE.Object3D<THREE.Object3DEventMap>; // 终点小红点

const planeParamsList = []; // 剖面参数列表
const holeParamsList = []; // 管孔参数列表

// 测距组
const rangingGroup = new THREE.Group();
let rangingP1 = null; // 测距起点坐标
let rangingP2 = null; // 测距终点坐标
let rangingClickNum = 0; // 测距点击次数
let rangingNum = 0; // 测距序号

UsePlaneDrag({ twin, sphereEndDragList, planeParamsList });
const { holeDragedList } = UseHoleDrag({ twin, holeDragList });

const handleChange: SelectProps['onChange'] = (val: number) => {
    hole.value = val;
};

// 加载gltf文件
loader.load('/图维建模数据/textured_output08.gltf', (gltf) => {
    const mesh = gltf.scene.children[0];
    currentMesh = mesh as THREE.Mesh;
    box3Center(mesh);
    mesh.name = '3d scanner 模型';
    twin.scene.add(mesh);
});

// 剖面标注
const onMark = (type: string) => {
    isMarking.value = type;
    viewType.value = '';
};

// 快照
const onScreenshot = () => {
    html2canvas(webgl.value, {
        width: window.innerWidth,
        height: window.innerHeight - 132,
        logging: false,
        useCORS: true,
        allowTaint: true // 跨域相关
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `${+new Date()}.png`;
        link.click();
    });
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
        (holeDragedList.value || holeParamsList).forEach((hole) => {
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

    console.log('paramsData', paramsData);
};

// 查看视图
const onView = (type: string) => {
    viewType.value = type;
    if (type === 'x') {
        twin.camera.position.set(2, 0, 0);
    } else if (type === 'z') {
        twin.camera.position.set(0, 0, 2);
    } else if (type === 'y') {
        twin.camera.position.set(0, 2, 0);
    } else if (type === 'reset') {
        twin.camera.position.set(2, 2, 2);
    }
    isMarking.value = '';
    twin.camera.lookAt(0, 0, 0);
};

// 画小圆点
const drawSphere = (point: THREE.Vector3, type: string) => {
    if (!point) {
        message.warn('请点击模型非空区域xx');
        return null;
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

// 射线拾取结果处理
const rayCasterPoint = (event: MouseEvent) => {
    const { point } = getRayCasterPoint(event, twin);
    if (point) {
        return point;
    } else {
        message.warn('请点击模型非空区域');
        return null;
    }
};

// 绘制剖面
const onDrewPlane = (event: MouseEvent) => {
    clickNum += 1;
    if (clickNum === 1) {
        const point = rayCasterPoint(event);
        if (!point) return;
        p1 = point;
        sphereStart = drawSphere(point, '起点坐标');
        const eventType = 'dblclick';
        planeGroup.name = `${eventType}-剖面标注组${pageNum}`;
        planeGroup.userData = {
            pageNum,
            eventType
        };
        planeGroup.add(sphereStart);
        twin.scene.add(planeGroup);
    } else {
        const point = rayCasterPoint(event);
        if (!point) return;
        p2 = point;
        if (p1 && p2) {
            // 画剖面
            const { length, width, depth } = drewRect(p1, p2, pageNum);
            sphereEnd = drawSphere(point, '终点坐标');
            const params = {
                p1,
                p2,
                pageNum,
                length,
                width,
                depth,
                holeList: [],
                sphereStart,
                sphereEnd
            };
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
    const point = rayCasterPoint(event);
    const ellipse = drewCircleHole(point, hole.value, _pageNum - 1);
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

// 测距功能点击生成红色小球
const rangingClick = (event: MouseEvent, rangingNum: number, type: string) => {
    const { point } = getRayCasterPoint(event, twin);
    if (!point) {
        return message.warn('请点击模型非空区域');
    }
    const sphere = createSphere(point, twin.camera);
    const _type = `${type}点坐标`;
    sphere.name = `测距-序号${rangingNum}-${_type}`;
    sphere.userData = {
        rangingNum,
        type: _type
    };
    rangingGroup.add(sphere);
    twin.scene.add(rangingGroup);
    return point;
};

// 测距功能
const onDreaRanging = (event: MouseEvent) => {
    rangingClickNum += 1;
    if (rangingClickNum === 1) {
        rangingP1 = rangingClick(event, rangingNum, '起');
    } else {
        rangingP2 = rangingClick(event, rangingNum, '终');

        if (rangingP1 && rangingP2) {
            const { line, size, delIcon } = rangingFn(rangingP1, rangingP2, rangingNum);
            rangingGroup.add(line, size, delIcon);
            rangingGroup.name = '测距组';
            twin.scene.add(rangingGroup);
            rangingNum += 1;
        }

        rangingClickNum = 0;
        rangingP1 = null;
        rangingP2 = null;
    }
};

// 取消
const onKeyDown = (event: { code: string }) => {
    if (['Escape'].includes(event.code)) {
        viewType.value = '';
    }
};

// 单击删除测距
const onClick = (event: MouseEvent) => {
    const { mesh } = getRayCasterPoint(event, twin);
    if (mesh.object.userData.type === '终点坐标') {
        twin.scene.traverse((obj) => {
            if (obj.userData.rangingNum === mesh.object.userData.rangingNum) {
                // rangingGroup.remove(obj);
                obj.visible = false;
            }
        });
    }
};

// 双击事件
const onDblClick = (event: MouseEvent) => {
    event.preventDefault();
    // event.button 枚举：0 代表左键，1 代表中键，2 代表右键；
    // 仅左键支持绘制，因为右键绘制和拖拽功能冲突;
    if (event.button !== 0) return;

    if (isMarking.value === 'plane') {
        // 剖面标注
        onDrewPlane(event);
    } else if (isMarking.value === 'hole') {
        // 圆形管孔标注
        onDrewHole(event);
    } else if (isMarking.value === 'ranging') {
        // 测距
        onDreaRanging(event);
    }

    // 最后记得重新渲染 canvas 画布
    css2RendererStyle(twin);
};

const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    const { point } = getRayCasterPoint(event, twin);

    // 移除实时创建的网格模型
    removePlanes(twin);
    if (p1 && point) {
        sphereEnd = drawSphere(point, '终点坐标');
        const { rect, sizeAC, sizeDB, sizeAD, sizeCB, pageNumber } = drewRect(p1, point, pageNum);

        planeGroup.add(sizeAC, sizeDB, sizeAD, sizeCB, pageNumber, rect, sphereStart, sphereEnd);
        sphereEndDragList.push(sphereEnd);
    }
};

document.addEventListener('keydown', onKeyDown);
twin.renderer.domElement.addEventListener('click', onClick);
twin.renderer.domElement.addEventListener('dblclick', onDblClick);
twin.renderer.domElement.addEventListener('mousemove', onMouseMove);

onMounted(() => {
    twin.renderer.setClearColor(0x444544);
    webgl.value.appendChild(twin.renderer.domElement);
    webgl.value.appendChild(twin.css2Renderer.domElement);
});

// 销毁全局变量，防止内存泄漏
const destroyGlobalVariable = () => {
    currentMesh = null;
    clickNum = 0;
    p1 = null;
    p2 = null;
    pageNum = null;
    sphereEndDragList = null;
    holeDragList = null;
    sphereStart = null;
    sphereEnd = null;
    rangingClickNum = 0;
    rangingP1 = null;
    rangingP2 = null;
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
