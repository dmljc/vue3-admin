import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            // 带选项写法：http://localhost:5173/api/bar  
            // http://jsonplaceholder.typicode.com/bar
            '/api': {
                target: 'http://localhost:3000/',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
    
        }
    }
});
