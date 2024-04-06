import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const model = new THREE.Group();

loader.load('/工厂建模数据/工厂.gltf', (gltf) => {
    model.add(gltf.scene);
});

export default model;
