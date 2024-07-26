import { ref } from 'vue';
import type { SelectProps } from 'ant-design-vue';

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

// 检测当前项是否已经在数组中
export const isExist = (list: any[], item: { uuid: string }) => {
    const bool = list.some((ele) => ele.uuid === item.uuid);
    return bool;
};
