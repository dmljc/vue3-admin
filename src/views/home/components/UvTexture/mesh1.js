import * as THREE from 'three';

const geometry = new THREE.SphereGeometry(100, 50);

// 类型数组创建顶点数据
const vertices = new Float32Array([
    0,
    0,
    0, // 顶点1坐标
    100,
    0,
    0, // 顶点2坐标
    100,
    50,
    0, // 顶点3坐标
    0,
    50,
    0 // 顶点4坐标
]);

// 创建属性缓冲区对象，3个为一组，表示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3);

// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;

// Uint16Array类型数组创建顶点索引数据
const indexes = new Uint16Array([0, 1, 2, 0, 2, 3]);
// 索引数据赋值给几何体的index属性，1个为一组
geometry.index = new THREE.BufferAttribute(indexes, 1);

/**纹理坐标0~1之间随意定义*/
const uvs = new Float32Array([
    0,
    0, //图片左下角
    1,
    0, //图片右下角
    1,
    1, //图片右上角
    0,
    1 //图片左上角
]);

// 设置几何体attributes属性的位置normal属性
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标

// 纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./one.jpg');
texture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
