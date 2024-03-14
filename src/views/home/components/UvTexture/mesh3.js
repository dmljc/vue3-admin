import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(2000, 2000);

const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./瓷砖.jpg');

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(30, 30);

const material = new THREE.MeshLambertMaterial({
    map: texture
});

const mesh = new THREE.Mesh(geometry, material);
mesh.rotateX(-Math.PI / 2);

export default mesh;
