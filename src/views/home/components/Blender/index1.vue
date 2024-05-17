<template>
    <div ref="webgl"></div>
    <div class="pos">
        <!-- <div id="circle" class="bu">画圆</div> -->
        <div id="measure" class="bu">测量</div>
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
// import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

const webgl = ref(null);
const tempArr = ref([]);
const pointArr = ref([]);
const scene = new THREE.Scene();
const loader = new GLTFLoader();
// const markCircle = ref([]);

const width = computed(() => {
    return window.innerWidth - 196;
});

const height = computed(() => {
    return window.innerHeight - 136;
});

// loader.load('/工厂建模数据/工厂.gltf', (gltf) => {
loader.load('/图维建模数据/textured_output08.gltf', (gltf) => {
    scene.add(gltf.scene);
    const mesh = gltf.scene.children[0];
    // // 计算模型的边界，以便找到模型的中心点
    const box = new THREE.Box3().setFromObject(mesh);
    // // 计算边界中心并创建一个新的中心点向量
    const center = new THREE.Vector3();
    box.getCenter(center);
    // // 将模型的位置设置为其当前位置减去计算出的中心点
    mesh.position.sub(center);

    renderer.render(scene, camera);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(30, width.value / height.value, 1, 3000);
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width.value, height.value);
renderer.render(scene, camera);

// 画圆弧的函数
const onDrawCircle = (point: any) => {
    // // 圆弧线
    // const R = 0.1; // 圆弧半径
    // const aX = -point.z;
    // const aY = point.y;
    // // 圆弧
    // const arc = new THREE.ArcCurve(aX, aY, R, 0, 2 * Math.PI, true);
    // // CurvePath创建一个组合曲线对象
    // const CurvePath = new THREE.CurvePath();
    // // arc 拼接出来一个U型轮廓曲线，注意顺序
    // CurvePath.curves.push(arc);
    // // 获取曲线上的坐标点数量
    // const ps = CurvePath.getPoints(40);
    // const arcgeometry = new THREE.BufferGeometry();
    // arcgeometry.setFromPoints(ps); //读取坐标数据赋值给几何体顶点
    // const arcmaterial = new THREE.LineBasicMaterial({
    //     color: 0xff0000
    // });
    // // 线模型
    // const arcline = new THREE.Line(arcgeometry, arcmaterial);
    // arcline.rotateY(Math.PI / 2);
    // //墙壁不平时 靠近墙壁太近了，容易出现圆圈被遮盖的问题
    // arcline.translateZ(point.x + 0.02);
    // arcline.name = '标注圆形';
    // scene.add(arcline);
};

// 添加点击事件监听
function onClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 将鼠标位置转换成归一化设备坐标(-1 到 +1)
    mouse.x = (event.clientX / width.value) * 2 - 1;
    mouse.y = -(event.clientY / height.value) * 2 + 1;

    // 使用鼠标位置和相机进行射线投射
    raycaster.setFromCamera(mouse, camera);

    // 计算物体和射线的交点（仅需要考虑网格模型，坐标轴，点模型和线模型等除外）
    const list = scene.children.filter((item) => item?.isGroup === true);
    const intersects = raycaster.intersectObjects(list, true);

    if (intersects.length > 0) {
        const { point } = intersects[0];

        // 点模型
        const geometryPoints = new THREE.BufferGeometry();
        geometryPoints.setFromPoints([point]);
        const materialPoints = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 0.05
        });

        const points = new THREE.Points(geometryPoints, materialPoints);
        scene.add(points);

        tempArr.value.push(point);
        // 线模型
        if (tempArr.value.length > 2) {
            pointArr.value = tempArr.value.slice(tempArr.value.length - 2);
        } else {
            pointArr.value = tempArr.value;
        }

        // const p1 = pointArr.value[0];
        // const p2 = pointArr.value[1];

        // // 创建一个直线的geometry
        // const geometry = new THREE.BufferGeometry();
        // geometry.setAttribute('position', new THREE.Float32BufferAttribute([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z], 3));

        // // 创建一个直线的材质
        // const material = new THREE.LineBasicMaterial({ color: 0xffffff });

        // // 创建直线
        // const line = new THREE.Line(geometry, material);
        // line.translateX(0.01);
        // scene.add(line);

        // const distance = p1.distanceTo(p2);
        // console.log('distance', distance);

        // const shape = new THREE.Shape();
        // shape.moveTo(-p1.z, p1.y);
        // // 绘制直线线段，起点(10,0)，结束点(100,0)
        // shape.lineTo(-p2.z, p2.y);

        // tempArr.value = [];

        // if (pointArr.value.length < 2) {
        //     return;
        // }

        // // 三维样条曲线
        // const curve = new THREE.CatmullRomCurve3(pointArr.value);

        // //曲线上获取点
        // const pointsArr = curve.getPoints(pointArr.value?.length);
        // const geometry = new THREE.BufferGeometry();
        // //读取坐标数据赋值给几何体顶点
        // geometry.setFromPoints(pointsArr);
        // // 线材质
        // const material = new THREE.LineBasicMaterial({
        //     color: 0xff0000
        // });

        // // 线模型
        // const line = new THREE.LineSegments(geometry, material);
        // scene.add(line);

        // // onDrawCircle(point);

        renderer.render(scene, camera);
    }
}

// 监听鼠标点击事件
renderer.domElement.addEventListener('click', onClick, false);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function () {
    renderer.render(scene, camera);
});

// const geometry = new THREE.CircleGeometry(0.06, 30);
// const material = new THREE.MeshLambertMaterial({
//     color: 0xff00ff,
//     side: THREE.DoubleSide
// });
// const circleMesh = new THREE.Mesh(geometry, material);
// circleMesh.name = '拖拽立方体';
// circleMesh.rotateY(Math.PI / 2);
// circleMesh.visible = false;
// scene.add(circleMesh);

// const list = scene?.children?.filter((item) => item.name === '拖拽立方体');

// const dragControls = new DragControls(list, camera, renderer.domElement);
// // dragControls.mode = 'translate';
// dragControls.addEventListener('drag', function (event) {
//     const { position } = event.object;
//     const { x, y, z } = position;
//     circleMesh.position.set(x, y, z);
//     console.log('-----adrag---event------', x,y,z);
//     renderer.render(scene, camera);
// });

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

    document.getElementById('circle').addEventListener('click', () => {
        circleMesh.visible = true;
        renderer.render(scene, camera);
    });

    // 通过UI按钮改变相机观察角度
    document.getElementById('px').addEventListener('click', () => {
        camera.position.set(2, 0, 0);
        camera.lookAt(0, 0, 0); //重新计算相机视线方向
        renderer.render(scene, camera);
    });
    document.getElementById('nx').addEventListener('click', () => {
        camera.position.set(-2, 0, 0);
        camera.lookAt(0, 0, 0); //重新计算相机视线方向
        renderer.render(scene, camera);
    });

    document.getElementById('y').addEventListener('click', () => {
        camera.position.set(0, 2, 0); //y轴方向观察
        camera.lookAt(0, 0, 0); //重新计算相机视线方向
        renderer.render(scene, camera);
    });

    document.getElementById('pz').addEventListener('click', () => {
        camera.position.set(0, 0, 2); //z轴方向观察
        camera.lookAt(0, 0, 0); //重新计算相机视线方向
        renderer.render(scene, camera);
    });
    document.getElementById('nz').addEventListener('click', () => {
        camera.position.set(0, 0, -2); //z轴方向观察
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
