const fs = require('fs');
const cssPath = 'c:\\hope-dev-tistory-skin\\style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const sidebarCSS = `
/* --------------------------------------------------------------------------
   Sidebar & Overlay
   -------------------------------------------------------------------------- */
.sidebar-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); z-index: 1050;
  opacity: 0; visibility: hidden; transition: all 0.3s;
}
.sidebar-overlay.active { opacity: 1; visibility: visible; }
.sidebar-drawer {
  position: fixed; top: 0; right: 0; bottom: 0; width: 320px;
  background-color: var(--surface-color); z-index: 1060;
  transform: translateX(100%); transition: transform 0.3s ease;
  display: flex; flex-direction: column;
  box-shadow: -4px 0 20px rgba(0,0,0,0.1);
}
.sidebar-drawer.active { transform: translateX(0); }

.sidebar-header {
  padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid var(--border-color);
}
.sidebar-header h2 { font-size: 1.25rem; font-weight: 700; font-family: 'Pretendard', sans-serif; }
.sidebar-close {
  background: none; border: none; font-size: 2rem; color: var(--text-color);
  cursor: pointer; line-height: 1; margin-top: -5px;
}
.sidebar-content {
  padding: 1.5rem; overflow-y: auto; flex: 1;
}
.sidebar-profile { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.profile-avatar img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.profile-info { display: flex; flex-direction: column; }
.profile-name { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }
.profile-desc { font-size: 0.8125rem; color: var(--text-muted); }

.sidebar-quick-links {
  display: flex; gap: 1rem; margin-bottom: 1.5rem; justify-content: center;
}
.sidebar-quick-links a {
  width: 40px; height: 40px; border-radius: 50%; background: var(--bg-color);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-color); transition: background 0.2s, color 0.2s;
}
.sidebar-quick-links a:hover { background: var(--point-color); color: #fff; }
.sidebar-divider { border: none; height: 1px; background: var(--border-color); margin-bottom: 1.5rem; }

/* Preloader */
.preloader {
  position: fixed; inset: 0; background: var(--bg-color); z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}
.preloader.hidden { opacity: 0; visibility: hidden; }
.star-loader-wrapper { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.star-spinner {
  animation: starSpin 3s linear infinite;
  color: var(--point-color);
}
@keyframes starSpin { 100% { transform: rotate(360deg); } }
`;

if (!css.includes('.sidebar-drawer')) {
  css += sidebarCSS;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log("Sidebar CSS appended successfully!");
} else {
  console.log("Sidebar CSS already exists.");
}

// Ensure the mega menu aligns to top
if (css.includes('gap: 3rem; opacity: 0;')) {
  css = css.replace('gap: 3rem; opacity: 0;', 'gap: 3rem; align-items: start; opacity: 0;');
  fs.writeFileSync(cssPath, css, 'utf8');
}
