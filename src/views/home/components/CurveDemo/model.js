import * as THREE from 'three';

const shape = new THREE.Shape();

// shape.lineTo(150, 0);
// shape.arc(-50, 0, 50, 0, Math.PI / 2);

shape.lineTo(100, 0);
// shape.lineTo(150, 0);

// shape.arc(0, 0, 50, 0, Math.PI / 2, false);
// shape.absarc(100, 0, 50, 0, Math.PI / 2, false);
shape.absarc(100, 0, 50, 0, Math.PI / 2, false);
shape.lineTo(0, 50);

// 填充
// const geometry = new THREE.ShapeGeometry(shape, 20);
const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 40,
    curveSegments: 20 // shape曲线对应曲线细分数
});

const materal = new THREE.MeshLambertMaterial({
    color: 0x00ffff
});

const mesh = new THREE.Mesh(geometry, materal);
export default mesh;
