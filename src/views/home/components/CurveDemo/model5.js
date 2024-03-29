import * as THREE from 'three';

// 三维向量Vector3创建一组顶点坐标
const arr = [
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(70, 0, 80)
];

// 创建三维样条曲线
const curve = new THREE.CatmullRomCurve3(arr);

// 二维向量Vector2创建一组顶点坐标
// const arr = [new THREE.Vector2(-100, 0), new THREE.Vector2(0, 30), new THREE.Vector2(100, 0)];
// 二维样条曲线
// const curve = new THREE.SplineCurve(arr);

// 从曲线上获取顶点坐标
const pointsArr = curve.getPoints(50);

// 创建没有任何形状的空几何体
const geometry = new THREE.BufferGeometry();

// 把曲线上获取的顶点坐标赋值给几何体对象
geometry.setFromPoints(pointsArr);

// 创建线材质
const material = new THREE.LineBasicMaterial({
    color: 0x00ffff
});

// 创建线模型
const line = new THREE.Line(geometry, material);

// 用点模型可视化样条曲线经过的顶点位置
const geometryPoints = new THREE.BufferGeometry();
geometryPoints.setFromPoints(arr);

const materialPoints = new THREE.PointsMaterial({
    color: 0xff00ff,
    size: 10
});

const points = new THREE.Points(geometryPoints, materialPoints);

const group = new THREE.Group();
group.add(line, points);

export default group;
