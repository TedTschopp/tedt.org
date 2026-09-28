import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
export default defineConfig({
 base:'/inside-ai/assets/',
 plugins:[svelte({preprocess:vitePreprocess()})],
 resolve:{conditions:['onnxruntime-web-use-extern-wasm'],alias:{'~':fileURLToPath(new URL('./src',import.meta.url))}},
 css:{preprocessorOptions:{scss:{additionalData:"@import 'src/styles/variables.scss';"}}},
 build:{outDir:'../../inside-ai/assets',emptyOutDir:true,assetsInlineLimit:0,cssCodeSplit:false,rollupOptions:{input:'src/main.js',output:{entryFileNames:'inside-ai.js',chunkFileNames:'[name]-[hash].js',assetFileNames: a => a.names?.some(n=>n.endsWith('.css'))?'inside-ai.css':'[name]-[hash][extname]'}}},
 worker:{format:'es'}
});
