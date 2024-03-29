import * as THREE from 'three';

// p1、p2、p3表示三个点坐标
// p1、p3是曲线起始点，p2是曲线的控制点
const p1 = new THREE.Vector2(-80, 0);
const p2 = new THREE.Vector2(20, 100);
const p3 = new THREE.Vector2(80, 0);

// 二维二次贝赛尔曲线
const curve = new THREE.QuadraticBezierCurve(p1, p2, p3);

// 获取曲线上的坐标点数量

const pointArr = curve.getPoints(50);

const geometry = new THREE.BufferGeometry();

geometry.setFromPoints(pointArr);

const material = new THREE.LineBasicMaterial({
    color: 0x00ffff
});

const model = new THREE.Line(geometry, material);

// const material = new THREE.PointsMaterial({
//     color: 0x00ffff,
//     size: 2,
// })

// const model = new THREE.Points(geometry, material)
export default model;
