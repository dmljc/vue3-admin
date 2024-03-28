import * as THREE from 'three';

// 坐标数据
const pointsArr = [
    // 三维向量Vector3表示的坐标值
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(0, 10, 10),
    new THREE.Vector3(0, 0, 10)

    // 三维向量Vector2表示的坐标值
    // new THREE.Vector2(0,0),
    // new THREE.Vector2(100,0),
    // new THREE.Vector2(100,100),
    // new THREE.Vector2(0,100),
];

const geometry = new THREE.BufferGeometry();
// 把数组pointsArr里面的坐标数据提取出来，赋值给`geometry.attributes.position`属性
geometry.setFromPoints(pointsArr);

// 点材质
const material = new THREE.PointsMaterial({
    color: 0xffff00,
    size: 2.0 //点对象像素尺寸
});

// 点模型
const points = new THREE.Points(geometry, material);

export default points;
