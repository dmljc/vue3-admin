import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(100, 50, 20);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff
});
const mesh = new THREE.Mesh(geometry, material);

// 计算模型包围盒
const box3 = new THREE.Box3();
box3.expandByObject(mesh);
console.log('查看包围盒', box3);

// 计算包围盒尺寸
const size = new THREE.Vector3();
box3.getSize(size);
console.log('模型包围盒尺寸', size);

// 计算包围盒中心坐标
const center = new THREE.Vector3();
box3.getCenter(center);
console.log('模型中心坐标', center);

export default mesh;
