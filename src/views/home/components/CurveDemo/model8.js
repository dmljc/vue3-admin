import * as THREE from 'three';

const R = 80; // 圆弧半径
const H = 200; // 直线部分高度
// 直线1
const line1 = new THREE.LineCurve(new THREE.Vector2(R, H), new THREE.Vector2(R, 0));
// 圆弧
const arc = new THREE.ArcCurve(0, 0, R, 0, Math.PI, true);
// 直线2
const line2 = new THREE.LineCurve(new THREE.Vector2(-R, H), new THREE.Vector2(-R, 0));

// CurvePath创建一个组合曲线对象
const CurvePath = new THREE.CurvePath();
// line1, arc, line2 拼接出来一个U型轮廓曲线，注意顺序
CurvePath.curves.push(line1, arc, line2);
// 获取曲线上的坐标点数量
const pointArr = CurvePath.getPoints(10);
const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointArr); //读取坐标数据赋值给几何体顶点
const material = new THREE.LineBasicMaterial({
    color: 0x00ffff
});
// 线模型
const line = new THREE.Line(geometry, material);

// 可视化 curve.getPoints 从曲线上获取的点坐标
const materialPoints = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 10
});
// 点模型
const points = new THREE.Points(geometry, materialPoints);

const group = new THREE.Group();
group.add(line, points);
export default group;
