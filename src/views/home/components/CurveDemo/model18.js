import * as THREE from 'three';

// 创建一个几何体对象
const geometry = new THREE.BufferGeometry();
// 类型数组创建顶点数据
const vertices = new Float32Array([
    0,
    0,
    0, // 顶点1坐标
    50,
    0,
    0, // 顶点2坐标
    0,
    25,
    0 // 顶点3坐标
]);
// 创建属性缓冲区对象
// 3个为一组，表示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3);
// 设置几何体 attributes 属性的位置属性
geometry.attributes.position = attribue;

// 类型数组创建顶点颜色color数据
const colors = new Float32Array([
    1,
    0,
    0, // 顶点1颜色
    0,
    0,
    1, // 顶点2颜色
    0,
    1,
    0 // 顶点3颜色
]);
// 3个为一组，表示一个顶点的颜色数据RGB
const color = new THREE.BufferAttribute(colors, 3);
// 设置几何体attributes属性的颜色color属性
geometry.attributes.color = color;

// 点渲染模式
const material = new THREE.PointsMaterial({
    // color: 0x00fff, // 使用顶点颜色数据，color属性可以不用设置
    vertexColors: true, // 默认false，设置为true表示使用顶点颜色渲染
    size: 20.0 // 点对象像素尺寸
});
// 点模型对象
// const points = new THREE.Points(geometry, material);
// 线模型对象
// const mesh = new THREE.Line(geometry, material);
// 网格模型对象
const mesh = new THREE.Mesh(geometry, material);
mesh.translateX(10);
mesh.translateY(10);
export default mesh;
