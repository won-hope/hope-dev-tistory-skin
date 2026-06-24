const fs = require('fs');

const cssPath = 'c:\\hope-dev-tistory-skin\\style.css';
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Remove old dropdown CSS
const oldDropdownStart = '  /* Sub Category Dropdown */';
const oldDropdownEnd = '  .header-nav ul ul a:hover {\n    background-color: rgba(128, 128, 128, 0.1);\n    color: var(--point-color);\n  }\n}';
if (css.includes(oldDropdownStart) && css.includes(oldDropdownEnd)) {
  const cssSplit1 = css.substring(0, css.indexOf(oldDropdownStart));
  const cssSplit2 = css.substring(css.indexOf(oldDropdownEnd) + oldDropdownEnd.length);
  css = cssSplit1 + '}' + cssSplit2; // add closing brace for media query if needed
}

// Ensure .header-inner has position relative for Mega Menu
css = css.replace('.header-inner {', '.header-inner {\n  position: relative;');

// Add Mega Menu CSS and Floating Action Bar CSS
const newUI_CSS = `
/* --------------------------------------------------------------------------
   Mega Menu Design
   -------------------------------------------------------------------------- */
.header-nav .tt_category {
  display: flex; gap: 2.5rem; margin: 0; padding: 0; list-style: none;
}
.header-nav .tt_category > li {
  position: static;
}
.header-nav .tt_category > li > .link_tit {
  font-weight: 700; color: var(--text-color); display: block; padding: 1.5rem 0; font-size: 0.9375rem; text-decoration: none;
}
.header-nav .tt_category > li > .link_tit .c_cnt { display: none; } /* Hide root count */

.header-nav .category_list {
  position: absolute; top: 100%; left: 0; right: 0; width: 100%;
  background: var(--surface-color); border-radius: 0 0 var(--radius-card) var(--radius-card);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  padding: 3rem; display: flex; gap: 3rem; opacity: 0; visibility: hidden;
  transform: translateY(-10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color); border-top: none; z-index: 1000;
  flex-wrap: wrap; list-style: none;
}
.header-nav .tt_category > li:hover .category_list {
  opacity: 1; visibility: visible; transform: translateY(0);
}

.header-nav .category_list::after {
  content: ""; display: block; flex: 1; min-width: 300px;
  background-image: url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800');
  background-size: cover; background-position: center; border-radius: var(--radius-card);
}

.header-nav .category_list > li { flex: 1; min-width: 150px; display: flex; flex-direction: column; }
.header-nav .category_list > li > .link_item {
  font-weight: 800; font-size: 0.875rem; color: var(--point-color); text-transform: uppercase;
  margin-bottom: 1.5rem; display: block; text-decoration: none; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;
}
.header-nav .sub_category_list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
.header-nav .sub_category_list > li > .link_sub_item {
  color: var(--text-color); font-size: 0.9375rem; transition: color 0.2s; display: flex; align-items: center; text-decoration: none;
}
.header-nav .sub_category_list > li > .link_sub_item::before {
  content: "✦"; color: var(--text-muted); font-size: 0.75rem; margin-right: 0.5rem; opacity: 0.5;
}
.header-nav .sub_category_list > li > .link_sub_item:hover { color: var(--point-color); }

/* --------------------------------------------------------------------------
   Floating Action Bar (Inpa Dev Style)
   -------------------------------------------------------------------------- */
.fab-container {
  position: fixed; top: 100px; right: 2rem; z-index: 999;
}
@media (max-width: 1024px) {
  .fab-container { top: auto; bottom: 2rem; right: 50%; transform: translateX(50%); }
}
.fab-inner {
  display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.5rem;
  background: var(--surface-color); border: 1px solid var(--border-color);
  border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
}
.fab-item {
  background: none; border: none; padding: 0; margin: 0; cursor: pointer; color: var(--text-muted);
  display: flex; align-items: center; transition: color 0.2s;
}
.fab-item:hover { color: var(--point-color); }
.fab-page { font-weight: 700; color: var(--text-color); gap: 0.25rem; font-size: 0.875rem; cursor: default; }
.fab-divider { width: 1px; height: 24px; background: var(--border-color); margin: 0; }
.fab-icon-wrapper { position: relative; display: inline-flex; }
.fab-badge {
  position: absolute; top: -6px; right: -10px; padding: 0.1rem 0.35rem; font-size: 0.65rem; font-weight: 800;
  color: #fff; border-radius: 10px; border: 2px solid var(--surface-color); line-height: 1;
}
.fab-badge-red { background: #FF4757; }
.fab-badge-yellow { background: #FFA502; color: #fff; }

/* Sidebar Fixes */
.star-menu-btn { z-index: 101; position: relative; pointer-events: auto; }
.header-actions { position: relative; z-index: 100; pointer-events: auto; }
`;

