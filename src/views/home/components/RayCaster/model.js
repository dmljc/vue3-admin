import * as THREE from 'three';

// 创建一个几何体对象
const geometry = new THREE.BufferGeometry();
// 类型数组创建顶点数据
const vertices = new Float32Array([
    100, 25, 0,  // 顶点1坐标
    100, -25, 25, // 顶点2坐标
    100, -25, -25, // 顶点3坐标
]);

// 创建属性缓冲区对象, 3个为一组，标示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3);
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;

const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.FrontSide, // 仅正面可见
});

const mesh = new THREE.Mesh(geometry, material);

// 创建射线对象ray
const ray = new THREE.Ray();
// 设置射线起点
ray.origin = new THREE.Vector3(0, 0, 0);
// 设置射线方向
ray.direction = new THREE.Vector3(1, 0, 0);

// 三角形三个点坐标
const p1 = new THREE.Vector3(100, 25, 0);
const p2 = new THREE.Vector3(100, -25, 25);
const p3 = new THREE.Vector3(100, -25, -25);
// point 用来记录射线和三角形的交叉点
const point = new THREE.Vector3();
const result = ray.intersectTriangle(p1, p2, p3, false, point);
console.log('point----false---交叉点坐标', point); // _Vector3 {x: 100, y: 0, z: 0}
console.log('result----false---查看是否相交', result);  // _Vector3 {x: 100, y: 0, z: 0}

// 参数4 设为true 是背面剔除的意思，返回值null,返回值为null,虽然交叉，但是背面对着射线，视为无效
const r = ray.intersectTriangle(p1, p2, p3, true, point);

console.log('point-----true---交叉点坐标', point);  // _Vector3 {x: 100, y: 0, z: 0}
console.log('r-----true---查看是否相交', r); // null
export default mesh;
