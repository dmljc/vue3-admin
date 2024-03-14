import * as THREE from 'three';
// 圆形平面
const geometry = new THREE.CircleGeometry(100);
// 纹理贴图加载器
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./one.jpg');
// texture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
