import * as THREE from 'three';

// 3.4， 2.4， 2.8
// const boxGeometry = new THREE.BoxGeometry(280, 240, 340);
// // 创建边缘几何体
// const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
// // 创建线条材质
// const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
// // 创建线条
// const wireframe = new THREE.LineSegments(edgesGeometry, edgeMaterial);

// 创建前后面2D形状的轮廓线
const shapeFB = new THREE.Shape();
shapeFB.moveTo(140, 120);
shapeFB.lineTo(-140, 120);
shapeFB.lineTo(-140, -120);
shapeFB.lineTo(140, -120);

//  创建左右面2D形状的轮廓线
const shapeLR = new THREE.Shape();
shapeLR.moveTo(180, 120);
shapeLR.lineTo(-180, 120);
shapeLR.lineTo(-180, -120);
shapeLR.lineTo(180, -120);

//  创建上下面2D形状的轮廓线
const shapeUD = new THREE.Shape();
shapeUD.moveTo(140, 170);
shapeUD.lineTo(-140, 170);
shapeUD.lineTo(-140, -170);
shapeUD.lineTo(140, -170);

// 圆孔1
const path1 = new THREE.Path();
path1.name = '圆孔1';
path1.arc(20, 20, 15);
const path2 = new THREE.Path();
path2.name = '圆孔2';
path2.absarc(60, 20, 15);
// 内孔轮廓分别插入到holes属性中
shapeFB.holes.push(path1, path2);

// ExtrudeGeometry 拉伸 Shape 获得一个长方体几何体
const planeFBGeometry = new THREE.ExtrudeGeometry(shapeFB, {
    depth: 20 // 拉伸长度
});
const planeLRGeometry = new THREE.ExtrudeGeometry(shapeLR, {
    depth: 20 // 拉伸长度
});
const planeUDGeometry = new THREE.ExtrudeGeometry(shapeUD, {
    depth: 20 // 拉伸长度
});
const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ffff
});

//前后左右上下， Front, back, left, right, up, down
// 前后
const planeF = new THREE.Mesh(planeFBGeometry, planeMaterial);
planeF.position.z = 170;
planeF.name = '前面';
const planeB = planeF.clone();
planeB.position.z = -170;
planeB.name = '后面';

// 左
const planeL = new THREE.Mesh(planeLRGeometry, planeMaterial);
planeL.position.z = -10;
planeL.rotateY(Math.PI / 2);
planeL.position.z = 10;
planeL.position.x = -140;
// 右
const planeR = planeL.clone();
planeR.position.x = 140;

// 下
const planeD = new THREE.Mesh(planeUDGeometry, planeMaterial);
planeD.rotateX(Math.PI / 2);
planeD.position.y = -100;

const group = new THREE.Group();

group.add(planeF, planeB, planeL, planeR, planeD);

export default group;
