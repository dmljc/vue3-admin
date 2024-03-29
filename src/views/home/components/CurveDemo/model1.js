import * as THREE from 'three';

// 创建一个几何体对象
const geometry = new THREE.BufferGeometry();

// 定义圆弧半径
const R = 50;
// 定义分段数量
const N = 50;

// 存放批量生成的圆弧上的顶点数据
const arr = [];
// 两个相邻点间隔弧度
const sp = (2 * Math.PI) / N;

// 设置圆心坐标
const cx = 50;
const cy = 50;

for (let i = 0; i < N + 1; i++) {
    const angle = sp * i;
    // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    arr.push(x, y, 0);
}

// 类型数据创建顶点数据
const vertices = new Float32Array(arr);
// 创建数据属性缓冲区对象，3个为一组，表示一个顶点的XYZ坐标
const attribue = new THREE.BufferAttribute(vertices, 3);
// 设置几何体 attributes 属性的位置属性
geometry.attributes.position = attribue;

// 线材质
const material = new THREE.LineBasicMaterial({
    color: 0x00ffff
});

// 创建线模型对象 Line、LineLoop、LineSegments
const model = new THREE.Line(geometry, material);

export default model;
