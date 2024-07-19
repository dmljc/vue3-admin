import * as THREE from 'three';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import type { SelectProps } from 'ant-design-vue';
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
        if (
            item.object.name &&
            !item.object.name.includes('剖面序号') &&
            !item.object.name.includes('移动')
        ) {
            return item;
        }
    });
    let point: THREE.Vector3 = null;
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
    const geometry = new THREE.SphereGeometry(L / 250);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    const sphere = new THREE.Mesh(geometry, material);
    const quaternion = new THREE.Quaternion();
    sphere.quaternion.multiply(quaternion);
    const el = point.clone();
    // el.x += 0.01;
    sphere.position.copy(el);
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
    const result = [];
    result.push(startPoint, D, endPoint, C);
    // result = result.map((item) => {
    //     const el = item.clone();
    //     // el.x += 0.01;
    //     return el;
    // });
    return result;
};

/*
 *@getDistance() 获取两点之间的距离
 *@params:(startPoint: 起始点三维坐标, endPoint: 结束点三维坐标, num: 小数点后保留几位小数，默认保留2位)
 */
export const getDistance = (startPoint: THREE.Vector3, endPoint: THREE.Vector3) => {
    const len = startPoint.clone().sub(endPoint).length();
    const lenmm = parseInt(String(len * 1000)); // mm 代表毫米
    return lenmm;
};

/*
 *@drawRectWithFourPoints() 根据四个点的三维坐标画矩形
 *@parmas:(points: 4个点的三维坐标数组)
 */
export const drawRectWithFourPoints = (points: THREE.Vector3[], name?: string) => {
    // 创建多段线条的顶点数据
    const p1 = points[0]; // a,d,b,c
    const p2 = points[1];
    const p3 = points[2];
    const p4 = points[3];

    // 4条3D线段
    const line1 = new THREE.LineCurve3(p1, p2);
    const line2 = new THREE.LineCurve3(p2, p3);
    const line3 = new THREE.LineCurve3(p3, p4);
    const line4 = new THREE.LineCurve3(p4, p1);

    // CurvePath 是组合曲线的api
    const path: THREE.CurvePath<THREE.Vector3> = new THREE.CurvePath();
    path.curves.push(line1, line2, line3, line4);

    const geometry = new THREE.TubeGeometry(path.clone(), 300, 0.003);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });
    const line = new THREE.Mesh(geometry, material);
    line.name = name;
    return line;
};

/*
 *@createMarkSize() 根据起始三维坐标生成标注尺寸网格模型
 *@params:(startPoint: 起始点三维坐标, endPoint: 结束点三维坐标, length: 标注的长度尺寸)
 */
export const createMarkLength = (
    startPoint: THREE.Vector3,
    endPoint: THREE.Vector3,
    length: number,
    pageNum?: number
) => {
    const div = document.createElement('div');
    div.style.color = '#fff';
    div.innerHTML = `${length}`;

    const size = new CSS2DObject(div);
    const center = startPoint.clone().add(endPoint)?.divideScalar(2);
    size.position.copy(center);
    const eventType = 'drag';
    const type = '尺寸';
    size.name = `${eventType}-剖面序号${pageNum}-${type}`;
    size.userData = {
        pageNum,
        type,
        eventType
    };
    return size;
};

/*
 *createPageNum() 创建剖面的序号
 *@params: (startPoint: 起始点三维坐标, endPoint: 结束点三维坐标, pageNum: 当前剖面的序号)
 */
