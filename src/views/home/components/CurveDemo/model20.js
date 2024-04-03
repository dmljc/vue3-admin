import * as THREE from 'three';

// 创建一个几何体对象
const geometry = new THREE.BufferGeometry();
// 三维样条曲线
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(70, 0, 80)
]);
// 曲线取点
const pointsArr = curve.getSpacedPoints(100);
// pointsArr赋值给顶点位置属性
geometry.setFromPoints(pointsArr);

// const c1 = new THREE.Color(0xff0000); // 红色 (1,0,0)
// const c2 = new THREE.Color(0x0000ff); // 蓝色 (0,0,1)
// const c = new THREE.Color(); // 白色

// c.lerpColors(c1, c2, 0);
// c1与c2颜色混合，混合后的rgb值，赋值给c1的.r、.g、.b属性。
// c1.lerp(c2, 0);
// console.log('颜色插值结果', c1); (1,0,0)
// c1.lerp(c2, 1); // 0 ,0, 1
// c1.lerp(c2, 0.5); // 0.5 ,0 ,0.5
// console.log('颜色插值结果', c1);

// 根据顶点距离起点远近进行颜色插值计算
const c1 = new THREE.Color(0x00ffff); //曲线起点颜色 青色
const c2 = new THREE.Color(0xffff00); //曲线结束点颜色 黄色
for (let i = 0; i < count; i++) {
    const percent = i / count; //点索引值相对所有点数量的百分比
    //根据顶点位置顺序大小设置颜色渐变
    const c = c1.clone().lerp(c2, percent); //颜色插值计算
    colorsArr.push(c.r, c.g, c.b);
}

// 类型数组创建顶点颜色color数据
const colors = new Float32Array(colorsArr);

// 设置几何体attributes属性的颜色color属性
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

// 线模型渲染几何体顶点颜色，可以看到直线颜色渐变效果
const material = new THREE.LineBasicMaterial({
    vertexColors: true // 默认false，设置为true表示使用顶点颜色渲染
});
const line = new THREE.Line(geometry, material);

export default line;
