const fs = require('fs');
const pathSkin = 'c:\\hope-dev-tistory-skin\\skin.html';
let skin = fs.readFileSync(pathSkin, 'utf8');

// 1. Header Categories
skin = skin.replace('[##_blog_menu_##]', '[##_category_list_##]');

// 2. Post meta comment count
const readTimeHtml = `<span id="readTime" class="post-read-time"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg> <span class="time-val">계산중...</span></span>`;
const newMetaHtml = readTimeHtml + `\n                <span class="post-comments-count" style="margin-left: 1rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg> [##_article_rep_rp_cnt_##]</span>`;
skin = skin.replace(readTimeHtml, newMetaHtml);

// 3. Bottom comment count
const bottomComment = `<span>댓글</span>`;
const newBottomComment = `<span>댓글 [##_article_rep_rp_cnt_##]</span>`;
skin = skin.replace(bottomComment, newBottomComment);

// 4. Inject init functions to script
const domContentLoaded = `document.addEventListener('DOMContentLoaded', () => {
      initThemeToggle();
      initSearchToggle();
      if (window.SkinOptions && window.SkinOptions.useAnimation) {
        initTypingAnimation();
      }
      if (window.SkinOptions && window.SkinOptions.useWeather) {
        initWeatherTheme();
      }
    });`;
const newDomContentLoaded = `document.addEventListener('DOMContentLoaded', () => {
      initThemeToggle();
      initSearchToggle();
      initSidebarToggle();
      initTOC();
      if (window.SkinOptions && window.SkinOptions.useAnimation) {
        initTypingAnimation();
      }
      if (window.SkinOptions && window.SkinOptions.useWeather) {
        initWeatherTheme();
      }
    });`;
skin = skin.replace(domContentLoaded, newDomContentLoaded);

const scriptAdditions = `
    /* --------------------------------------------------------------------------
       Sidebar Toggle
       -------------------------------------------------------------------------- */
    function initSidebarToggle() {
      const toggleBtn = document.querySelector('.star-menu-btn');
      const drawer = document.getElementById('sidebarDrawer');
      const overlay = document.getElementById('sidebarOverlay');
      const closeBtn = document.querySelector('.sidebar-close');

      if (!toggleBtn || !drawer || !overlay) return;

      const openSidebar = () => {
        drawer.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
      };

      const closeSidebar = () => {
        drawer.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
      };

      toggleBtn.addEventListener('click', openSidebar);
      closeBtn.addEventListener('click', closeSidebar);
      overlay.addEventListener('click', closeSidebar);
    }

    /* --------------------------------------------------------------------------
       TOC Generation
       -------------------------------------------------------------------------- */
    function initTOC() {
      const content = document.querySelector('.post-content');
      const tocContainer = document.getElementById('tocContainer');
      
      if (!content || !tocContainer) return;

      const headings = content.querySelectorAll('h2, h3');
      if (headings.length === 0) return;

      const title = document.createElement('h3');
      title.textContent = '목차';
      title.style.marginBottom = '1rem';
      title.style.fontWeight = '700';
      tocContainer.appendChild(title);

      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = 'heading-' + index;
        }

        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        
        if (heading.tagName.toLowerCase() === 'h3') {
          link.classList.add('toc-h3');
        }

        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(heading.id);
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 100,
              behavior: 'smooth'
            });
          }
        });

        tocContainer.appendChild(link);
      });
      tocContainer.style.display = 'block';
    }
`;

skin = skin.replace('/* --------------------------------------------------------------------------\n       Theme Toggle', scriptAdditions + '\n    /* --------------------------------------------------------------------------\n       Theme Toggle');

fs.writeFileSync(pathSkin, skin, 'utf8');

// Also fix preview.html
const pathPreview = 'c:\\hope-dev-tistory-skin\\preview.html';
let preview = fs.readFileSync(pathPreview, 'utf8');
preview = preview.replace(domContentLoaded, newDomContentLoaded);
preview = preview.replace('/* --------------------------------------------------------------------------\n       Theme Toggle', scriptAdditions + '\n    /* --------------------------------------------------------------------------\n       Theme Toggle');
fs.writeFileSync(pathPreview, preview, 'utf8');

// Fix style.css (Drawer CSS missing)
const pathStyle = 'c:\\hope-dev-tistory-skin\\style.css';
let css = fs.readFileSync(pathStyle, 'utf8');
const drawerCSS = `
/* --------------------------------------------------------------------------
   Sidebar Drawer Overlay
   -------------------------------------------------------------------------- */
.sidebar-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
  opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s;
}
.sidebar-overlay.show { opacity: 1; visibility: visible; }

.sidebar-drawer {
  position: fixed; top: 0; right: 0; width: 320px; height: 100vh;
  background: var(--surface-color); z-index: 1001;
  transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -10px 0 30px rgba(0,0,0,0.1);
  display: flex; flex-direction: column; overflow-y: auto;
}
.sidebar-drawer.open { transform: translateX(0); }
.sidebar-header {
  padding: 1.5rem; display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}
.sidebar-close { background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; }
.sidebar-content { padding: 1.5rem; flex: 1; }

.sidebar-profile { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.profile-avatar { width: 50px; height: 50px; border-radius: 50%; overflow: hidden; background: var(--border-color); }
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; background: var(--point-color); color: #fff; font-size: 1.2rem; }
.profile-info { flex: 1; }
.profile-name { font-weight: 700; font-size: 1.1rem; }
.profile-desc { font-size: 0.8rem; color: var(--text-muted); }

.sidebar-quick-links { display: flex; gap: 1rem; margin-bottom: 2rem; }
.sidebar-quick-links a { flex: 1; display: flex; align-items: center; justify-content: center; padding: 0.75rem; background: var(--bg-color); border-radius: var(--radius-card); color: var(--text-color); transition: background 0.2s; }
.sidebar-quick-links a:hover { background: rgba(var(--point-rgb), 0.1); color: var(--point-color); }

.sidebar-divider { border: none; height: 1px; background: var(--border-color); margin: 2rem 0; }

/* Category List inside Sidebar */
.sidebar-content .tt_category { list-style: none; padding: 0; margin: 0; }
.sidebar-content .tt_category li { margin-bottom: 0.5rem; }
.sidebar-content .tt_category a { color: var(--text-color); display: block; padding: 0.5rem; border-radius: 8px; transition: background 0.2s; }
.sidebar-content .tt_category a:hover { background: rgba(128,128,128,0.1); color: var(--point-color); }
`;
if (!css.includes('.sidebar-drawer')) {
    css += drawerCSS;
    fs.writeFileSync(pathStyle, css, 'utf8');
}
console.log('done');
