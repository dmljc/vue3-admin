import * as THREE from 'three';

// 绘制椭圆弧线
// 参数1和2表示椭圆中心坐标，参数3和4表示x和y方向半径
const arc = new THREE.EllipseCurve(0, 0, 100, 50);

// getPoints 返回 Vector2 对象作为元素组成的数组;
// 分段数50，返回51个顶点
const pointsArr = arc.getPoints(50);

// getSpacedPoints 函数表示 曲线上等间距取点
// const pointsArr = arc.getSpacedPoints(50);

const geometry = new THREE.BufferGeometry();

// 缓冲类型几何体 BufferGeometry
// threejs的长方体BoxGeometry、球体SphereGeometry等几何体都是基于BufferGeometry 类构建的，
// BufferGeometry是一个没有任何形状的空几何体，你可以通过BufferGeometry自定义任何几何形状，具体一点说就是定义顶点数据。

// 把数组 pointsArr 里的坐标数据取出来，给 geometry.attributes.position 赋值
geometry.setFromPoints(pointsArr);

// 点材质
// const material = new THREE.PointsMaterial({
//     color: 0x00ffff,
//     size: 1 //点对象像素尺寸
// });

// 点模型
// const points = new THREE.Points(geometry, material);

// 线材质
const material = new THREE.LineBasicMaterial({
    color: 0x00ffff
});

// 线模型
const model = new THREE.Line(geometry, material);

export default model;
