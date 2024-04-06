import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 创建一个GLTF加载器
const loader = new GLTFLoader();
const group = new THREE.Group();

loader.load('/工厂建模数据/工厂.gltf', (gltf) => {
    group.add(gltf.scene);
});

export default group;
