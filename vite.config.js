import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        style: resolve(__dirname, 'src/css/style.css'),
        script: resolve(__dirname, 'src/js/main.js'),
      },
      output: {
        entryFileNames: 'images/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return 'images/[name].[ext]';
        }
      }
    },
  }
});
