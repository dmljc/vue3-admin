<template>
    <a-config-provider :locale="zhCN" :getPopupContainer="getPopupContainer">
        <RouterView />
    </a-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale(zhCN.locale);

const getPopupContainer = (el, dialogContext) => {
    if (dialogContext) {
        return dialogContext.getDialogWrap();
    } else {
        return document.body;
    }
};
</script>
<style scoped></style>
