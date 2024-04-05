import * as THREE from 'three';
import data from './data'; // 河南省边界轮廓数据

// 一组二维向量表示一个多边形轮廓坐标
const pointsArr = [];
data.forEach((item) => {
    // data坐标数据转化为Vector2构成的顶点数组
    const v2 = new THREE.Vector2(item[0], item[1]);
    pointsArr.push(v2);
});

// Shape 画多边形轮廓，参数是二维向量数据
const shape = new THREE.Shape(pointsArr);
// 填充多边形 几何体， 参数是shape
const geometry = new THREE.ShapeGeometry(shape);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide
});
const mesh = new THREE.Mesh(geometry, material);

// 包围盒计算模型对象的大小和位置
const box3 = new THREE.Box3();
// box3.expandByObject(mesh); // 计算模型包围盒
// const size = new THREE.Vector3();
// box3.getSize(size); // 计算包围盒尺寸
// console.log('模型包围盒尺寸',size);
const center = new THREE.Vector3();
box3.getCenter(center); // 计算包围盒中心坐标
console.log('模型中心坐标', center);

export default mesh;
