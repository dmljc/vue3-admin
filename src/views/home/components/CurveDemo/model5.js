import * as THREE from 'three';

// 三维向量Vector3创建一组顶点坐标
// const arr = [
//     new THREE.Vector3(-5, 2, 9),
//     new THREE.Vector3(-1, 4, 4),
//     new THREE.Vector3(0, 0, 0),
//     new THREE.Vector3(6, -6, 0),
//     new THREE.Vector3(7, 0, 8)
// ];

// 创建三维样条曲线
// const curve = new THREE.CatmullRomCurve3(arr);

// 二维向量Vector2创建一组顶点坐标
const arr = [new THREE.Vector2(-10, 0), new THREE.Vector2(0, 3), new THREE.Vector2(10, 0)];
// 二维样条曲线
const curve = new THREE.SplineCurve(arr);

// 从曲线上获取顶点坐标
const pointsArr = curve.getPoints(50);

// 创建没有任何形状的空几何体
const geometry = new THREE.BufferGeometry();

// 把曲线上获取的顶点坐标赋值给几何体对象
geometry.setFromPoints(pointsArr);

// 创建点材质
// const material = new THREE.PointsMaterial({
//     color: 0xff0000,
// });

// 创建点模型
// const model = new THREE.Points(geometry, material);

// 创建线材质
const material = new THREE.LineBasicMaterial({
    color: 0x000000
});

// 创建线模型
const model = new THREE.Line(geometry, material);

export default model;
