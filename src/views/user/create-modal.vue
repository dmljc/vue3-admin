<template>
    <a-modal :open="open" :title="title" :width="720" @ok="handleOk" @cancel="handleCancel">
        <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
            <a-row>
                <a-col :span="12">
                    <a-form-item label="账号" name="username">
                        <a-input v-model:value="formState.username" placeholder="请输入账号" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="密码" name="password">
                        <a-input v-model:value="formState.password" placeholder="请输入密码" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="姓名" name="name">
                        <a-input v-model:value="formState.name" placeholder="请输入姓名" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="性别" name="sex">
                        <a-radio-group v-model:value="formState.sex">
                            <a-radio value="1">男</a-radio>
                            <a-radio value="2">女</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="身份证" name="idCard">
                        <a-input v-model:value="formState.idCard" placeholder="请输入身份证" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="手机" name="phone">
                        <a-input v-model:value="formState.phone" placeholder="请输入手机" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="邮箱" name="email">
                        <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="年龄" name="age">
                        <a-input v-model:value="formState.age" placeholder="请输入年龄" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="备注" name="remark">
                        <a-textarea
                            v-model:value="formState.remark"
                            :rows="4"
                            placeholder="请输入备注"
                            :maxlength="100"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="头像" name="avatar">
                        <a-upload
                            v-model:file-list="fileList"
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            list-type="picture-card"
                            @preview="() => {}"
                        >
                            <div v-if="fileList.length < 2">
                                <plus-outlined />
                                <div style="margin-top: 8px">Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, computed, watchEffect } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { createUser } from './api';

interface FormState {
    username: string;
    password: string;
    name: string;
    sex: string;
    idCard: string;
    phone: string;
    email: string;
    age: string;
    remark?: string;
    avatar?: string;
}

const props = defineProps({
    open: {
        type: Boolean,
        default: false
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
const labelCol = { span: 5 };
const wrapperCol = { span: 19 };

let formState: UnwrapRef<FormState> = reactive({
    username: '',
    password: '',
    name: '',
    sex: '1',
    idCard: '',
    phone: '',
    email: '',
    age: '',
    remark: '',
    avatar: ''
});
const fileList = ref<UploadProps['fileList']>([]);

const rules: Record<string, Rule[]> = {
    username: [{ required: true, message: '请输入账号' }],
    password: [{ required: true, message: '请输入密码' }],
    name: [{ required: true, message: '请输入姓名' }],
    sex: [{ required: true, message: '请选择性别' }],
    idCard: [{ required: true, message: '请输入身份证' }],
    phone: [{ required: true, message: '请输入手机号' }],
    email: [{ required: true, message: '请输入邮箱' }],
    age: [{ required: true, message: '请输入年龄' }],
    remark: [{ required: false, message: '请输入备注' }],
    avatar: [{ required: false, message: '请上传头像' }]
};

const title = computed(() => {
    return `${type.value === 'create' ? '新增' : '编辑'}用户信息`;
});

const resetForm = () => {
    formRef.value?.resetFields();
};

watchEffect(() => {
    if (type.value === 'update') {
        const { username, password, name, sex, idCard, phone, email, age, remark, avatar } =
            curRecord.value;
        formState.username = username;
        formState.password = password;
        formState.name = name;
        formState.sex = sex;
        formState.idCard = idCard;
        formState.phone = phone;
        formState.email = email;
        formState.age = age;
        formState.remark = remark;
        formState.avatar = avatar;
    }
});

const handleOk = () => {
    formRef?.value?.validate().then(async (res) => {
        const params = { ...res };
        if (type.value === 'update') {
            params.id = curRecord.value?.id;
        }
        await createUser(params);
        await resetForm();
        await emit('close', 'ok');
        message.success(title.value);
    });
};

const handleCancel = async () => {
    await resetForm();
    await emit('close');
};
</script>

<style lang="less" scoped></style>
