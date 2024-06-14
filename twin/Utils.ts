import * as THREE from 'three';
import { CreateTwin } from './CreateTwin';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// 遍历批量销毁geometry和material
export const disposeNode = (node: THREE.Object3D) => {
    if (node instanceof THREE.Mesh) {
        if (node.geometry) {
            node.geometry.dispose();
        }

        if (node.material) {
            if (node.material instanceof Array) {
                node.material.forEach((item) => {
                    item.dispose();
                });
            }
        }

        if (node.material instanceof THREE.Material) {
            node.material.dispose();
        }
    }
};

/*
 * @box3Center() 获取包围盒中心坐标
 * @params: (mesh: 当前的网格模型对象)
 */
export const box3Center = (mesh: THREE.Object3D<THREE.Object3DEventMap>) => {
    const box3 = new THREE.Box3();
    box3.setFromObject(mesh);
    const center = new THREE.Vector3();
    box3.getCenter(center);
    mesh.position.sub(center);
    return center;
};

/*
 *@getRayCasterPoint() 获取相交点的坐标(有法线的点)
 *@params: (event: 事件对象, twin: threejs 实例)
 */
export const getRayCasterPoint = (event: MouseEvent, twin: CreateTwin) => {
    const { width, height, camera, scene } = twin;
    const px = event.offsetX;
    const py = event.offsetY;
    // 屏幕坐标转标准设备坐标
    const x = (px / width) * 2 - 1;
    const y = -(py / height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    // 在点击位置生成相交的射线
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    // 射线交叉计算拾取模型
    const intersects = raycaster.intersectObject(scene, true);
    const result = intersects?.filter((item) => {
        // 仅返回有法线的点
        if (item.normal) {
            return item;
        }
    });
    let point = null;
    if (result.length > 0) {
        // 获取模型上选中的一点坐标
        point = result[0].point;
    }
    return point;
};

/*
 *@createSphere() 生成测距线两端的红色小球
 *@params:(point:当前点的三维坐标, camera:当前实例的相机属性)
 */
export const createSphere = (point: THREE.Vector3, camera: THREE.PerspectiveCamera) => {
    const L = camera.position?.clone().sub(point).length();
    const geometry = new THREE.SphereGeometry(L / 600);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        depthTest: false
    });
    const sphere = new THREE.Mesh(geometry, material);
    const quaternion = new THREE.Quaternion();
    sphere.quaternion.multiply(quaternion);
    const el = point.clone();
    el.x += 0.01;
    sphere.position.copy(el);
    sphere.name = '小红点';
    return sphere;
};

/*
 *@createRectPoints() 通过任意2点画出对角线，然后根据对角线的两点计算出另外2个点的坐标
 *@params:(startPoint: 起始点三维坐标, endPoint: 结束点三维坐标)
 */
export const createRectPoints = (startPoint: THREE.Vector3, endPoint: THREE.Vector3) => {
    // 暂定对角线起始点分别为A,B
    // 4个点按逆时针依次是：A,D,B,C
    const C = new THREE.Vector3(endPoint.x, startPoint.y, endPoint.z);
    const D = new THREE.Vector3(startPoint.x, endPoint.y, startPoint.z);
    let result = [];
    result.push(startPoint, D, endPoint, C);
    result = result.map((item) => {
        const el = item.clone();
        el.x += 0.01;
        return el;
    });
    return result;
};

/*
 *@getDistance() 获取两点之间的距离
 *@params:(startPoint: 起始点三维坐标, endPoint: 结束点三维坐标, num: 小数点后保留几位小数，默认保留2位)
 */
export const getDistance = (startPoint: THREE.Vector3, endPoint: THREE.Vector3, num = 2) => {
    return startPoint.clone().sub(endPoint).length().toFixed(num);
};

/*
 *@drawRectWithFourPoints() 根据四个点的三维坐标画矩形
 *@parmas:(points: 4个点的三维坐标数组)
 */
export const drawRectWithFourPoints = (points: THREE.Vector3[]) => {
    const material = new THREE.LineBasicMaterial({
        color: 0xff0000
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineLoop(geometry, material);
    return line;
};

/*
 *@createMarkSize() 根据起始三维坐标生成标注尺寸网格模型
 *@params:(startPoint: 起始点三维坐标, endPoint: 结束点三维坐标, length: 标注的长度尺寸)
 */
export const createMarkLength = (
    startPoint: THREE.Vector3,
    endPoint: THREE.Vector3,
    length: string
) => {
    const div = document.createElement('div');
    div.style.color = '#fff';
    div.innerHTML = `${length}米`;

    const size = new CSS2DObject(div);
    const center = startPoint.clone().add(endPoint)?.divideScalar(2);
    size.position.copy(center);
    size.name = '标注尺度';
    return size;
};

/*
 *@createLine() 两点创建一条线段
 *@params:(startPoint: 起始点三维坐标, endPoint: 结束点三维坐标)
 */
export const createLine = (startPoint: THREE.Vector3, endPoint: THREE.Vector3) => {
    const { x: x1, y: y1, z: z1 } = startPoint;
    const { x: x2, y: y2, z: z2 } = endPoint;
    const material = new THREE.LineBasicMaterial({
        color: 0xffff00,
        depthTest: false
    });
    // 创建一个几何体对象
    const geometry = new THREE.BufferGeometry();
    // 类型数组创建顶点数据
    const vertices = new Float32Array([x1, y1, z1, x2, y2, z2]);
    geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);
    const line = new THREE.LineSegments(geometry, material);
    return line;
};
