<template>
    <a-button type="primary" @click="addUser">新增用户</a-button>
    <a-table :columns="columns" :data-source="dataSource" bordered>
        <template #bodyCell="{ record, column }">
            <template v-if="column.dataIndex === 'action'">
                <a @click="onUpdate(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="onDelete(record)">删除</a>
            </template>
        </template>
    </a-table>

    <create-modal :open="open" :type="type" :curRecord="curRecord" @close="modalClose" />
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { userList, deleteUser } from './api';
import CreateModal from './CreateModal.vue';

const dataSource = ref([]);
const open = ref<boolean>(false);
const type = ref<string>('create');
const curRecord = ref<any>(null);

const columns = [
    {
        title: 'ID',
        dataIndex: 'id'
    },
    {
        title: '姓名',
        dataIndex: 'username'
    },
    {
        title: '性别',
        dataIndex: 'sex'
    },
    {
        title: '年龄',
        dataIndex: 'age'
    },
    {
        title: '手机号',
        dataIndex: 'phone'
    },
    {
        title: '创建时间',
        dataIndex: 'createTime'
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime'
    },
    {
        title: '备注',
        dataIndex: 'remark'
    },
    {
        title: '操作',
        dataIndex: 'action'
    }
];

const getList = async () => {
    const resp = await userList();
    dataSource.value = resp?.list;
};

getList();

const addUser = () => {
    type.value = 'create';
    open.value = true;
};

const modalClose = (type: string) => {
    open.value = false;
    if (type === 'ok') {
        getList();
    }
};

const onUpdate = (record: any) => {
    type.value = 'update';
    open.value = true;
    curRecord.value = record;
};

const onDelete = async (record) => {
    const { data } = await deleteUser({
        id: record?.id
    });
    
    data && getList();
    message.success('删除成功');
};
</script>
<style scoped></style>
