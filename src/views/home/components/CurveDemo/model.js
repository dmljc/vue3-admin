import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 创建一个GLTF加载器
const loader = new GLTFLoader();
// 声明一个组对象，用来添加加载成功的三维场景
const model = new THREE.Group();

loader.load('地形.glb', (gltf) => {
    // 三维场景添加到model组对象中
    model.add(gltf.scene);

    // mesh表示地形网格模型
    const mesh = gltf.scene.children[0];
    // 1. 山脉顶点数据.
    const pos = mesh.geometry.attributes.position;
    // 几何体顶点数量
    const count = pos.count;

    // 2. 计算模型y坐标高度差
    // 顶点所有y坐标，也就是地形高度
    const yArr = [];
    for (let i = 0; i < count; i++) {
        yArr.push(pos.getY(i));
    }
    // y坐标排序，以便于计算地形高度差
    yArr.sort();
    const miny = yArr[0];
    const maxy = yArr[yArr.length - 1];
    // 山脉整体高度
    const height = maxy - miny;

    // 3. 计算每个顶点的颜色值
    const colorsArr = [];
    // 山谷颜色
    const c1 = new THREE.Color(0x0000ff);
    // 山顶颜色
    const c2 = new THREE.Color(0xff0000);
    for (let i = 0; i < count; i++) {
        // 当前高度和整体高度比值
        const percent = (pos.getY(i) - miny) / height;
        // 颜色插值计算
        const c = c1.clone().lerp(c2, percent);
        colorsArr.push(c.r, c.g, c.b);
    }
    const colors = new Float32Array(colorsArr);

    // 设置几何体attributes属性的颜色color属性
    mesh.geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
    // 4. 设置材质，使用顶点颜色渲染
    mesh.material = new THREE.MeshLambertMaterial({
        vertexColors: true
    });
});

export default model;
