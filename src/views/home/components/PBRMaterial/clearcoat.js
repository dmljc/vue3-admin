import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gui from './gui';

// 创建材质子菜单
const matFolder = gui.addFolder('车外壳材质');

// 创建一个gltf加载器

const loader = new GLTFLoader();

// 声明一个组对象，用来添加加载成功的三维场景
const model = new THREE.Group();

const textureCube = new THREE.CubeTextureLoader()
    .setPath('/环境贴图/环境贴图1/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

loader.load('/轿车.glb', (gltf) => {
    gltf.scene.scale.set(0.07, 0.07, 0.07);
    model.add(gltf.scene);

    // 车外壳包含多个Mesh，获取其中一个
    const mesh = gltf.scene.getObjectByName('外壳01');
    mesh.material = new THREE.MeshPhysicalMaterial({
        color: mesh.material.color,
        metalness: 0.9, // 金属度
        roughness: 0.5, // 粗糙度
        clearcoat: 1, // 清漆层
        clearcoatRoughness: 0.01, // 清漆层粗糙度
        envMap: textureCube, // 环境贴图
        envMapIntensity: 1 // 环境贴图对mesh表面影响层度
    });

    const obj = {
        color: mesh.material.color.getHex() // 获取材质默认颜色
    };

    // 材质颜色
    matFolder
        .addColor(obj, 'color')
        .name('颜色color')
        .onChange((val) => {
            console.log('change-color', val);
            mesh.material.color.set(val);
        });

    // 材质属性
    matFolder.add(mesh.material, 'metalness', 0, 1).name('金属度metalness');
    matFolder.add(mesh.material, 'roughness', 0, 1).name('粗糙度roughness');
    matFolder.add(mesh.material, 'clearcoat', 0, 1).name('清漆层clearcoat');
    matFolder.add(mesh.material, 'clearcoatRoughness', 0, 1);
    matFolder.add(mesh.material, 'envMapIntensity', 0, 10);
});

export default model;
