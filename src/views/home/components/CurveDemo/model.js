import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const model = new THREE.Group();

loader.load('地形.glb', (gltf) => {
    model.add(gltf.scene);
    // mesh表示地形网格模型
    const mesh = gltf.scene.children[0];
    // 顶点位置数据
    const pos = mesh.geometry.attributes.position;

    console.log('--pos--', pos);
    // 几何体顶点数量
    const count = pos.count;
    // 批量设置所有几何体顶点位置的y坐标
    for (let i = 0; i < count; i++) {
        const y = pos.getY(i); // 获取第i+1个顶点y坐标
        pos.setY(i, y * 2); // 设置第i+1个顶点y坐标为自身2倍
    }
});

export default model;
