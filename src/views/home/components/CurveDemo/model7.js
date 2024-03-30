import * as THREE from 'three';

// p1、p3轨迹线起始点坐标
// const p1 = new THREE.Vector3(-100, 0, -100);
// const p3 = new THREE.Vector3(100, 0, 100);

// // 计算p1和p3的中点坐标
// const x2 = (p1.x + p3.x) / 2;

// const z2 = (p1.z + p3.z) / 2;
// const h = 50;
// const p2 = new THREE.Vector3(x2, h, z2);

// const arr = [p1, p2, p3];
// // 三维样条曲线
// const curve = new THREE.CatmullRomCurve3(arr);

// p1、p3轨迹线起始点坐标
const p1 = new THREE.Vector3(-100, 0, -100);
const p3 = new THREE.Vector3(100, 0, 100);
// 计算p1和p3的中点坐标
const x2 = (p1.x + p3.x) / 2;
const z2 = (p1.z + p3.z) / 2;
// 三维样条曲线高度
// const h = 50;
// 三维二次贝赛尔曲线高度
const h = 100;
const p2 = new THREE.Vector3(x2, h, z2);

const arr = [p1, p2, p3];
// 三维样条曲线
// const curve = new THREE.CatmullRomCurve3(arr);
// 三维二次贝赛尔曲线
const curve = new THREE.QuadraticBezierCurve3(...arr);

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
geometryPoints.setFromPoints([p1, p2, p3]);

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
