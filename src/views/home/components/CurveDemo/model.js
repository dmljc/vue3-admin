// import * as THREE from 'three';

// // 创建一个立方体网格模型
// // const geometry = new THREE.BoxGeometry(50, 50, 50);

// const geometry = new THREE.CylinderGeometry(60, 60, 100, 30);
// const material = new THREE.MeshLambertMaterial({
//     color: 0x004444,
//     // transparent: true,
//     // opacity: 0.6
// });
// const mesh = new THREE.Mesh(geometry, material);

// // 长方体几何体作为 EdgesGeometry 参数创建一个新的几何体
// const edges = new THREE.EdgesGeometry(geometry, 30);
// const edgesMaterial = new THREE.LineBasicMaterial({
//     color: 0x00ffff
// });

// // 在顶点之间绘制一条线
// const line = new THREE.LineSegments(edges, edgesMaterial);
// mesh.add(line);

// export default mesh;

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 创建一个GLTF加载器
const loader = new GLTFLoader();
const group = new THREE.Group();

loader.load('/建筑模型.gltf', (gltf) => {
    // 递归遍历设置每个模型的材质，同时设置每个模型的边线
    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            obj.material = new THREE.MeshLambertMaterial({
                color: 0x004444,
                transparent: true,
                opacity: 0.6
            });
            const edges = new THREE.EdgesGeometry(obj.geometry);
            const edgesMaterial = new THREE.LineBasicMaterial({
                color: 0x00ffff
            });

            const line = new THREE.LineSegments(edges, edgesMaterial);
            obj.add(line);
        }
    });
    group.add(gltf.scene);
});

export default group;
