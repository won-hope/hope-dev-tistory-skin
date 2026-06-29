const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcCssDir = path.join(rootDir, 'src', 'css');
const srcJsDir = path.join(rootDir, 'src', 'js');

// Create directories
[srcCssDir, srcJsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('📦 1. src 폴더 구조 생성 완료');

// --- 1. CSS 분할 ---
const originalCssPath = path.join(rootDir, 'style.css');
if (fs.existsSync(originalCssPath)) {
  const cssContent = fs.readFileSync(originalCssPath, 'utf8');
  
  const splitMarker = '/* ==========================================================================\r\n   [Premium] Nature Dashboard';
  const splitMarkerUnix = '/* ==========================================================================\n   [Premium] Nature Dashboard';
  
  let splitIndex = cssContent.indexOf(splitMarker);
  if (splitIndex === -1) splitIndex = cssContent.indexOf(splitMarkerUnix);

  if (splitIndex !== -1) {
    const legacyCss = cssContent.substring(0, splitIndex);
    const dashboardCss = cssContent.substring(splitIndex);

    fs.writeFileSync(path.join(srcCssDir, '_legacy.css'), legacyCss);
    fs.writeFileSync(path.join(srcCssDir, '_dashboard.css'), dashboardCss);
    
    const entryCss = `
@import './_legacy.css';
@import './_dashboard.css';
`;
    fs.writeFileSync(path.join(srcCssDir, 'style.css'), entryCss.trim());
    console.log('🎨 2. CSS 모듈 분할 완료 (style.css -> src/css)');
  } else {
    fs.writeFileSync(path.join(srcCssDir, '_legacy.css'), cssContent);
    fs.writeFileSync(path.join(srcCssDir, 'style.css'), `@import './_legacy.css';`);
    console.log('🎨 2. CSS 이동 완료 (style.css -> src/css/_legacy.css)');
  }
}

// --- 2. JS 분할 ---
const originalJsPath = path.join(rootDir, 'images', 'script.js');
if (fs.existsSync(originalJsPath)) {
  const jsContent = fs.readFileSync(originalJsPath, 'utf8');
  
  const jsSplitMarker = '  /* -------------------------------------------------------------\r\n     [Premium] Nature CountUp Animation';
  const jsSplitMarkerUnix = '  /* -------------------------------------------------------------\n     [Premium] Nature CountUp Animation';
  
  let jsSplitIndex = jsContent.indexOf(jsSplitMarker);
  if (jsSplitIndex === -1) jsSplitIndex = jsContent.indexOf(jsSplitMarkerUnix);

  if (jsSplitIndex !== -1) {
    let legacyJs = jsContent.substring(0, jsSplitIndex);
    const bottomPart = jsContent.substring(jsSplitIndex);
    
    const domLoadedIndex = bottomPart.lastIndexOf('document.addEventListener');
    
    let dashboardJsRaw = bottomPart;
    if (domLoadedIndex !== -1) {
        dashboardJsRaw = bottomPart.substring(0, domLoadedIndex);
        const closing = bottomPart.substring(domLoadedIndex);
        let modifiedClosing = closing
          .replace('initNatureCountUp();', '')
          .replace('init3DTiltCards();', '')
          .replace('initHeroParticles();', '');
        legacyJs += modifiedClosing;
    }

    let dashboardJs = dashboardJsRaw
      .replace('function initNatureCountUp', 'export function initNatureCountUp')
      .replace('function init3DTiltCards', 'export function init3DTiltCards')
      .replace('function initHeroParticles', 'export function initHeroParticles');

    dashboardJs = `
// --- Throttling Utility ---
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

${dashboardJs}
    `;

    dashboardJs = dashboardJs.replace(
      `card.addEventListener('mousemove', (e) => {`,
      `card.addEventListener('mousemove', throttle((e) => {`
    ).replace(
      `glare.style.background = \`radial-gradient(circle at \${x}px \${y}px, rgba(255,255,255,0.3) 0%, transparent 60%)\`;\n      });`,
      `glare.style.background = \`radial-gradient(circle at \${x}px \${y}px, rgba(255,255,255,0.3) 0%, transparent 60%)\`;\n      }, 16));`
    );
    
    dashboardJs = dashboardJs.replace(
      `document.querySelector('.hero-section').addEventListener('mousemove', function(event) {`,
      `document.querySelector('.hero-section').addEventListener('mousemove', throttle(function(event) {`
    ).replace(
      `mouse.y = event.clientY - rect.top;\n    });`,
      `mouse.y = event.clientY - rect.top;\n    }, 16));`
    );

    fs.writeFileSync(path.join(srcJsDir, '_legacy.js'), legacyJs);
    fs.writeFileSync(path.join(srcJsDir, 'dashboard.js'), dashboardJs);
    
    const mainJs = `
import './_legacy.js';
import { initNatureCountUp, init3DTiltCards, initHeroParticles } from './dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
  initNatureCountUp();
  init3DTiltCards();
  initHeroParticles();
});
`;
    fs.writeFileSync(path.join(srcJsDir, 'main.js'), mainJs.trim());
    console.log('📜 3. JS 모듈 분할 및 스로틀링(Throttle) 최적화 완료 (src/js)');
  }
}

// --- 3. HTML 동기화 스크립트 (sync-html.js) 생성 ---
const syncScript = `
const fs = require('fs');
const path = require('path');

const skinHtmlPath = path.join(__dirname, 'skin.html');
const previewHtmlPath = path.join(__dirname, 'preview.html');

if (!fs.existsSync(skinHtmlPath)) {
  console.error('skin.html not found!');
  process.exit(1);
}

let skinContent = fs.readFileSync(skinHtmlPath, 'utf8');

// Replace Tistory specific tags for preview
const replacements = {
  '[##_page_title_##]': 'Preview',
  '[##_title_##]': 'Hope Devlog',
  '[##_desc_##]': 'This is a preview page',
  '[##_image_##]': 'https://tistory.com/default.jpg',
  '[##_blog_url_##]': 'http://localhost:5173',
  '[##_rss_url_##]': '#',
  '[##_var_theme_mode_##]': 'system',
  '[##_var_hero_keywords_##]': 'Developer, Designer, Creator',
  '[##_var_theme_style_##]': 'cosmic',
  '[##_var_motion_level_##]': 'high',
  '[##_var_use_weather_##]': 'true',
  '[##_var_show_weather_badge_##]': 'true',
  '[##_var_auto_weather_theme_##]': 'true',
  '[##_var_weather_greeting_##]': 'true',
  '[##_var_blog_start_date_##]': '2024-01-01',
  '[##_body_id_##]': 'tt-body-page',
  '<s_article_rep>': '<div>',
  '</s_article_rep>': '</div>',
};

for (const [key, value] of Object.entries(replacements)) {
  skinContent = skinContent.split(key).join(value);
}

// Fix asset paths for Vite dev server (point to src instead of root)
skinContent = skinContent.replace(/href="\\.\\/style\\.css"/, 'href="/src/css/style.css"');

// Fix script path for Vite
skinContent = skinContent.replace(/<\\/body>/, '  <script type="module" src="/src/js/main.js"></script>\\n</body>');

fs.writeFileSync(previewHtmlPath, skinContent);
console.log('🔄 skin.html -> preview.html 동기화 완료!');
`;

fs.writeFileSync(path.join(rootDir, 'sync-html.js'), syncScript.trim());
console.log('⚙️ 4. HTML 동기화 스크립트(sync-html.js) 생성 완료');

console.log('');
console.log('🎉 마이그레이션 스크립트 실행이 완료되었습니다!');
console.log('다음 명령어를 실행하여 빌드 및 동기화를 확인하세요:');
console.log('1. node sync-html.js (HTML 동기화)');
console.log('2. npm run build (Vite 배포용 빌드)');
