import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

const useModel = (props) => {
    const { scene, camera, renderer, css2Renderer, hole, width, height, dragHole } = props;
    const markSizeGroup = new THREE.Group(); //所有标注对象插入，方便整体控制尺寸标签隐藏或显示

    const holeMarkSizeGroup = new THREE.Group();

    // 射线拾取选择场景模型表面任意点xyz坐标
    const rayChoosePoint = (event) => {

        const px = event.offsetX;
        const py = event.offsetY;
        //屏幕坐标转标准设备坐标
        const x = (px / width) * 2 - 1;
        const y = -(py / height) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        //.setFromCamera()在点击位置生成raycaster的射线ray
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        // 射线交叉计算拾取模型
        const intersects = raycaster.intersectObject(scene, true);

        const result = intersects?.filter((item) => {
            if (item.normal) {
                return item;
            }
        });
        let v3 = null;
        if (result.length > 0) {
            // 获取模型上选中的一点坐标
            v3 = result[0].point;
        }
        return v3;
    };

    // 标注线不进行深度测试，渲染顺序放在最后
    // 3D场景中，用有粗细的线条
    // 两点绘制一条直线 用于标注尺寸
    const createLine = (p1, p2) => {
        const material = new THREE.LineBasicMaterial({
            color: 0xffff00,
            depthTest: false //不进行深度测试，后渲染，叠加在其它模型之上(解决两个问题)
            // 1.穿过模型，在内部看不到线条
            // 2.线条与mesh重合时候，深度冲突不清晰
        });
        const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
        //类型数组创建顶点数据
        const vertices = new Float32Array([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]);
        geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);
        const line = new THREE.LineSegments(geometry, material);
        return line;
    };

    // 4点画一个矩形
    const usefourPointsDrewRect = (points) => {
        const material = new THREE.LineBasicMaterial({
            color: 0xff0000
        });
    
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        const line = new THREE.LineLoop( geometry, material );
        return line;
    };

    // 线两头的球体
    const createSphere = (p1) => {
        const L = camera.position?.clone().sub(p1).length();
        const geometry = new THREE.SphereGeometry(L / 500);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            depthTest: false
        });
        const mesh = new THREE.Mesh(geometry, material);
        const quaternion = new THREE.Quaternion();
        mesh.quaternion.multiply(quaternion);
        mesh.position.copy(p1);
        return mesh;
    };

    // 计算模型上选中两点的距离
    const getDistance = (p1, p2) => {
        return p1.clone().sub(p2).length();
    };

    // 标注尺寸的组件
    const sizeTag = (p1, p2, size) => {
        const line = createLine(p1, p2);
        line.name = '测距用的线段';
        markSizeGroup.add(line);

        const sphere1 = createSphere(p1);
        sphere1.name = '测距用的线两端的球1';
        markSizeGroup.add(sphere1);
        const sphere2 = createSphere(p2);
        sphere2.name = '测距用的线两端的球2';
        markSizeGroup.add(sphere2);

        // CSS2 渲染标注
        const div = document.createElement('div');
        div.style.color = '#ffffff';
        div.textContent = size + 'm';

        const tag = new CSS2DObject(div);
        const center = p1.clone().add(p2).divideScalar(2);
        tag.position.copy(center);
        tag.name = '测距用的显示距离数据的浮层';
        markSizeGroup.add(tag);
        markSizeGroup.name = '测距模块';

        scene.add(markSizeGroup);

        cssRendererFn();
    };

    // 画管孔
    const drewHole = (point) => {
        const radius = hole.value / 2;
        const markRadius = radius / 1000;
        const geometry = new THREE.CircleGeometry(markRadius);
        const material = new THREE.MeshLambertMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.name = `管孔-${hole.value}`;
        sphere.position.copy(point);
        sphere.rotateY(Math.PI / 2);

        // if (point.x > 0) {
        //     sphere.translateZ(point.z - 0.01);
        // } else {
        sphere.translateZ(0.01);
        // }
        
        holeMarkSizeGroup.add(sphere);
        holeMarkSizeGroup.name = `管孔标注组-${hole.value}`;

        const { markSizeMesh } = createMarkSize(point, hole.value, '管孔标注');
        holeMarkSizeGroup.add(markSizeMesh);
        scene.add(holeMarkSizeGroup);
        cssRendererFn();
    };

    // 创建标注尺寸
    const createMarkSize = (point, size, name) => {
        const div = document.createElement('div');
        div.style.color = '#ffffff';
        div.textContent = size;
        // div.style.padding = '40px';
        // div.style.border = '1px solid red';

        const markSizeMesh = new CSS2DObject(div);
        markSizeMesh.position.copy(point);
        markSizeMesh.name = `${name}-${size}`;
        // const radius = size / 2;
        // const markRadius = radius / 1000;
        // markSizeMesh.position.y = point.y + markRadius + 0.01;
        markSizeMesh.rotateY(Math.PI / 2);

        if (point.x > 0) {
            markSizeMesh.translateZ(-0.01);
        } else {
            markSizeMesh.translateZ(0.01);
        }

        cssRendererFn();

        return {
            markSizeMesh
        };
    };

    const cssRendererFn = () => {
        css2Renderer.domElement.style.position = 'absolute';
        css2Renderer.domElement.style.top = '100px';
        css2Renderer.domElement.style.border = '10px solod red';
        css2Renderer.domElement.style.pointerEvents = 'none';

        renderer.render(scene, camera);
        css2Renderer.render(scene, camera);
    };

    return {
        rayChoosePoint,
        createLine,
        createSphere,
        getDistance,
        drewHole,
        sizeTag,
        markSizeGroup,
        usefourPointsDrewRect,
    };
};

export default useModel;