if (!css.includes('.fab-container')) {
  css += newUI_CSS;
  fs.writeFileSync(cssPath, css, 'utf8');
}


// 2. Add Floating Action Bar to skin.html
const skinPath = 'c:\\hope-dev-tistory-skin\\skin.html';
let skin = fs.readFileSync(skinPath, 'utf8');

const fabHTML = `
                <!-- Floating Action Bar (Sticky UI) -->
                <div class="fab-container">
                  <div class="fab-inner">
                    <div class="fab-item fab-page">
                      <span class="fab-label">Page</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    <div class="fab-divider"></div>
                    <button class="fab-item fab-like pulse-target" aria-label="공감">
                      <div class="fab-icon-wrapper">
                        <!-- Kiss Emoji SVG -->
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        <span class="fab-badge fab-badge-red" id="fabLikeCount">0</span>
                      </div>
                    </button>
                    <a href="#entry[##_article_rep_id_##]Comment" class="fab-item fab-comment" aria-label="댓글">
                      <div class="fab-icon-wrapper">
                        <!-- Comment Bubble SVG -->
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        <span class="fab-badge fab-badge-yellow">[##_article_rep_rp_cnt_##]</span>
                      </div>
                    </a>
                    <button class="fab-item fab-search search-toggle" aria-label="검색">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                  </div>
                </div>
`;

// Insert FAB into skin.html right before <s_rp>
if (!skin.includes('fab-container')) {
  skin = skin.replace('<s_rp>', fabHTML + '\n                <s_rp>');
}

// Add Script to dynamically fetch Like count if Tistory exposes it via class
const likeScript = `
    /* Fetch Tistory Native Like Count */
    setTimeout(() => {
      const nativeLikeSpan = document.querySelector('.wrap_btn .em_stat');
      const fabLikeCount = document.getElementById('fabLikeCount');
      if (nativeLikeSpan && fabLikeCount) {
        fabLikeCount.textContent = nativeLikeSpan.textContent;
      }
    }, 2000); // Delay to allow Tistory AJAX to load
`;
if (!skin.includes('fabLikeCount')) {
  skin = skin.replace('/* --------------------------------------------------------------------------\n       Theme Toggle', likeScript + '\n    /* --------------------------------------------------------------------------\n       Theme Toggle');
}

fs.writeFileSync(skinPath, skin, 'utf8');

// Copy updates to preview.html as well
const previewPath = 'c:\\hope-dev-tistory-skin\\preview.html';
let preview = fs.readFileSync(previewPath, 'utf8');
if (!preview.includes('fab-container')) {
  preview = preview.replace('<s_rp>', fabHTML + '\n                <s_rp>');
  preview = preview.replace('/* --------------------------------------------------------------------------\n       Theme Toggle', likeScript + '\n    /* --------------------------------------------------------------------------\n       Theme Toggle');
  fs.writeFileSync(previewPath, preview, 'utf8');
}

console.log("UI scripts successfully integrated.");
