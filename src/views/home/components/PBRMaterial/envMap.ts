import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 创建一个GLTF加载器
const loader = new GLTFLoader();

// 声明一个组对象，用来添加加载成功的三维场景
const model = new THREE.Group();

// const cubeTexture = new THREE.CubeTextureLoader()
//     .setPath('/环境贴图/环境贴图1/')
//     .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

loader.load('/金属.glb', (gltf) => {
    gltf.scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
            console.log('material', obj.material);
            obj.material.metalness = 1.0; //金属度
            obj.material.roughness = 0.2; //表面粗糙度
            // obj.material.envMap = cubeTexture; //设置环境贴图
            // obj.material.envMapIntensity = 1.0; //默认值1, 设置为0.0,相当于没有环境贴图
        }
    });

    model.add(gltf.scene);
});

export default model;
