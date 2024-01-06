import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Layouts from '@/layout/index.vue';

export const asyncRouterMap = [
    {
        path: '/',
        component: Layouts,
        redirect: '/home',
        meta: {
            title: 'Ant Admin'
        },
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页'
                }
            },
            {
                path: '/user',
                name: 'user',
                component: () => import('@/views/user/index.vue'),
                meta: {
                    title: '用户管理'
                }
            },
            {
                path: '/role',
                name: 'role',
                component: () => import('@/views/role/index.vue'),
                meta: {
                    title: '角色管理'
                }
            }
        ]
    }
];

export const constantRouterMap = [
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        hidden: true
    },
    {
        path: '/401',
        name: '401',
        component: () => import('@/components/Error/401.vue'),
        hidden: true
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/components/Error/403.vue'),
        hidden: true
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/components/Error/404.vue'),
        hidden: true
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...constantRouterMap, ...asyncRouterMap] as RouteRecordRaw[]
});

export default router;
