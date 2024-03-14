import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(60, 60);
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./指南针.png');
const material = new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true
});
const mesh = new THREE.Mesh(geometry, material);

mesh.rotateX(-Math.PI / 2);

mesh.position.y = 10;

export default mesh;
