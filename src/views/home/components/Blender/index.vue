<template>
    <div ref="webgl"></div>
    <div class="pos">
        <div id="measure" class="bu measure" @click="onSeasure">测距</div>
        <!-- <div id="measure" class="bu measure" @click="onRevoke">撤销</div> -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// 引入后处理对象 EffectComposer
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// // 引入 渲染器通道 RenderPass
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// // 引入 发光描边通道 OutlinePass
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

const webgl = ref(null);
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const isMeasure = ref<boolean>(false);

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

    // // 创建后处理对象 EffectComposer，用来指定需要后处理的渲染器 WebGLRenderer
    // const composer = new EffectComposer(renderer);
    // // 创建一个渲染器通道，作用是指定后处理对应的相机camera和场景scene。
    // const renderPass = new RenderPass(scene, camera);
    // // 设置 renderPass 通道
    // composer.addPass(renderPass);

    // // 创建OutlinePass通道
    // // OutlinePass第一个参数v2的尺寸和canvas画布保持一致
    // const v2 = new THREE.Vector2(window.innerWidth - 170, window.innerHeight - 130);
    // const outlinePass = new OutlinePass(v2, scene, camera);
    // outlinePass.selectedObjects = [mesh];

    // // 设置OutlinePass通道
    // composer.addPass(outlinePass);

    scene.add(gltf.scene);
    renderer.render(scene, camera);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(width, height);
renderer.render(scene, camera);

const css2Renderer = new CSS2DRenderer();
css2Renderer.setSize(width, height);
css2Renderer.render(scene, camera);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function () {
    renderer.render(scene, camera);
    css2Renderer.render(scene, camera);
});

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', () => {
    renderer.setSize(width, height);
    css2Renderer.setSize(width, height);
    camera.aspect = width / height;
    renderer.render(scene, camera);
    css2Renderer.render(scene, camera);
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

onMounted(() => {
    webgl.value.appendChild(renderer.domElement);
    webgl.value.appendChild(css2Renderer.domElement);
});

const onSeasure = () => {
    isMeasure.value = !isMeasure.value;
};

const sizeTagGroup = new THREE.Group(); //所有标注对象插入，方便整体控制尺寸标签隐藏或显示
scene.add(sizeTagGroup);

// 射线拾取选择场景模型表面任意点xyz坐标
const rayChoosePoint = (event, model, camera) => {
    const px = event.offsetX;
    const py = event.offsetY;
    //屏幕坐标转标准设备坐标
    const x = (px / width) * 2 - 1;
    const y = -(py / height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    //.setFromCamera()在点击位置生成raycaster的射线ray
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    // 射线交叉计算拾取模型
    const intersects = raycaster.intersectObject(model, true);

    const result = intersects?.filter((item) => {
        if (item.normal) {
            return item;
        }
    });
    let v3 = null;
    if (result.length > 0) {
        // 获取模型上选中的一点坐标
        v3 = result[0].point;
    }
    return v3;
};

// 标注线不进行深度测试，渲染顺序放在最后
// 3D场景中，用有粗细的线条
// 两点绘制一条直线 用于标注尺寸
const createLine = (p1, p2) => {
    const material = new THREE.LineBasicMaterial({
        color: 0xffff00,
        depthTest: false //不进行深度测试，后渲染，叠加在其它模型之上(解决两个问题)
        // 1.穿过模型，在内部看不到线条
        // 2.线条与mesh重合时候，深度冲突不清晰
    });
    const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
    //类型数组创建顶点数据
    const vertices = new Float32Array([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]);
    geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);
    const line = new THREE.Line(geometry, material);
    return line;
};

// 线两头的球体
const createSphere = (p, dir, camera) => {
    const L = camera.position.clone().sub(p).length();
    // const h = L / 30;
    // const geometry = new THREE.CylinderGeometry(0, L / 200, h);
    const geometry = new THREE.SphereGeometry(L / 500);
    // geometry.translate(0, -h / 2, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000, //设置材质颜色
        depthTest: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    //通过四元数表示默认圆锥需要旋转的角度，才能和标注线段的方向一致
    const quaternion = new THREE.Quaternion();
    //参数dir表示线段方向，通过两点p1、p2计算即可，通过dir来控制圆锥朝向
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    mesh.quaternion.multiply(quaternion);
    mesh.position.copy(p);
    return mesh;
};

