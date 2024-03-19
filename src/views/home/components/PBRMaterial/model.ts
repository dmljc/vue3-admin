import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 创建一个GLTF加载器
const loader = new GLTFLoader(); 
// 声明一个组对象，用来添加加载成功的三位场景
const model = new THREE.Group();

loader.load('/金属.glb', (gltf) => {
    gltf.scene.traverse((obj) => {

        gltf.scene.scale.set(6,6,6);
        
        if (obj instanceof THREE.Mesh) {
            obj.material.metalness = 1.0;
            obj.material.roughness = 0.5
        }

    });

    model.add(gltf.scene);
});

export default model; 