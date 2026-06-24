const fs = require('fs');

const skinPath = 'c:\\hope-dev-tistory-skin\\skin.html';
const cssPath = 'c:\\hope-dev-tistory-skin\\style.css';
const previewPath = 'c:\\hope-dev-tistory-skin\\preview.html';

let skin = fs.readFileSync(skinPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');
let preview = fs.readFileSync(previewPath, 'utf8');

/* =========================================================================
   1. MEGA MENU & SIDEBAR FIXES
   ========================================================================= */

// Update CSS to target both .tt_category (live) and direct ul (preview)
css = css.replace('.header-nav .tt_category {', '.header-nav > ul, .header-nav .tt_category {');
css = css.replace('.header-nav .tt_category > li {', '.header-nav > ul > li, .header-nav .tt_category > li {');
css = css.replace('.header-nav .tt_category > li > .link_tit {', '.header-nav > ul > li > a, .header-nav .tt_category > li > .link_tit {');
css = css.replace('.header-nav .tt_category > li > .link_tit .c_cnt {', '.header-nav > ul > li > a .c_cnt, .header-nav .tt_category > li > .link_tit .c_cnt {');

// Change category_list flex wrap to Grid for better spacing alignment
const oldCategoryListCSS = `  padding: 3rem; display: flex; gap: 3rem; opacity: 0; visibility: hidden;`;
const newCategoryListCSS = `  padding: 3rem; display: grid; grid-template-columns: repeat(4, 1fr) 300px; gap: 3rem; opacity: 0; visibility: hidden;`;
if (css.includes(oldCategoryListCSS)) {
  css = css.replace(oldCategoryListCSS, newCategoryListCSS);
}

// Remove old flex rules for category list children
css = css.replace('.header-nav .category_list > li { flex: 1; min-width: 150px; display: flex; flex-direction: column; }', '.header-nav .category_list > li { display: flex; flex-direction: column; }');
css = css.replace('.header-nav .category_list::after {', '.header-nav .category_list::after {\n  grid-column: 5;');
css = css.replace('.header-nav .tt_category > li:hover .category_list {', '.header-nav > ul > li:hover ul, .header-nav .tt_category > li:hover .category_list {');


/* =========================================================================
   2. INDEX CARD GRID (INPA STYLE)
   ========================================================================= */

const oldIndexRepStart = '<s_index_article_rep>';
const oldIndexRepEnd = '</s_index_article_rep>';

const newIndexCardHTML = `<s_index_article_rep>
              <article class="inpa-card">
                <a href="[##_article_rep_link_##]" class="inpa-card-link">
                  <div class="inpa-card-thumb">
                    <div class="inpa-card-fallback">
                       <svg viewBox="0 0 100 100" width="60" height="60" fill="rgba(0,0,0,0.1)"><path d="M20,20 h60 v60 h-60 z"/><text x="50" y="55" font-size="20" text-anchor="middle" font-weight="bold" fill="rgba(0,0,0,0.3)">HTML</text></svg>
                    </div>
                    <s_article_rep_thumbnail>
                      <img src="[##_article_rep_thumbnail_url_##]" alt="thumbnail" class="inpa-card-img">
                    </s_article_rep_thumbnail>
                  </div>
                  <div class="inpa-card-body">
                    <span class="inpa-card-badge">[##_article_rep_category_##]</span>
                    <h3 class="inpa-card-title">[##_article_rep_title_##]</h3>
                    <p class="inpa-card-desc">[##_article_rep_summary_##]</p>
                  </div>
                  <div class="inpa-card-footer">
                    <div class="inpa-author-info">
                      <img src="[##_image_##]" alt="avatar" class="inpa-avatar" onerror="this.style.display='none'">
                      <div class="inpa-author-text">
                        <span class="inpa-author">[##_blogger_##]</span>
                        <span class="inpa-date">[##_article_rep_date_##]</span>
                      </div>
                    </div>
                    <div class="inpa-card-stats">
                      <div class="inpa-stat-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> [##_article_rep_rp_cnt_##]
                      </div>
                      <div class="inpa-stat-share">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            </s_index_article_rep>`;

if (skin.includes(oldIndexRepStart) && skin.includes(oldIndexRepEnd)) {
  const s1 = skin.substring(0, skin.indexOf(oldIndexRepStart));
  const s2 = skin.substring(skin.indexOf(oldIndexRepEnd) + oldIndexRepEnd.length);
  skin = s1 + newIndexCardHTML + s2;
}

if (preview.includes(oldIndexRepStart) && preview.includes(oldIndexRepEnd)) {
  const p1 = preview.substring(0, preview.indexOf(oldIndexRepStart));
  const p2 = preview.substring(preview.indexOf(oldIndexRepEnd) + oldIndexRepEnd.length);
  preview = p1 + newIndexCardHTML + p2;
}


/* =========================================================================
   3. POST DETAIL HEADER (INPA STYLE)
   ========================================================================= */

const oldPostHeaderStart = '<header class="post-header">';
const oldPostHeaderEnd = '</header>';

const newPostHeaderHTML = `<header class="inpa-post-header">
                  <div class="inpa-post-header-inner">
                    <span class="inpa-post-badge">[##_article_rep_category_##]</span>
                    <h1 class="inpa-post-title">[##_article_rep_title_##]</h1>
                    <div class="inpa-post-meta">
                      <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> [##_article_rep_author_##]</span>
                      <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> [##_article_rep_date_##]</span>
                      <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 1ë¶?/span>
                    </div>
                  </div>
                </header>`;

if (skin.includes(oldPostHeaderStart) && skin.includes(oldPostHeaderEnd)) {
  const s1 = skin.substring(0, skin.indexOf(oldPostHeaderStart));
  const s2 = skin.substring(skin.indexOf(oldPostHeaderEnd) + oldPostHeaderEnd.length);
  skin = s1 + newPostHeaderHTML + s2;
}

if (preview.includes(oldPostHeaderStart) && preview.includes(oldPostHeaderEnd)) {
  const p1 = preview.substring(0, preview.indexOf(oldPostHeaderStart));
  const p2 = preview.substring(preview.indexOf(oldPostHeaderEnd) + oldPostHeaderEnd.length);
  preview = p1 + newPostHeaderHTML + p2;
}


/* =========================================================================
   4. CSS INJECTIONS
   ========================================================================= */

const inpaCSS = `
/* --------------------------------------------------------------------------
   Inpa Style Grid Cards
   -------------------------------------------------------------------------- */
.magazine-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
.inpa-card {
  background: var(--surface-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}
.inpa-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.inpa-card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.inpa-card-thumb {
  width: 100%;
  height: 200px;
  position: relative;
  background: #f1c40f; /* Default yellow */
  display: flex; align-items: center; justify-content: center;
}
/* Alternate fallback background colors using nth-child */
.inpa-card:nth-child(2n) .inpa-card-thumb { background: #e74c3c; }
.inpa-card:nth-child(3n) .inpa-card-thumb { background: #2ecc71; }
.inpa-card:nth-child(4n) .inpa-card-thumb { background: #3498db; }
.inpa-card:nth-child(5n) .inpa-card-thumb { background: #9b59b6; }

.inpa-card-fallback {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
}
.inpa-card-img {
  width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: 1;
}
.inpa-card-body {
  padding: 1.5rem; flex: 1;
}
.inpa-card-badge {
  display: inline-block; background: #ff6b81; color: #fff; padding: 0.2rem 0.6rem; border-radius: 15px; font-size: 0.75rem; font-weight: 800; margin-bottom: 0.75rem;
}
.inpa-card-title {
  font-size: 1.125rem; font-weight: 800; color: var(--text-color); margin-bottom: 0.5rem; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.inpa-card-desc {
  font-size: 0.875rem; color: var(--text-muted); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.inpa-card-footer {
  padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;
}
.inpa-author-info {
  display: flex; align-items: center; gap: 0.5rem;
}
.inpa-avatar {
  width: 24px; height: 24px; border-radius: 50%; object-fit: cover;
}
.inpa-author-text {
  display: flex; flex-direction: column;
}
.inpa-author {
  font-size: 0.75rem; font-weight: 800; color: var(--text-color);
}
.inpa-date {
  font-size: 0.65rem; color: var(--text-muted);
}
.inpa-card-stats {
  display: flex; align-items: center; gap: 0.5rem;
}
.inpa-stat-badge {
  display: flex; align-items: center; gap: 0.2rem; font-size: 0.75rem; font-weight: 800; color: #ff4757;
}
.inpa-stat-share {
  width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.2s;
}
.inpa-card:hover .inpa-stat-share {
  border-color: var(--point-color); color: var(--point-color);
}

/* --------------------------------------------------------------------------
   Inpa Style Post Header
   -------------------------------------------------------------------------- */
.inpa-post-header {
  position: relative;
  background-color: #f1c40f; /* Inpa yellow */
  padding: 4rem 2rem;
  text-align: center;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
/* Random SVG pattern overlay */
.inpa-post-header::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><text x="10" y="40" font-size="30" font-family="monospace" fill="rgba(0,0,0,0.05)" transform="rotate(-15)">&lt;p&gt;</text><text x="150" y="80" font-size="40" font-family="monospace" fill="rgba(0,0,0,0.05)" transform="rotate(20)">&lt;div&gt;</text><text x="50" y="150" font-size="60" font-family="monospace" fill="rgba(0,0,0,0.05)" transform="rotate(-10)">&lt;html&gt;</text></svg>');
  background-size: 400px;
  z-index: 1;
}
.inpa-post-header-inner {
  position: relative;
  z-index: 2;
  max-width: 800px;
}
.inpa-post-badge {
  display: inline-block;
  background: #ff4757;
  color: #fff;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}
.inpa-post-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  text-shadow: 0 2px 5px rgba(0,0,0,0.1);
  word-break: keep-all;
}
.inpa-post-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  color: rgba(255,255,255,0.9);
  font-size: 0.9rem;
  font-weight: 700;
}
.inpa-post-meta .meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
`;

if (!css.includes('.inpa-card')) {
  css += inpaCSS;
}

/* =========================================================================
   5. LIKE COUNT POLLING FIX
   ========================================================================= */

// The previous setTimeout was 2 seconds, which might not be enough. Let's use setInterval.
const oldScript = `/* Fetch Tistory Native Like Count */
    setTimeout(() => {
      const nativeLikeSpan = document.querySelector('.wrap_btn .em_stat');
      const fabLikeCount = document.getElementById('fabLikeCount');
      if (nativeLikeSpan && fabLikeCount) {
        fabLikeCount.textContent = nativeLikeSpan.textContent;
      }
    }, 2000); // Delay to allow Tistory AJAX to load`;

const newScript = `/* Fetch Tistory Native Like Count (Polling) */
    const likeInterval = setInterval(() => {
      const nativeLikeSpan = document.querySelector('.wrap_btn_etc .cnt, .uoc-count, .txt_like + .cnt');
      const fabLikeCount = document.getElementById('fabLikeCount');
      if (nativeLikeSpan && fabLikeCount) {
        fabLikeCount.textContent = nativeLikeSpan.textContent;
        clearInterval(likeInterval);
      }
    }, 500); // Poll every 500ms
    setTimeout(() => clearInterval(likeInterval), 10000); // Stop polling after 10s`;

if (skin.includes(oldScript)) {
  skin = skin.replace(oldScript, newScript);
}
if (preview.includes(oldScript)) {
  preview = preview.replace(oldScript, newScript);
}

fs.writeFileSync(skinPath, skin, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');
fs.writeFileSync(previewPath, preview, 'utf8');

console.log("Inpa Style applied successfully!");
