<template>
    <div id="container"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 场景
const scene = new THREE.Scene();

// 批量创建多个长方体表示高层楼
// 所有高层楼的父对象
const group = new THREE.Group();
group.name = '高层';
for (let i = 0; i < 5; i++) {
    // 几何体
    const geometry = new THREE.BoxGeometry(30, 130, 30);
    // 材质
    const material = new THREE.MeshLambertMaterial({
        color: 0x00ffff
    });
    // 网格模型
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 50; // 网格模型mesh沿着x轴方向阵列
    mesh.name = `${i + 1}号楼`;
    group.add(mesh);
}
group.position.y = 65;
// scene.add(group);

console.log('group', group);

const group2 = new THREE.Group();
group2.name = '小洋房';
for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(30, 60, 30);
    const material = new THREE.MeshLambertMaterial({
        color: 0x00ffff
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 50;
    mesh.name = `${i + 5}号楼`;
    group2.add(mesh);
}
group2.position.z = 50;
group2.position.y = 30;
// scene.add(group2);

const model = new THREE.Group();
model.name = '小区房子';
model.add(group, group2);
model.position.set(15, 0, 15);
scene.add(model);

group2.traverse((item: any) => {
    if (item.isMesh) {
        item.material.color.set('red');
    }
});

const nameNode = scene.getObjectByName('3号楼') as any;
nameNode.material.color.set('blue');

// console.log('model--', model)

// 辅助坐标系，注意（坐标系需要在网格模型添加到场景之后创建）
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

//  环境光
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1.0);
// 下边这一句很重要，否则光照缺少立体层次感
// 光源光照强度不随距离改变衰减
pointLight.decay = 0.0;
pointLight.position.set(400, 200, 300);
scene.add(pointLight);

// 相机
const width = window.innerWidth - 296;
const height = window.innerHeight - 136;
// 透视投影相机设置
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);

// WebGLRenderer 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);
renderer.render(scene, camera);

onMounted(() => {
    // 设置 Canvas 背景颜色和官网demo一致。
    renderer.setClearColor(0x444544, 1);
    renderer.render(scene, camera);
    document.getElementById('container')?.appendChild(renderer.domElement);
});

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 监听鼠标，键盘事件
controls.addEventListener('change', function () {
    renderer.render(scene, camera);
});

// resize 事件会在窗口被调整大小时发生
window.addEventListener('resize', function () {
    const w = window.innerWidth - 296;
    const h = window.innerHeight - 136;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // render 函数需要再次渲染，以保证重绘制canvas
    renderer.render(scene, camera);
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
});

// 动画
// const renderFn = () => {
//     // mesh.rotateY(0.02);
//     // mesh.rotation.y += 0.02;
//     renderer.render(scene, camera);
//     requestAnimationFrame(renderFn);
// };

// renderFn();

// console.log('material.color',material.color);
// // const color = new THREE.Color();//默认是纯白色0xffffff。
// const color = new THREE.Color(0x00ff00);
// color.setRGB(0,1,0);//RGB方式设置颜色
// console.log('查看颜色对象结构',color);//可以查看rgb的值

// console.log(THREE.FrontSide, THREE.BackSide, THREE.DoubleSide)
</script>

<style scoped lang="less">
#container {
    width: calc(100vw - 280px);
    height: 100%;
}
</style>
