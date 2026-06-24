const fs = require('fs');

const skinPath = 'c:\\hope-dev-tistory-skin\\skin.html';
const cssPath = 'c:\\hope-dev-tistory-skin\\style.css';
const previewPath = 'c:\\hope-dev-tistory-skin\\preview.html';

let skin = fs.readFileSync(skinPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');
let preview = fs.readFileSync(previewPath, 'utf8');

/* =========================================================================
   1. RESTORE SIDEBAR & PRELOADER
   ========================================================================= */

const sidebarHTML = `
<!-- Sidebar Drawer & Preloader -->
<div class="sidebar-overlay"></div>
<div class="sidebar-drawer">
  <div class="sidebar-header">
    <h2>Menu</h2>
    <button class="sidebar-close">&times;</button>
  </div>
  <div class="sidebar-content">
    <div class="sidebar-profile">
      <div class="profile-avatar"><img src="[##_image_##]" alt="profile" onerror="this.style.display='none'"></div>
      <div class="profile-info">
        <h3 class="profile-name">[##_blogger_##]</h3>
        <span class="profile-desc">[##_desc_##]</span>
      </div>
    </div>
    <div class="sidebar-quick-links">
      <a href="[##_blog_link_##]"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></a>
      <a href="[##_taglog_link_##]"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg></a>
      <a href="[##_guestbook_link_##]"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></a>
    </div>
    <hr class="sidebar-divider">
    [##_category_list_##]
  </div>
</div>

<!-- Preloader -->
<div class="preloader" id="preloader">
  <div class="star-loader-wrapper">
    <svg class="star-spinner" viewBox="0 0 100 100" width="80" height="80">
      <polygon points="50,5 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div class="loading-bar"><div class="loading-progress"></div></div>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    const preloader = document.getElementById('preloader');
    if(preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 300);
    }

    // Sidebar Logic
    const starMenuBtn = document.querySelector('.star-menu-btn');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebarDrawer = document.querySelector('.sidebar-drawer');
    const sidebarClose = document.querySelector('.sidebar-close');

    if(starMenuBtn && sidebarOverlay && sidebarDrawer) {
      starMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarOverlay.classList.add('active');
        sidebarDrawer.classList.add('active');
      });
      sidebarClose.addEventListener('click', () => {
        sidebarOverlay.classList.remove('active');
        sidebarDrawer.classList.remove('active');
      });
      sidebarOverlay.addEventListener('click', () => {
        sidebarOverlay.classList.remove('active');
        sidebarDrawer.classList.remove('active');
      });
    }
  });
</script>
`;

if (!skin.includes('sidebar-drawer')) {
  skin = skin.replace('</s_t3>', sidebarHTML + '\\n  </s_t3>');
}
if (!preview.includes('sidebar-drawer')) {
  preview = preview.replace('</s_t3>', sidebarHTML + '\\n  </s_t3>');
}


/* =========================================================================
   2. CATEGORY DETAIL HEADER FIX
   ========================================================================= */

const oldSectionTitle = '<h2 class="section-title">최신 포스팅</h2>';
const newSectionTitle = `
        <h2 class="section-title home-only-title">최신 포스팅</h2>
        <div class="category-header-wrap list-only-title">
          <s_list_rep>
            <h1 class="category-title">[##_list_conform_##]</h1>
            <div class="category-divider"></div>
            <p class="category-desc">공부한 내용을 정리합니다</p>
          </s_list_rep>
        </div>
`;

if (skin.includes(oldSectionTitle)) {
  skin = skin.replace(oldSectionTitle, newSectionTitle);
}
if (preview.includes(oldSectionTitle)) {
  preview = preview.replace(oldSectionTitle, newSectionTitle);
}

// Ensure the preview.html has a dummy for s_list_rep so it looks good locally
if (preview.includes('[##_list_conform_##]')) {
  preview = preview.replace('[##_list_conform_##]', 'HTML');
}


/* =========================================================================
   3. MEGA MENU CSS FIXES
   ========================================================================= */

// Find category_list and add align-items: start
if (css.includes('display: grid; grid-template-columns: repeat(4, 1fr) 300px; gap: 3rem;')) {
  css = css.replace('gap: 3rem; opacity: 0;', 'gap: 3rem; align-items: start; opacity: 0;');
}

const additionalCSS = `
/* --------------------------------------------------------------------------
   Category Header (Inpa Style)
   -------------------------------------------------------------------------- */
body:not(#tt-body-index) .home-only-title { display: none; }
body#tt-body-index .list-only-title { display: none; }

.category-header-wrap {
  text-align: center;
  margin-bottom: 4rem;
  padding: 4rem 2rem 2rem;
}
.category-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  font-family: 'Pretendard', sans-serif;
}
.category-divider {
  width: 300px;
  height: 2px;
  background-color: #ff6b81;
  margin: 0 auto 1.5rem;
  position: relative;
}
.category-divider::before, .category-divider::after {
  content: ""; position: absolute; top: -3px; width: 8px; height: 8px;
  background: #ff6b81; border-radius: 50%;
}
.category-divider::before { left: 0; }
.category-divider::after { right: 0; }
.category-desc {
  color: var(--text-muted);
  font-size: 1rem;
  font-weight: 500;
}
`;

if (!css.includes('.category-header-wrap')) {
  css += additionalCSS;
}

fs.writeFileSync(skinPath, skin, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');
fs.writeFileSync(previewPath, preview, 'utf8');

console.log("Bug fixes applied successfully!");
