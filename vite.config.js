import { defineConfig } from 'vite';
import { resolve } from 'path';
import { execSync } from 'child_process';

function mockRenderPlugin() {
  return {
    name: 'mock-render-plugin',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('skin.html')) {
        console.log('\n[Auto-Render] skin.html 변경 감지. mock-render.js 실행 중...');
        try {
          execSync('node scripts/mock-render.js', { stdio: 'inherit' });
          console.log('[Auto-Render] 렌더링 완료! 브라우저를 새로고침합니다.');
        } catch (err) {
          console.error('[Auto-Render] 렌더링 실패:', err);
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [mockRenderPlugin()],
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
