const fs = require('fs');

const skinPath = 'c:\\hope-dev-tistory-skin\\skin.html';
const cssPath = 'c:\\hope-dev-tistory-skin\\style.css';

let skin = fs.readFileSync(skinPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

/* =========================================================================
   1. WEATHER EFFECT FIX
   ========================================================================= */
if (skin.includes("'[##_var_use_weather_##]' === 'true'")) {
  skin = skin.replace(
    "'[##_var_use_weather_##]' === 'true'", 
    "('[##_var_use_weather_##]' !== 'false')"
  );
}

const weatherCSS = `
/* --------------------------------------------------------------------------
   Weather Effects (Enhanced Visibility)
   -------------------------------------------------------------------------- */
.cubism-bg-layer {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1;
  mix-blend-mode: color-dodge;
  opacity: 0.8;
}
.cubism-shape {
  position: absolute; filter: blur(60px); border-radius: 50%;
  animation: float 20s infinite ease-in-out alternate;
  opacity: 0.9;
}
.shape-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: rgba(59, 130, 246, 0.4); animation-delay: 0s; }
.shape-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: rgba(147, 51, 234, 0.3); animation-delay: -5s; }
.shape-3 { top: 40%; left: 60%; width: 40vw; height: 40vw; background: rgba(236, 72, 153, 0.3); animation-delay: -10s; }

html[data-weather="sunny"] .shape-1 { background: rgba(253, 186, 116, 0.6); }
html[data-weather="sunny"] .shape-2 { background: rgba(250, 204, 21, 0.4); }

html[data-weather="cloudy"] .shape-1 { background: rgba(148, 163, 184, 0.6); }
html[data-weather="cloudy"] .shape-2 { background: rgba(100, 116, 139, 0.5); filter: blur(80px); }

html[data-weather="rainy"] .shape-1 { background: rgba(56, 189, 248, 0.6); }
html[data-weather="rainy"] .shape-2 { background: rgba(2, 132, 199, 0.5); }

html[data-weather="snowy"] .shape-1 { background: rgba(224, 242, 254, 0.7); }
html[data-weather="snowy"] .shape-2 { background: rgba(248, 250, 252, 0.6); }

@media (prefers-reduced-motion: reduce) {
  .cubism-shape { animation: none !important; opacity: 0.4; }
  .meteor-canvas { display: none !important; }
}
`;

if (!css.includes('mix-blend-mode: color-dodge;')) {
  css += weatherCSS;
}


/* =========================================================================
   2. POPULAR CATEGORIES LINKS
   ========================================================================= */
const popCatJS = `
  // Populate Popular Categories
  document.addEventListener('DOMContentLoaded', () => {
    const catLinks = document.querySelectorAll('.header-nav .category_list > li > a');
    const popCards = document.querySelectorAll('.popular-categories-section .cat-card');
    if(catLinks.length > 0 && popCards.length > 0) {
      for(let i=0; i<popCards.length; i++) {
        if(catLinks[i]) {
          const match = catLinks[i].textContent.match(/(.*?)\\s*\\((\\d+)\\)/);
          let name = catLinks[i].textContent;
          let count = '0';
          if(match) { name = match[1].trim(); count = match[2]; }
          
          popCards[i].href = catLinks[i].href;
          popCards[i].querySelector('.cat-name').textContent = name;
          popCards[i].querySelector('.cat-count').textContent = count + " Articles";
        } else {
          popCards[i].style.display = 'none';
        }
      }
    }
  });
`;

if (!skin.includes('Populate Popular Categories')) {
  skin = skin.replace('</script>', popCatJS + '\\n  </script>');
}


/* =========================================================================
   3. MEGA MENU FIX
   ========================================================================= */
const menuCSS = `
/* Hide "분류 전체보기" */
.header-nav .tt_category > li > a.link_tit { display: none !important; }

/* Display main categories horizontally */
.header-nav .category_list { 
  display: flex !important; 
  flex-direction: row; 
  gap: 2rem; 
  align-items: center; 
}
.header-nav .category_list > li { 
  position: relative; 
  padding: 1rem 0; 
}

/* Hover dropdown */
.header-nav .category_list > li > ul.sub_category_list {
  position: absolute; 
  top: 100%; 
  left: 0; 
  display: none; 
  flex-direction: column;
  background: var(--surface-color);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 1rem;
  border-radius: var(--radius-card);
  min-width: 150px;
  z-index: 100;
}
.header-nav .category_list > li:hover > ul.sub_category_list {
  display: flex !important;
}
.header-nav .category_list > li > ul.sub_category_list > li > a {
  padding: 0.5rem 1rem;
  display: block;
  color: var(--text-color);
  transition: background 0.2s;
  border-radius: 4px;
}
.header-nav .category_list > li > ul.sub_category_list > li > a:hover {
  background: rgba(0,0,0,0.05);
  color: var(--point-color);
}
`;

if (!css.includes('.header-nav .category_list > li:hover > ul.sub_category_list')) {
  css += menuCSS;
}


/* =========================================================================
   4. CATEGORY HERO HEADER
   ========================================================================= */
const oldCategoryHeader = \`        <div class="category-header-wrap list-only-title">
          <s_list_rep>
            <h1 class="category-title">[##_list_conform_##]</h1>
            <div class="category-divider"></div>
            <p class="category-desc">공부한 내용을 정리합니다</p>
          </s_list_rep>
        </div>\`;

const newCategoryHero = \`        <div class="category-hero-wrap list-only-title">
          <s_list_rep>
            <div class="category-hero-inner">
              <div class="hero-bg-layer cubism-bg-layer">
                <div class="cubism-shape shape-1"></div>
                <div class="cubism-shape shape-2"></div>
              </div>
              <div class="category-hero-content">
                <span class="category-hero-badge">Category</span>
                <h1 class="category-hero-title">[##_list_conform_##]</h1>
                <p class="category-hero-desc">해당 카테고리의 모든 글을 모아보세요.</p>
              </div>
            </div>
          </s_list_rep>
        </div>\`;

if (skin.includes('category-header-wrap')) {
  skin = skin.replace(oldCategoryHeader, newCategoryHero);
}

const heroCSS = \`
.category-hero-wrap {
  width: 100%; margin-bottom: 4rem; position: relative; overflow: hidden;
  border-radius: var(--radius-card); background: var(--panel-surface);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.category-hero-inner {
  position: relative; padding: 5rem 2rem; text-align: center;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 250px;
}
.category-hero-content { position: relative; z-index: 2; }
.category-hero-badge {
  display: inline-block; font-size: 0.8125rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 2px; color: var(--point-color); margin-bottom: 1rem;
}
.category-hero-title {
  font-size: 3rem; font-weight: 800; font-family: 'Pretendard', sans-serif;
  color: var(--text-color); margin-bottom: 1rem;
}
.category-hero-desc { font-size: 1.125rem; color: var(--text-muted); }
\`;

if (!css.includes('.category-hero-wrap')) {
  css += heroCSS;
}


/* =========================================================================
   5. POST BODY RENDERING & READABILITY
   ========================================================================= */
const postBodyCSS = \`
body#tt-body-page .magazine-grid { display: block !important; }

.post-detail {
  max-width: 800px; margin: 0 auto; background: var(--surface-color);
  padding: 3rem; border-radius: var(--radius-card); box-shadow: 0 10px 40px rgba(0,0,0,0.05);
}

.post-body-wrap { position: relative; z-index: 1; background: var(--surface-color); }

.post-content { font-family: var(--font-sans); font-size: 1.125rem; line-height: 1.8; color: #333; word-break: break-word; overflow-wrap: break-word; }
.post-content img { max-width: 100% !important; height: auto !important; display: block; margin: 2rem auto; border-radius: 8px; }
.post-content pre { background: #1e1e1e; color: #d4d4d4; padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-family: var(--font-mono); font-size: 0.9375rem; margin: 2rem 0; }
.post-content blockquote { border-left: 4px solid var(--point-color); padding: 1rem 1.5rem; margin: 2rem 0; background: var(--bg-color); color: var(--text-muted); font-style: italic; }
.post-content table { width: 100%; border-collapse: collapse; margin: 2rem 0; display: block; overflow-x: auto; white-space: nowrap; }
.post-content th, .post-content td { border: 1px solid var(--border-color); padding: 0.75rem 1rem; }
.post-content th { background: var(--bg-color); font-weight: 700; }

.post-content h2, .post-content h3, .post-content h4 { color: var(--text-color); margin-top: 3rem; margin-bottom: 1.5rem; font-weight: 800; }
.post-content h2 { font-size: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
.post-content h3 { font-size: 1.5rem; }
\`;

if (!css.includes('body#tt-body-page .magazine-grid')) {
  css += postBodyCSS;
}

fs.writeFileSync(skinPath, skin, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');

console.log("V2 Fixes applied successfully.");
