import * as THREE from 'three';

// 先创建Shape的矩形外轮廓
const shape = new THREE.Shape();
shape.lineTo(100, 0);
shape.lineTo(100, 100);
shape.lineTo(0, 100);

// Path对象创建内部多个轮廓

// 圆孔1
const path1 = new THREE.Path();
path1.absarc(20, 20, 10);
// 圆孔2
const path2 = new THREE.Path();
path2.absarc(80, 20, 10);
// 方孔
const path3 = new THREE.Path();
path3.moveTo(50, 50);
path3.lineTo(80, 50);
path3.lineTo(80, 80);
path3.lineTo(50, 80);

// 三个内孔轮廓分别插入到holes属性中
shape.holes.push(path1, path2, path3);

// ShapeGeometry 填充 Shape 获得一个平面几何体
// const geometry = new THREE.ShapeGeometry(shape);

// ExtrudeGeometry 拉伸 Shape 获得一个长方体几何体
const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 60, // 拉伸长度
    bevelEnabled: false, // 禁止倒角
    curveSegments: 50 // shape曲线对应曲线细分数，光滑度系数
});
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff
});
const mesh = new THREE.Mesh(geometry, material);

export default mesh;
