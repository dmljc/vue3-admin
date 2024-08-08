import { ref } from 'vue';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { createHoleSize } from 'twin/index';

interface Props {
    twin: any;
    holeDragList: any;
    holeNum: number;
}

const useHoleDrag = (props: Props) => {
    const { twin, holeDragList, holeNum } = props;

    let holeSize: CSS2DObject; // 管孔尺寸
    let hoverHole: THREE.Object3D<THREE.Object3DEventMap>; // 当前hover选中的圆弧管孔
    let isHoverOn: boolean = false; // 是否处于hover 状态
    const holeDragedList = ref([]); // 拖拽后更新坐标数据之后的管孔列表

    const dragControls = new DragControls(holeDragList, twin.camera, twin.renderer.domElement);
    dragControls.mode = 'translate';

    // 显示管孔尺寸
    const onHandle = (e: any) => {
        if (holeSize) {
            twin.scene.remove(holeSize);
        }
        holeSize = createHoleSize(e, holeNum);
        twin.scene.add(holeSize);
        // 对拖拽的管孔列表遍历获取最新的坐标数据
        const result = holeDragList.map((item: { uuid: string }) => {
            if (item.uuid === e.object.uuid) {
                return e.object;
            } else {
                return item;
            }
        });

        holeDragedList.value = result;
    };

    // 拖拽中
    dragControls.addEventListener('drag', (e) => {
        twin.controls.enabled = false;
        onHandle(e);
    });

    // 拖拽结束
    dragControls.addEventListener('dragend', () => {
        twin.controls.enabled = true;
    });

    // 创建右键菜单的DOM结构
    const rightMenu = document.createElement('div');
    rightMenu.style.position = 'absolute';
    rightMenu.style.display = 'none';
    rightMenu.innerHTML = `<button id='delete'>删除</button>`;
    document.body.appendChild(rightMenu);

    // 监听鼠标右键事件
    const onContextMenu = (event: any) => {
        if (!holeDragList.length) return;
        // 将菜单显示在鼠标位置
        rightMenu.style.top = event.clientY + 'px';
        rightMenu.style.left = event.clientX + 'px';
        rightMenu.style.display = 'block';
    };

    // 鼠标悬浮
    dragControls.addEventListener('hoveron', (e) => {
        isHoverOn = true;
        onHandle(e);
        hoverHole = e.object;
    });

    // 移除鼠标悬浮
    dragControls.addEventListener('hoveroff', () => {
        isHoverOn = false;
        twin.scene.remove(holeSize);
        rightMenu.style.display = 'none';
    });

    twin.renderer.domElement.addEventListener('contextmenu', (event: any) => {
        isHoverOn && onContextMenu(event);
    });

    // 删除管孔
    document.getElementById('delete')?.addEventListener('click', () => {
        let index;
        if (holeDragedList.value.length) {
            index = holeDragedList.value.findIndex(
                (item: { uuid: string }) => item.uuid === hoverHole?.uuid
            );
        } else {
            index = holeDragList.findIndex(
                (item: { uuid: string }) => item.uuid === hoverHole?.uuid
            );
        }

        // 从拖拽列表中移除
        if (holeDragedList.value.length) {
            holeDragedList.value.splice(index, 1);
        } else {
            holeDragList.splice(index, 1);
        }

        twin.scene.remove(hoverHole);
        rightMenu.style.display = 'none';
    });

    return {
        holeDragedList
    };
};

export default useHoleDrag;