export const createPageNum = (
    startPoint: THREE.Vector3,
    endPoint: THREE.Vector3,
    pageNum: number
) => {
    const div = document.createElement('div');
    div.style.color = '#fff';
    div.style.fontSize = '80px';
    div.style.opacity = '0.4';
    div.innerHTML = `${pageNum}`;

    const pageNumber = new CSS2DObject(div);
    const center = startPoint.clone().add(endPoint)?.divideScalar(2);
    pageNumber.position.copy(center);
    const eventType = 'drag';
    const type = '序号';
    pageNumber.name = `${eventType}-剖面序号${pageNum}-${type}`;
    pageNumber.userData = {
        pageNum,
        type,
        eventType
    };
    return pageNumber;
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

/*
 *css2RendererStyle() css2d 标注的样式
 *@params: (twin: threejs 实例)
 */
export const css2RendererStyle = (twin: CreateTwin) => {
    twin.css2Renderer.domElement.style.position = 'absolute';
    twin.css2Renderer.domElement.style.top = '105px';
    twin.css2Renderer.domElement.style.pointerEvents = 'none';
};

/*
 *removeDblClicCreateRect() 销毁双击创建的剖面线和尺寸标注，释放内存
 *@params: (twin: threejs 实例)
 */
export const removeDblClicCreateRect = (twin: CreateTwin) => {
    twin.scene.traverse((obj: any) => {
        if (obj?.isLineLoop || obj?.isCSS2DObject) {
            twin.scene.remove(obj);
        }
    });
};

/*
 *drewRect() 用起始点坐标绘制剖面标注，并标注当前剖面的序号
 * @params: (startPoint: 起始点三维坐标, endPoint: 结束点三维坐标, pageNum: 当前剖面的序号)
 */
export const drewRect = (startPoint: THREE.Vector3, endPoint: THREE.Vector3, pageNum: number) => {
    const points = createRectPoints(startPoint, endPoint);
    const eventType = 'drag';
    const type = '线';
    const rect = drawRectWithFourPoints(points, `${eventType}-剖面序号${pageNum}-${type}`);
    rect.userData = {
        pageNum,
        type,
        eventType
    };

    // 逆时针顺序解构出对应的4个顶点
    const [A, D, B, C] = points;

    // 井长
    const length = getDistance(A, C);
    const sizeAC = createMarkLength(A, C, length, pageNum);
    const sizeDB = createMarkLength(D, B, length, pageNum);

    // 井宽: 注意，仅适用于需要正确标注的剖面，若在非标注剖面标注计算逻辑会受到影响
    const sWidthmm = Math.abs(startPoint.x) * 1000;
    const eWidthmm = Math.abs(endPoint.x) * 1000;
    const width = parseInt(((sWidthmm + eWidthmm) / 2).toString());

    // 井深 即 height
    const depth = getDistance(A, D);
    const sizeAD = createMarkLength(A, D, depth, pageNum);
    const sizeCB = createMarkLength(C, B, depth, pageNum);

    // 剖面序号
    const pageNumber = createPageNum(startPoint, endPoint, pageNum);

    return {
        length,
        width,
        depth,
        rect,
        sizeAC,
        sizeDB,
        sizeAD,
        sizeCB,
        pageNumber
    };
};

/*
 *deleteIcon() 删除的图标
 *@params:(point: 三维坐标,hole：管孔直径)
 */
export const deleteIcon = (point: THREE.Vector3, hole: number) => {
    const div = document.createElement('div');
    div.style.color = '#fff';
    div.style.border = '1px solid red';
    div.style.padding = '2px 4px';
    div.innerHTML = 'x';

    const delIcon = new CSS2DObject(div);
    delIcon.position.copy(point);
    const right = -hole / 2000 - 0.01;
    delIcon.translateZ(right);
    delIcon.name = `删除图标:直径${hole}`;
    return delIcon;
};

/*
 *drewCircleHole() 绘制圆形管孔
 *@params:(point: 三维坐标,hole：管孔直径)
 */
export const drewCircleHole = (point: THREE.Vector3, hole: number, pageNum: number) => {
    if (!point) {
        message.warning('请点击非管孔区域');
        return;
    }
    const radius = hole / (1000 * 2);
    const tube = 0.003; // 即圆弧线的粗细
    // 圆环几何体
    const geometry = new THREE.TorusGeometry(radius, tube);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.userData = {
        hole,
        pageNum,
        wkt: point,
    };
    sphere.position.copy(point);
    sphere.rotateY(Math.PI / 2);
    sphere.name = `圆弧管孔:直径${hole}`;
    return sphere;
};

/*
 *createHoleSize() 创建管孔尺寸
 *@params: (event: Event 对象)
 */
export const createHoleSize = (event: any) => {
    const { hole } = event.object.userData;
    const div = document.createElement('div');
    div.style.color = '#fff';
    div.innerHTML = `${hole}`;

    const holeSize = new CSS2DObject(div);
    // 以鼠标位置为中心
    holeSize.position.copy(event.object.position);
    // top 表示以鼠标位置向上移动top距离
    const top = hole / 2000 + 0.02;
    holeSize.translateY(top);
    holeSize.name = `管孔直径:${hole}`;
    return holeSize;
};

/*
 *getChromeVersion() 获取当前浏览器的版本并检测是否支持WebGPU
 *chrome 浏览器在113版本开始支持WebGPU
 */
export const getChromeVersion = () => {
    const rawUserAgent = navigator.userAgent.toLowerCase();
    const match = rawUserAgent.match(/chrome\/([\d.]+)/);

    if ('gpu' in window.navigator) {
        return console.log(`当前浏览器版本是:${match[1]}支持WebGPU。`);
    } else {
        return console.warn(`当前浏览器版本是:${match[1]}不支持WebGPU，请升级到最新版本。`);
    }
};

export const circleHoleEnum = ref<SelectProps['options']>([
    {
        value: 50,
        label: '50mm'
    },
    {
        value: 100,
        label: '100mm'
    },
    {
        value: 175,
        label: '175mm'
    }
]);

/*
 *average() 求工井长宽高的平均值
 *@params: (list:组装好的剖面数据, type：类型分别是 length，width，depth)
 */
export const average = (list: any[], type = 'width') => {
    const val =
        list.reduce((acc: number, cur: number) => acc + parseFloat(cur[type]), 0) / list.length;

    return val;
};
