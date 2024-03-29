import * as THREE from 'three';

// p1、p2、p3、p4表示4个点坐标
// p1、p4是曲线起始点，p2、p3是曲线的控制点
// const p1 = new THREE.Vector2(-80, 0);
// const p2 = new THREE.Vector2(-40, 50);
// const p3 = new THREE.Vector2(50, 50);
// const p4 = new THREE.Vector2(80, 0);

// 二维三次贝赛尔曲线
// const curve = new THREE.CubicBezierCurve(p1, p2, p3, p4);

const p1 = new THREE.Vector3(-80, 0, 0);
const p2 = new THREE.Vector3(-40, 50, 0);
const p3 = new THREE.Vector3(50, 50, 0);
const p4 = new THREE.Vector3(80, 0, 100);
// 三维三次贝赛尔曲线
const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);

// 获取曲线上的坐标点数量
const pointArr = curve.getPoints(50);

const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointArr);

const material = new THREE.LineBasicMaterial({
    color: 0x00ffff
});

const line = new THREE.Line(geometry, material);

// 用点模型可视化贝塞尔曲线经过的顶点位置
const geometryPoints = new THREE.BufferGeometry();
geometryPoints.setFromPoints([p1, p2, p3, p4]);

const materialPoints = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 10
});

const points = new THREE.Points(geometryPoints, materialPoints);

// 三个点构成的线条
const line2 = new THREE.Line(geometryPoints, new THREE.LineBasicMaterial());

const group = new THREE.Group();
group.add(line, points, line2);
export default group;