// 计算模型上选中两点的距离
const getDistance = (p1, p2) => {
    return p1.clone().sub(p2).length();
};

let clickNum = 0; //记录点击次数
let p1 = null;
let p2 = null;
let L = 0;

// 通过鼠标按下抬起的时间差或者说距离差，来区分判断是鼠标拖动事件，还是鼠标拖动旋转事件
let mousedownX = 0;
let mousedownY = 0;
renderer.domElement.addEventListener('mousedown', (event) => {
    mousedownX = event.offsetX;
    mousedownY = event.offsetY;
});

renderer.domElement.addEventListener('mouseup', (event) => {
    const x = event.offsetX;
    const y = event.offsetY;

    if (Math.abs(x - mousedownX) < 1 && Math.abs(y - mousedownY) < 1) {
        if (isMeasure.value) {
            clickNum += 1;
            if (clickNum == 1) {
                p1 = rayChoosePoint(event, scene, camera);
                console.log('p1', p1);
            } else {
                clickNum = 0;
                p2 = rayChoosePoint(event, scene, camera);
                console.log('p2', p2);
                if (p1 && p2) {
                    L = getDistance(p1, p2).toFixed(2);
                    console.log('L', L);
                    sizeTag(p1, p2, L, camera); //尺寸标注 箭头线段、尺寸数值
                }
                p1 = null;
                p2 = null;
            }
        }
    }
});

// 标注尺寸的组件
const sizeTag = (p1, p2, size, camera) => {
    const line = createLine(p1, p2);
    line.name = '测距用的线段';
    sizeTagGroup.add(line);

    const dir = p1.clone().sub(p2).normalize();
    const sphere1 = createSphere(p1, dir, camera);
    sphere1.name = '测距用的线两端的球1';
    sizeTagGroup.add(sphere1);
    const sphere2 = createSphere(p2, dir.clone().negate(), camera);
    sphere2.name = '测距用的线两端的球2';
    sizeTagGroup.add(sphere2);

    // CSS2 渲染标注
    const div = document.createElement('div');
    div.className = 'sizeTag';
    div.style.fontSize = '20px';
    div.style.color = '#ffffff';
    div.style.padding = '5px 10px';
    div.style.background = 'rgba(0,0,0,0.9)';
    div.textContent = size + 'm';

    const tag = new CSS2DObject(div);
    const center = p1.clone().add(p2).divideScalar(2);
    tag.position.copy(center);
    tag.name = '测距用的显示距离数据的浮层';
    sizeTagGroup.add(tag);
    sizeTagGroup.name = '测距模块';

    scene.add(sizeTagGroup);

    css2Renderer.domElement.style.position = 'absolute';
    css2Renderer.domElement.style.top = '100px';
    css2Renderer.domElement.style.border = '10px solod red';
    css2Renderer.domElement.style.pointerEvents = 'none';

    renderer.render(scene, camera);
    css2Renderer.render(scene, camera);
};

// 按键修饰符
window.addEventListener('keyup', (event) => {
    // esc 按键修饰符：取消测距
    if (event.code === 'Escape') {
        isMeasure.value = false;
        // 删除键修饰符：删除选中的网格模型
    } else if (['Backspace', 'Delete'].includes(event.code)) {
        let lineList = [];
        let sphereList = [];
        let tagList = [];

        sizeTagGroup.children?.forEach((item) => {
            console.log('item----', item);
            if (item?.isLine) {
                lineList.push(item);
            } else if (item?.isMesh) {
                sphereList.push(item);
            } else if (item?.isObject3D) {
                tagList.push(item);
            }
        });

        const lastLine = lineList.slice(lineList.length - 1)[0];
        const lastTwoSpheres = sphereList.slice(sphereList.length - 2);
        const lastTag = tagList.slice(tagList.length - 1)[0];

        sizeTagGroup.remove(lastLine, ...lastTwoSpheres, lastTag);
        renderer.render(scene, camera);
        css2Renderer.render(scene, camera);
    }
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
</style>
