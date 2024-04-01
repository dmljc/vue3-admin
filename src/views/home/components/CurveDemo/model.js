import * as THREE from 'three';

const shape = new THREE.Shape();

shape.moveTo(10, 0);
shape.lineTo(100, 0);
shape.lineTo(100, 100);
shape.lineTo(10, 100);

// ShapeGeometry 填充 Shape 获得一个平面几何体
// const geometry = new THREE.ShapeGeometry(shape);

// ExtrudeGeometry 拉伸 Shape 获得一个长方体几何体
const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 40, //拉伸长度
});
const materal = new THREE.MeshLambertMaterial({
    color: 0x00ffff
});

const mesh = new THREE.Mesh(geometry, materal);

export default mesh;
