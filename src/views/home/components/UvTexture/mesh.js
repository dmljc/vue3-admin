import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(200, 20);
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./纹理3.jpg');
const material = new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true
});
const mesh = new THREE.Mesh(geometry, material);

mesh.rotateX(-Math.PI / 2);

// mesh.position.y = 10;

// 设置阵列
texture.wrapS = THREE.RepeatWrapping;

// uv两个方向纹理重复数量
texture.repeat.x = 50; //注意选择合适的阵列数量

export { mesh, texture };
