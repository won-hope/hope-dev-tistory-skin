const fs = require('fs');

const skinPath = 'c:\\hope-dev-tistory-skin\\skin.html';
const cssPath = 'c:\\hope-dev-tistory-skin\\style.css';

let skin = fs.readFileSync(skinPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

/* ------------------------------------------------------------------
   1. WEATHER EFFECT FIX
   ------------------------------------------------------------------ */
// The user noted that weather effect is not visible.
// We will update style.css to bring cubism-bg-layer forward and add blend mode.
if (!css.includes('mix-blend-mode: color-dodge')) {
  css = css.replace(
    /\\.cubism-bg-layer\\s*\\{[\\s\\S]*?\\}/,
    \`.cubism-bg-layer {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  overflow: hidden; pointer-events: none; z-index: 1; /* Bring above hero background */
  mix-blend-mode: color-dodge;
  opacity: 0.9;
}\`
  );
  
  // Make sure shape colors are vibrant
  css = css.replace(
    /\\.shape-1\\s*\\{[\\s\\S]*?\\}/,
    \`.shape-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: rgba(59, 130, 246, 0.4); animation: float 20s infinite ease-in-out alternate; }\`
  );
  css = css.replace(
    /\\.shape-2\\s*\\{[\\s\\S]*?\\}/,
    \`.shape-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: rgba(147, 51, 234, 0.3); animation: float 25s infinite ease-in-out alternate-reverse; }\`
  );
  
  // Update sunny/rainy/cloudy states for higher visibility
  const weatherStatesCSS = \`
/* Weather States - High Visibility */
html[data-weather="sunny"] .shape-1 { background: rgba(253, 186, 116, 0.6) !important; }
html[data-weather="sunny"] .shape-2 { background: rgba(250, 204, 21, 0.4) !important; }

html[data-weather="cloudy"] .shape-1 { background: rgba(148, 163, 184, 0.6) !important; }
html[data-weather="cloudy"] .shape-2 { background: rgba(100, 116, 139, 0.5) !important; filter: blur(80px); }

html[data-weather="rainy"] .shape-1 { background: rgba(56, 189, 248, 0.6) !important; }
html[data-weather="rainy"] .shape-2 { background: rgba(2, 132, 199, 0.5) !important; }

html[data-weather="snowy"] .shape-1 { background: rgba(224, 242, 254, 0.7) !important; }
html[data-weather="snowy"] .shape-2 { background: rgba(248, 250, 252, 0.6) !important; }

@media (prefers-reduced-motion: reduce) {
  .cubism-shape { animation: none !important; opacity: 0.4; }
}
\`;
  css += "\\n" + weatherStatesCSS;
}

// Ensure initWeatherTheme sets defaults or isn't blocked by missing [##_var_use_weather_##]
if (skin.includes('initWeatherTheme()')) {
  // We'll replace the old options mapping if it strictly required "true"
  skin = skin.replace(
    /useWeather:\\s*'\\[##_var_use_weather_##\\]' === 'true'/g,
    "useWeather: ('[##_var_use_weather_##]' !== 'false')"
  );
}


/* ------------------------------------------------------------------
   2. POPULAR CATEGORIES LINKS
   ------------------------------------------------------------------ */
// Replace href="#" with actual category links via script
if (!skin.includes('populatePopularCategories')) {
  const popCatJS = \`
  // populatePopularCategories: Map real category links to popular cards
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
\`;
  skin = skin.replace('</body>', popCatJS + '\\n</body>');
}


/* ------------------------------------------------------------------
   3. MEGA MENU FIX
   ------------------------------------------------------------------ */
if (!css.includes('.header-nav .category_list > li:hover > ul.sub_category_list')) {
  css += \`
/* --------------------------------------------------------------------------
   Mega Menu / Header Navigation
   -------------------------------------------------------------------------- */
/* Hide "분류 전체보기" */
.header-nav .tt_category > li > a.link_tit { display: none !important; }

/* Horizontal layout for top-level categories */
.header-nav .category_list { 
  display: flex !important; 
  flex-direction: row; 
  gap: 2.5rem; 
  align-items: center; 
}
.header-nav .category_list > li { 
  position: relative; 
  padding: 1rem 0; 
}

/* Subcategories Dropdown */
.header-nav .category_list > li > ul.sub_category_list {
  position: absolute; 
  top: 100%; 
  left: 0; 
  display: none; 
  flex-direction: column;
  background: var(--surface-color);
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  padding: 1rem;
  border-radius: var(--radius-card);
  min-width: 180px;
  z-index: 100;
  border: 1px solid var(--border-color);
}
.header-nav .category_list > li:hover > ul.sub_category_list {
  display: flex !important;
  animation: fadeInDown 0.2s ease-out forwards;
}
.header-nav .category_list > li > ul.sub_category_list > li > a {
  padding: 0.6rem 1rem;
  display: block;
  color: var(--text-color);
  transition: all 0.2s;
  border-radius: 4px;
}
.header-nav .category_list > li > ul.sub_category_list > li > a:hover {
  background: var(--bg-color);
  color: var(--point-color);
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
\`;
}


/* ------------------------------------------------------------------
   4. CATEGORY HERO HEADER
   ------------------------------------------------------------------ */
// Replace existing category header with a Hero Header
const catRegex = /<div class="category-header-wrap list-only-title">[\\s\\S]*?<\\/div>/;
if (catRegex.test(skin)) {
  skin = skin.replace(catRegex, \`
        <div class="category-hero-wrap list-only-title">
          <s_list_rep>
            <div class="category-hero-inner">
              <div class="hero-bg-layer cubism-bg-layer">
                <div class="cubism-shape shape-1" style="animation-delay: -2s;"></div>
                <div class="cubism-shape shape-2" style="animation-delay: -5s;"></div>
              </div>
              <div class="category-hero-content">
                <span class="category-hero-badge">Category</span>
                <h1 class="category-hero-title">[##_list_conform_##]</h1>
                <p class="category-hero-desc">해당 카테고리의 모든 글을 모아보세요.</p>
              </div>
            </div>
          </s_list_rep>
        </div>
\`);
}

if (!css.includes('.category-hero-wrap')) {
  css += \`
/* --------------------------------------------------------------------------
   Category Hero Header
   -------------------------------------------------------------------------- */
.category-hero-wrap {
  width: 100%; margin-bottom: 4rem; position: relative; overflow: hidden;
  border-radius: 12px; background: var(--panel-surface);
  box-shadow: 0 4px 30px rgba(0,0,0,0.03);
  border: 1px solid var(--border-color);
}
.category-hero-inner {
  position: relative; padding: 6rem 2rem; text-align: center;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 280px;
}
.category-hero-inner .hero-bg-layer {
  z-index: 0; opacity: 0.5; /* Subtler in category header */
}
.category-hero-content { position: relative; z-index: 2; }
.category-hero-badge {
  display: inline-block; font-size: 0.8125rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 2px; color: var(--point-color); margin-bottom: 1rem;
}
.category-hero-title {
  font-size: 3.5rem; font-weight: 800; font-family: var(--font-sans);
  color: var(--text-color); margin-bottom: 1rem; letter-spacing: -1px;
}
.category-hero-desc { font-size: 1.125rem; color: var(--text-muted); }

/* Ensure list-only elements show properly */
body#tt-body-category .list-only-title { display: block !important; }
\`;
}


/* ------------------------------------------------------------------
   5. POST BODY RENDERING & READABILITY
   ------------------------------------------------------------------ */
if (!css.includes('body#tt-body-page .magazine-grid')) {
  css += \`
/* --------------------------------------------------------------------------
   Post Readability Fixes
   -------------------------------------------------------------------------- */
/* Prevent grid layout from breaking post detail page */
body#tt-body-page .magazine-grid { display: block !important; }

/* Readability styling */
.post-detail {
  max-width: 840px; margin: 0 auto 5rem; background: var(--surface-color);
  padding: 4rem; border-radius: var(--radius-card); box-shadow: 0 10px 40px rgba(0,0,0,0.02);
  border: 1px solid var(--border-color);
}
@media (max-width: 768px) {
  .post-detail { padding: 2rem 1.5rem; }
}

.post-body-wrap { position: relative; z-index: 2; background: transparent; }

.post-content { 
  font-family: var(--font-sans); font-size: 1.125rem; line-height: 1.8; 
  color: var(--text-color); word-break: break-word; overflow-wrap: break-word; 
}
.post-content img { max-width: 100% !important; height: auto !important; display: block; margin: 2rem auto; border-radius: 8px; }
.post-content pre { background: #1e1e1e; color: #d4d4d4; padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-family: var(--font-mono); font-size: 0.9375rem; margin: 2rem 0; }
.post-content blockquote { border-left: 4px solid var(--point-color); padding: 1rem 1.5rem; margin: 2rem 0; background: var(--bg-color); color: var(--text-muted); font-style: italic; }
.post-content table { width: 100%; border-collapse: collapse; margin: 2rem 0; display: block; overflow-x: auto; white-space: nowrap; }
.post-content th, .post-content td { border: 1px solid var(--border-color); padding: 0.75rem 1rem; }
.post-content th { background: var(--bg-color); font-weight: 700; }

.post-content h2, .post-content h3, .post-content h4 { color: var(--text-color); margin-top: 3.5rem; margin-bottom: 1.5rem; font-weight: 800; letter-spacing: -0.5px; }
.post-content h2 { font-size: 2.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; }
.post-content h3 { font-size: 1.75rem; }
\`;
}

fs.writeFileSync(skinPath, skin, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');

console.log("V3 Fixes applied successfully.");
