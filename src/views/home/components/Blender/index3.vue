<template>
    <div ref="webgl"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const webgl = ref(null);
const objectList = [];
let enableSelection = false;
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// 场景
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(100, 200, 200);
const material = new THREE.MeshLambertMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0.3
});
const model = new THREE.Mesh(geometry, material);
scene.add(model);


// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

// 灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(100, 60, 50);
scene.add(directionalLight);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 相机
const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 8000);
camera.position.set(300, 300, 300);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);

const css3Renderer = new CSS3DRenderer();
css3Renderer.setSize(width, height);

render();

// 射线拾取选择场景模型表面任意点xyz坐标
const rayChoosePoint = (event) => {
    const px = event.offsetX;
    const py = event.offsetY;
    //屏幕坐标转标准设备坐标
    const x = (px / width) * 2 - 1;
    const y = -(py / height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    //.setFromCamera()在点击位置生成raycaster的射线ray
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    // 射线交叉计算拾取模型
    const result = raycaster.intersectObject(scene, true);
    
    let v3 = null;
    if (result.length > 0) {
        // 获取模型上选中的一点坐标
        v3 = result[0].point;
    }

    return v3;
};


// 创建标注尺寸
const createMarkSize = (point, size, name) => {
    const div = document.createElement('div');
    div.style.color = '#ffffff';
    div.innerText = size;
    div.style.padding = '4px 10px';
    div.style.width = '200px';
    div.style.height = '200px';
    div.style.border = '1px solid red';

    const markSizeMesh = new CSS3DObject(div);
    markSizeMesh.position.copy(point);
    markSizeMesh.name = `${name}-${size}`;
    // const radius = size / 2;
    // const markRadius = radius / 1000;
    markSizeMesh.position.y = point.y;
    markSizeMesh.rotateY(Math.PI / 2);
    // markSizeMesh.scale.set(3, 3, 3);

    scene.add(markSizeMesh);
    css3RendererFn();

    // if (point.x > 0) {
    //     markSizeMesh.translateZ(-0.01);
    // } else {
    //     markSizeMesh.translateZ(0.01);
    // }

    return {
        markSizeMesh
    };
};

// 相机轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.addEventListener('change', () => {
    render();
});

function render() {
    renderer.render(scene, camera);
    css3Renderer.render(scene, camera);
}

const controls = new DragControls(objectList, camera, renderer.domElement);

controls.addEventListener('drag', () => {
    orbitControls.enabled = false;
    render();
});
controls.addEventListener('dragend', () => {
    orbitControls.enabled = true;
    // render();
});


// renderer.domElement.addEventListener('click', onClick);
renderer.domElement.addEventListener('keydown', onKeyDown);
renderer.domElement.addEventListener('keyup', onKeyUp);

const group = new THREE.Group();
scene.add(group);

function onKeyDown(event) {
    enableSelection = (event.keyCode === 16) ? true : false;
    if (event.keyCode === 77) {
        controls.mode = (controls.mode === 'translate') ? 'rotate' : 'translate';
    }
}

function onKeyUp() {
    enableSelection = false;
}

// function onClick(event) {
//     event.preventDefault();
//     if (enableSelection === true) {
//         const draggableObjects = controls.getObjects();
//         draggableObjects.length = 0;

//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
//         raycaster.setFromCamera(mouse, camera);
//         const intersections = raycaster.intersectObjects(objectList, true);

//         if (intersections.length > 0) {
//             const object = intersections[0].object;
//             if (group.children.includes(object) === true) {
//                 object.material.emissive.set(0x000000);
//                 scene.attach(object);
//             } else {
//                 object.material.emissive.set(0xaaaaaa);
//                 group.attach(object);
//             }

//             controls.transformGroup = true;
//             draggableObjects.push(group);
//         }

//         if (group.children.length === 0) {
//             controls.transformGroup = false;
//             draggableObjects.push(...objectList);
//         }

//     }
//     render();
// }

const drewHole = (point) => {
    const curve = new THREE.EllipseCurve(
        point.x,
        point.y,
        20, 20,
        0,
        2 * Math.PI,
        false,
        0
    );

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const ellipse = new THREE.Line(geometry, material);
    objectList.push(ellipse);
    scene.add(ellipse);

    createMarkSize(point, 200, '管孔标注');
  
};

const css3RendererFn = () => {
    css3Renderer.domElement.style.position = 'absolute';
    css3Renderer.domElement.style.top = '100px';
    css3Renderer.domElement.style.border = '10px solod red';
    css3Renderer.domElement.style.pointerEvents = 'none';

    render();
};

renderer.domElement.addEventListener('dblclick', (event) => {
    const point = rayChoosePoint(event);
    drewHole(point);
  
});



onMounted(() => {
    webgl.value.appendChild(renderer.domElement);
});

onUnmounted(() => {
    renderer.dispose();
});

</script>
