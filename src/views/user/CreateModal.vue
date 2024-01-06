<template>
    <a-modal :open="open" :title="title" @ok="handleOk" @cancel="handleCancel">
        <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
            <a-form-item label="用户名" name="username">
                <a-input v-model:value="formState.username" placeholder="请输入用户名" />
            </a-form-item>
            <a-form-item label="性别" name="sex">
                <a-radio-group v-model:value="formState.sex">
                    <a-radio value="1">男</a-radio>
                    <a-radio value="2">女</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="年龄" name="age">
                <a-input v-model:value="formState.age" placeholder="请输入年龄" />
            </a-form-item>
            <a-form-item label="手机" name="phone">
                <a-input v-model:value="formState.phone" placeholder="请输入手机" />
            </a-form-item>
            <a-form-item label="备注" name="remark">
                <a-textarea
                    v-model:value="formState.remark"
                    :rows="4"
                    placeholder="请输入备注"
                    :maxlength="100"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, computed, watchEffect } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { createUser } from './api';

interface FormState {
    username: string;
    sex: string;
    age: string;
    phone: string;
    remark: string;
}

const props = defineProps({
    open: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        default: 'create'
    },
    curRecord: {
        type: Object,
        default: () => ({})
    }
});

const { open, type, curRecord } = toRefs(props);

const emit = defineEmits(['close']);

const formRef = ref();
const labelCol = { span: 4 };
const wrapperCol = { span: 19 };

let formState: UnwrapRef<FormState> = reactive({
    username: '',
    sex: '1',
    age: '',
    phone: '',
    remark: ''
});

const rules: Record<string, Rule[]> = {
    username: [{ required: true, message: '请输入用户名' }],
    sex: [{ required: true, message: '请选择性别' }],
    age: [{ required: true, message: '请输入年龄' }],
    phone: [{ required: true, message: '请输入手机号' }],
    remark: [{ required: false, message: '请输入备注' }]
};

const title = computed(() => {
    return `${type.value === 'create' ? '新增' : '编辑'}用户信息`;
});

const resetForm = () => {
    formRef.value?.resetFields();
};

watchEffect(() => {
    if (type.value === 'update') {
        const { username, sex, age, phone, remark } = curRecord.value;
        formState.username = username;
        formState.sex = sex;
        formState.age = age;
        formState.phone = phone;
        formState.remark = remark;
    }
});

const handleOk = () => {
    formRef.value?.validate().then(async (res) => {
        const params = { ...res };
        if (type.value === 'update') {
            params.id = curRecord.value?.id;
        }
        await createUser(params);
        emit('close', 'ok');
        resetForm();
        message.success(title.value);
    });
};

const handleCancel = () => {
    emit('close');
    resetForm();
};
</script>
