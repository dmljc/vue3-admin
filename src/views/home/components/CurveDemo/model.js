import * as THREE from 'three';

// 一组二维向量表示一个多边形轮廓坐标
const pointsArr = [
    new THREE.Vector2(-50, -50),
    new THREE.Vector2(-60, 0),
    new THREE.Vector2(0, 50),
    new THREE.Vector2(60, 0),
    new THREE.Vector2(50, -50)
];

// Shape表示一个平面多边形轮廓，参数是二维向量构成的数组pointsArr
const shape = new THREE.Shape(pointsArr);

// 把五边形轮廓Shape作为ShapeGeometry的参数，形成一个多边形平面几何体。
const geometry = new THREE.ShapeGeometry(shape);

const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    wireframe: true // 将几何体渲染为线框。默认值为false（即渲染为平面多边形）。
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
