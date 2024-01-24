/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier/skip-formatting'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        // 行尾需要有分号
        semi: ['error', 'always'],
        // 使用 4 个空格缩进
        indent: ['error', 4],
        // 文件名为多词语
        'vue/multi-word-component-names': 'off'
    }
};
