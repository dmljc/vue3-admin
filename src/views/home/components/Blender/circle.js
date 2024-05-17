import * as THREE from 'three';
const geometry = new THREE.CircleGeometry(0.1, 30);
const material = new THREE.MeshLambertMaterial({
    color: 0xff00ff,
    side: THREE.DoubleSide
});
const mesh = new THREE.Mesh(geometry, material);
mesh.name = '拖拽立方体';
mesh.rotateY(Math.PI / 2);

export default mesh;
