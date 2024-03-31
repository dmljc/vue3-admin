import * as THREE from 'three';

const pointArr = [
    // 按照特定顺序，依次书写多边形顶点坐标
    new THREE.Vector2(-50, -50), //多边形起点
    new THREE.Vector2(-50, 50),
    new THREE.Vector2(50, 50),
    new THREE.Vector2(50, -50)
];

const shape = new THREE.Shape(pointArr);

const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 160,
    bevelThickness: 40, // 倒角尺寸:拉伸方向
    bevelSize: 20, // 倒角尺寸:垂直拉伸方向
    bevelSegments: 20, // 倒圆角：倒角细分精度，默认3
    // bevelSegments: 1, // 倒直角
    bevelEnabled: false //禁止倒角,默认true
});

const materal = new THREE.MeshLambertMaterial({
    color: 0x00ffff
    // wireframe: true,
});

const mesh = new THREE.Mesh(geometry, materal);

export default mesh;
