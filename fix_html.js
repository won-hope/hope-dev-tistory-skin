const fs = require('fs');

const skinPath = 'c:\\hope-dev-tistory-skin\\skin.html';
const previewPath = 'c:\\hope-dev-tistory-skin\\preview.html';

let skin = fs.readFileSync(skinPath, 'utf8');
let preview = fs.readFileSync(previewPath, 'utf8');

skin = skin.replace('<div class="sidebar-overlay"></div>', '<div id="sidebarOverlay" class="sidebar-overlay"></div>');
skin = skin.replace('<div class="sidebar-drawer">', '<div id="sidebarDrawer" class="sidebar-drawer">');

preview = preview.replace('<div class="sidebar-overlay"></div>', '<div id="sidebarOverlay" class="sidebar-overlay"></div>');
preview = preview.replace('<div class="sidebar-drawer">', '<div id="sidebarDrawer" class="sidebar-drawer">');

// Remove the duplicate script I added earlier
const duplicateScript = `  document.addEventListener('DOMContentLoaded', () => {
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
  });`;

skin = skin.replace(duplicateScript, '');
preview = preview.replace(duplicateScript, '');

fs.writeFileSync(skinPath, skin, 'utf8');
fs.writeFileSync(previewPath, preview, 'utf8');

console.log("Fixed sidebar IDs in HTML.");
