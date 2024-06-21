<template>
    <div ref="webgl"></div>
    <div class="pos">
        <div id="measure" class="bu measure" @click="onSeasure">剖面标注</div>
        <div id="measure" class="bu measure2" @click="onSeasure2">管控标注</div>

        <a-select
            v-model:value="hole"
            :options="options"
            style="width: 100px"
            @change="handleChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import type { SelectProps } from 'ant-design-vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import UseModel from './useModel.js';
import { createRectPoints } from '../../../../../twin';

const webgl = ref(null);
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const isMeasure = ref<boolean>(false);
const isMeasure2 = ref<boolean>(false);
const point1 = ref();
const point2 = ref();
const hole = ref<number>(200); // 管孔直径
const dragHole = ref();

const width = window.innerWidth - 170;
const height = window.innerHeight - 130;

loader.load('/图维建模数据/textured_output08.gltf', (gltf) => {
    // loader.load('/工厂建模数据/工厂.gltf', (gltf) => {
    const mesh = gltf.scene.children[0];
    // // 计算模型的边界，以便找到模型的中心点
    const box = new THREE.Box3().setFromObject(mesh);
    // // 计算边界中心并创建一个新的中心点向量
    const center = new THREE.Vector3();
    box.getCenter(center);
    // // 将模型的位置设置为其当前位置减去计算出的中心点
    mesh.position.sub(center);

    scene.add(gltf.scene);
    render();
});

const options = ref<SelectProps['options']>([
    {
        value: 50,
        label: '50mm'
    },
    {
        value: 100,
        label: '100mm'
    },
    {
        value: 150,
        label: '150mm'
    },
    {
        value: 175,
        label: '175mm'
    },
    {
        value: 200,
        label: '200mm'
    },
    {
        value: 300,
        label: '300mm'
    }
]);
const handleChange: SelectProps['onChange'] = (value) => {
    console.log('value', value);
};

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
camera.position.set(2, 0, 0);
camera.lookAt(-1, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(width, height);

const css2Renderer = new CSS2DRenderer();
css2Renderer.setSize(width, height);

const render = () => {
    renderer.render(scene, camera);
    css2Renderer.render(scene, camera);
};

render();

const {
    rayChoosePoint,
    createSphere,
    getDistance,
    drewHole,
    sizeTag,
    markSizeGroup,
    usefourPointsDrewRect
} = UseModel({
    scene,
    camera,
    renderer,
    css2Renderer,
    hole,
    width,
    height,
    dragHole
});

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper);

// 轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.addEventListener('change', function () {
    render();
});

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', () => {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    render();
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

onMounted(() => {
    webgl.value.appendChild(renderer.domElement);
    webgl.value.appendChild(css2Renderer.domElement);
});

const onSeasure = () => {
    isMeasure.value = !isMeasure.value;
    isMeasure2.value = false;
};
const onSeasure2 = () => {
    isMeasure2.value = !isMeasure2.value;
    isMeasure.value = false;
};

let clickNum = 0; //记录点击次数
let p1 = null;
let p2 = null;
let L = 0;

let fourPoints = [];

renderer.domElement.addEventListener('mousedown', (event) => {
    // 标注
    if (isMeasure.value) {
        clickNum += 1;
        if (clickNum == 1) {
            p1 = rayChoosePoint(event);

            // console.log('===========p1=====================', p1);
            point1.value = p1;
            const sphere = createSphere(p1);
            markSizeGroup.add(sphere);
            scene.add(sphere);
            render();
        } else {
            clickNum = 0;
            p2 = rayChoosePoint(event);
            point2.value = p2;
            // console.log('==========p2=====================', p2);

            // const c = p2.x,p1.y,p2.z
            // const d = p1.x, p2.y,p1.z
            const C = new THREE.Vector3(p2.x, p1.y, p2.z);
            const D = new THREE.Vector3(p1.x, p2.y, p1.z);
            // 逆时针 A D B C
            fourPoints = [];

            fourPoints.push(p1, D, p2, C);

            // console.log('==========C,D====================', C, D);
            console.log('==========fourPoints====================', fourPoints);
            if (p1 && p2) {
                L = getDistance(p1, p2).toFixed(2);
                // sizeTag(p1, p2, L); //尺寸标注 箭头线段、尺寸数值
                sizeTag(p1, p2, L);

                const line = usefourPointsDrewRect(fourPoints);

                scene.add(line);
                render();
            }
            p1 = null;
            p2 = null;
        }
    }
});

renderer.domElement.addEventListener('dblclick', (event) => {
    // 画圆弧
    if (isMeasure2.value) {
        const p3 = rayChoosePoint(event);
        drewHole(p3);
        render();
    }
});

let testLine;

renderer.domElement.addEventListener('mousemove', (event) => {
    event.preventDefault();
    const point = rayChoosePoint(event);
    if (p1 && point) {
        if (testLine) {
            scene.remove(testLine);
        }
        const points = createRectPoints(p1, point);
        testLine = usefourPointsDrewRect(points);
        scene.add(testLine);
        render();
    }
});

renderer.domElement.addEventListener('mousedown', () => {
    const dragList = [];
    scene.traverse((item) => {
        if (item.name === `管孔标注组-${hole.value}`) {
            dragList.push(item);
        }
    });

    console.log('dragList===', dragList);

    // 拖放控制器
    const dragControls = new DragControls(dragList, camera, renderer.domElement);

    dragControls.addEventListener('drag', function (event) {
        orbitControls.enabled = false;
        dragHole.value = event.object;

        // 当前正在拖拽的圆
        const drags = dragList[0].children?.filter((el) => el.name === `管孔标注-${hole.value}`);
        drags[0]?.position.copy(event.object.position);

        renderer.render(scene, camera);
        css2Renderer.render(scene, camera);
    });

    dragControls.addEventListener('dragend', function (event) {
        orbitControls.enabled = true;
    });
});
</script>

<style scoped lang="less">
.pos {
    position: absolute;
    left: 200px;
    top: 200px;
}

.bu {
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

.measure {
    background: v-bind("isMeasure ? '#ddd' : 'rgba(255, 255, 255, 0.4)'");
}

.measure2 {
    background: v-bind("isMeasure2 ? '#ddd' : 'rgba(255, 255, 255, 0.4)'");
}
</style>
