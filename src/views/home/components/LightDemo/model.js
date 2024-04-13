import * as THREE from 'three';

// 立方体
const geometry = new THREE.BoxGeometry(50, 100, 50);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 50;
// 1、设置产生投影的网格模型
mesh.castShadow = true;

// 平面
const planeGeometry = new THREE.PlaneGeometry(400, 250);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x999999,
    side: THREE.DoubleSide
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotateX(-Math.PI / 2);
// 3、设置接收阴影的投影面
planeMesh.receiveShadow = true;

const group = new THREE.Group();
group.add(mesh, planeMesh);

export default group;
