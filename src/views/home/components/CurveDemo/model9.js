import * as THREE from 'three';

// 三维样条曲线
// const path = new THREE.CatmullRomCurve3([
//     new THREE.Vector3(-50, 20, 90),
//     new THREE.Vector3(-10, 40, 40),
//     new THREE.Vector3(0, 0, 0),
//     new THREE.Vector3(60, -60, 0),
//     new THREE.Vector3(70, 0, 80)
// ]);

// LineCurve3 创建直线段路径
// const path = new THREE.LineCurve3(new THREE.Vector3(0, 100, 0), new THREE.Vector3(0, 0, 0));

// p1、p2、p3表示三个点坐标
// const p1 = new THREE.Vector3(-80, 0, 0);
// const p2 = new THREE.Vector3(20, 100, 0);
// const p3 = new THREE.Vector3(80, 0, 100);

// 三维二次贝赛尔曲线
// const path = new THREE.QuadraticBezierCurve3(p1, p2, p3);

// // path:路径，40：沿着轨迹细分数，2：管道半径，25：管道截面圆细分数
// const geometry = new THREE.TubeGeometry(path, 40, 4, 25);
// const material = new THREE.MeshLambertMaterial({
//     color: 0x00ffff,
//     side: THREE.DoubleSide,
//     wireframe: true
// });
// const mesh = new THREE.Mesh(geometry, material);

// 创建多段线条的顶点数据
const p1 = new THREE.Vector3(0, 0, 100);
const p2 = new THREE.Vector3(0, 0, 30);
const p3 = new THREE.Vector3(0, 0, 0);
const p4 = new THREE.Vector3(30, 0, 0);
const p5 = new THREE.Vector3(100, 0, 0);

// 3D直线线段1
const line1 = new THREE.LineCurve3(p1, p2);
// 三维二次贝塞尔曲线
const curve = new THREE.QuadraticBezierCurve3(p2, p3, p4);
// 3D直线线段2
const line2 = new THREE.LineCurve3(p4, p5);
const CurvePath = new THREE.CurvePath();
CurvePath.curves.push(line1, curve, line2);

const geometry = new THREE.TubeGeometry(CurvePath, 50, 4, 25);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);

export default mesh;
