import * as THREE from 'three';

// Vector2 表示的三个点坐标
const pointsArr = [
    new THREE.Vector2(50, 60), 
    new THREE.Vector2(25, 0), 
    new THREE.Vector2(50, -60),
];
// 通过三点定一个二维样条曲线
const curves = new THREE.SplineCurve(pointsArr);
// 曲线上获取点，作为旋转几何体的旋转轮廓
const points = curves.getPoints(50);

// pointsArr 轮廓绕y轴旋转生成几何体曲面
const geometry = new THREE.LatheGeometry(points, 30);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide
});

const mesh = new THREE.Mesh(geometry, material);
export default mesh;
