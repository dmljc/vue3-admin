<template>
    <a-form
        :model="formState"
        name="login"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
    >
        <a-form-item
            label="账号"
            name="username"
            :rules="[{ required: false, message: '请输入账号!' }]"
        >
            <a-input v-model:value="formState.username" placeholder="请输入账号" />
        </a-form-item>

        <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: false, message: '请输入密码!' }]"
        >
            <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit" style="width: 63%">登录</a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { reactive } from 'vue';
import { login } from './api';

interface FormState {
    username: string;
    password: string;
}

const formState = reactive<FormState>({
    username: '',
    password: ''
});
const onFinish = async (values: any) => {
    console.log('Success:', values);
    const { success } = await login(values);
    if (success) {
        message.success('登录成功');
    }
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
</script>
