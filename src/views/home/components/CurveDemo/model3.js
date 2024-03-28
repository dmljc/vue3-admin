import * as THREE from 'three';

// 绘制椭圆弧线
const arc = new THREE.EllipseCurve(0, 0, 20, 10, 0, Math.PI, false);

// 获取椭圆上的顶点数据
const pointsArr = arc.getPoints(50);

// 创建空材质对象
const geometry = new THREE.BufferGeometry();

// 把椭圆上的顶点数据赋值给材质对象
geometry.setFromPoints(pointsArr);

// 创建线材质
const material = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    side: 2
});

// 创建线模型
const model = new THREE.Line(geometry, material);

export default model;
