<template>
    <a-button type="primary" @click="addUser">新增用户</a-button>
    <a-table :columns="columns" :data-source="dataSource" bordered :scroll="{ x: 2200, y: 1000 }">
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
import CreateModal from './create-modal.vue';

const dataSource = ref([]);
const open = ref<boolean>(false);
const type = ref<string>('create');
const curRecord = ref<any>(null);

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 80,
        fixed: 'left'
    },
    {
        title: '账号',
        dataIndex: 'username'
    },
    {
        title: '密码',
        dataIndex: 'password'
    },
    {
        title: '姓名',
        dataIndex: 'name'
    },
    {
        title: '性别',
        dataIndex: 'sex',
        width: 80
    },
    {
        title: '年龄',
        dataIndex: 'age',
        width: 80
    },
    {
        title: '身份证',
        dataIndex: 'idCard',
        width: 180
    },
    {
        title: '手机',
        dataIndex: 'phone'
    },
    {
        title: '邮箱',
        dataIndex: 'phone'
    },
    {
        title: '备注',
        dataIndex: 'remark'
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 220
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: 220
    },
    {
        title: '备注',
        dataIndex: 'remark'
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        width: 120
    }
];

const getList = async () => {
    const resp = await userList();
    dataSource.value = resp?.data;
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
