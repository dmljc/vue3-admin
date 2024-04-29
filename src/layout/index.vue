<template>
    <a-layout>
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
            <div class="logo">{{ asyncRouterMap[0].meta.title }}</div>
            <a-menu
                v-model:selectedKeys="selectedKeys"
                theme="dark"
                mode="inline"
                @click="clickMenuItem"
            >
                <a-menu-item v-for="item in asyncRouterMap[0]?.children" :key="item.path">
                    <span>{{ item.meta.title }}</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <menu-unfold-outlined
                    v-if="collapsed"
                    class="trigger"
                    @click="() => (collapsed = !collapsed)"
                />
                <menu-fold-outlined
                    v-else
                    class="trigger"
                    @click="() => (collapsed = !collapsed)"
                />
            </a-layout-header>
            <a-layout-content
                :style="{
                    margin: '24px',
                    padding: '24px',
                    background: '#fff',
                    minHeight: '280px'
                }"
            >
                <RouterView />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { asyncRouterMap } from '../router/index';

const selectedKeys = ref<string[]>(['home']);
const collapsed = ref<boolean>(true);

const router = useRouter();

const clickMenuItem = ({ key, keyPath }) => {
    selectedKeys.value = keyPath;
    router.push(key);
};
</script>
<style scoped>
.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}
.logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
}

.site-layout .site-layout-background {
    background: #fff;
}
</style>
