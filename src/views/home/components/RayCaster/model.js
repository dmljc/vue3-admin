import * as THREE from 'three';

// 一组二维向量表示一个多边形轮廓坐标
const pointsArr = [new THREE.Vector2(50, 60), new THREE.Vector2(50, -60)];
// 通过2点定一个二维样条曲线
const curves = new THREE.SplineCurve(pointsArr);
// 曲线上获取点，作为旋转几何体的旋转轮廓
const points = curves.getPoints();
// pointsArr 轮廓绕y轴旋转生成几何体曲面
const geometry = new THREE.LatheGeometry(points, 4);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotateY(Math.PI / 4);

// 平面
const planeGeometry = new THREE.PlaneGeometry(80, 80);
const planeMaterial = material.clone();
planeMaterial.opacity = 0.9;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(Math.PI / 2);
plane.position.y = -60;

const group = new THREE.Group();
group.add(mesh, plane);

export default group;
