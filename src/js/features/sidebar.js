export function initSidebarToggle() {
  const toggleBtns = document.querySelectorAll('.star-menu-btn');
  const drawer = document.getElementById('sidebarDrawer');
  const overlay = document.getElementById('sidebarOverlay');
  const closeBtns = document.querySelectorAll('.sidebar-close');

  if (!drawer || !overlay) return;

  const tistoryWrap = document.getElementById('wrap') || document.querySelector('.post-content')?.closest('main') || document.body;

  const openSidebar = (e) => {
    e.preventDefault();
    drawer.classList.add('open');
    drawer.classList.add('glass-drawer'); // 3D Glassmorphism
    overlay.classList.add('show');
    tistoryWrap.classList.add('drawer-3d-push'); // 3D Push effect
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    tistoryWrap.classList.remove('drawer-3d-push');
    document.body.style.overflow = '';
  };

  toggleBtns.forEach(btn => btn.addEventListener('click', openSidebar));
  closeBtns.forEach(btn => btn.addEventListener('click', closeSidebar));
  overlay.addEventListener('click', closeSidebar);
}

function getIconForCategory(name) {
  const n = name.toLowerCase();
  if (n.includes('aws')) return `<svg viewBox="0 0 24 24" fill="#FF9900"><path d="M11.96 16.27c-1.89 0-3.69-.53-5.22-1.5-.23-.15-.17-.4.07-.48l1.3-.45c.22-.08.43-.02.58.15 1.01 1.08 2.3 1.62 3.61 1.62 1.47 0 2.51-.55 2.51-1.35 0-.75-.68-1.12-2.12-1.39l-1.38-.27c-2.07-.39-3.27-1.37-3.27-2.95 0-1.7 1.49-2.92 3.65-2.92 1.58 0 3.12.5 4.41 1.25.21.13.23.36.04.53l-1.07.95c-.17.15-.41.16-.6-.01-1.04-.9-2.08-1.33-3.15-1.33-1.08 0-1.92.51-1.92 1.25 0 .68.61 1.05 1.83 1.29l1.39.27c2.32.43 3.52 1.42 3.52 3.06.01 1.83-1.52 3.01-4.18 3.01z"/></svg>`;
  if (n.includes('linux')) return `<svg viewBox="0 0 24 24" fill="#333"><circle cx="12" cy="12" r="10"/></svg>`;
  if (n.includes('node')) return `<svg viewBox="0 0 24 24" fill="#68A063"><path d="M11.87 2.26L2.57 7.64v10.74l9.3 5.36 9.3-5.36V7.64L11.87 2.26z"/></svg>`;
  if (n.includes('git')) return `<svg viewBox="0 0 24 24" fill="#F05032"><path d="M23.55 10.45l-9.98-9.98c-.6-.6-1.57-.6-2.17 0L1.42 10.45c-.6.6-.6 1.57 0 2.17l9.98 9.98c.6.6 1.57.6 2.17 0l9.98-9.98c.6-.6.6-1.57 0-2.17z"/></svg>`;
  if (n.includes('js') || n.includes('javascript')) return `<svg viewBox="0 0 24 24" fill="#F7DF1E"><path d="M2 2h20v20H2z"/><path fill="#000" d="M16 16.7c-.5.4-1.2.6-1.9.6-1.4 0-2.3-.6-2.9-1.3l1.8-1.2c.4.6.9.9 1.4.9.5 0 .9-.3.9-.6 0-.4-.4-.5-1.2-.8-1.4-.4-2.2-1.2-2.2-2.1 0-1.3 1-2.2 2.6-2.2.8 0 1.5.2 2 .5l-1.6 1.3c-.3-.2-.6-.3-1-.3-.4 0-.7.2-.7.5 0 .4.4.5 1.3.8 1.4.5 2.1 1.2 2.1 2.1-.1 1.2-.9 2.2-2.6 2.2zm-7-5.5v5.8c0 1.2-.6 1.8-1.8 1.8-.7 0-1.3-.2-1.7-.5l1.6-1.4c.2.2.5.3.7.3.3 0 .5-.2.5-.5v-5.6H9z"/></svg>`;
  if (n.includes('css')) return `<svg viewBox="0 0 24 24" fill="#1572B6"><path d="M2.5 2l1.6 17.5L12 22l7.9-2.5L21.5 2H2.5zm15.1 4H6.1l.3 3.5h10.9l-.6 6.8-4.7 1.5-4.7-1.5-.3-3.6h3.4l.1 1.3 1.5.5 1.5-.5.2-2.3H5.8L5.2 6h12.6l-.2 0z"/></svg>`;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
}

export function parseAndBuildSidebarCategories() {
  const sidebarWrap = document.getElementById('sidebarCategoryWrap');
  if (!sidebarWrap) return;

  const rootLink = sidebarWrap.querySelector('.link_tit');
  if (rootLink) {
    let rootName = "ROOT"; let rootCount = "";
    const match = rootLink.textContent.match(/(.*?)\s*\((\d+)\)/);
    if (match) { rootName = match[1].trim(); rootCount = match[2]; }
    const newRoot = document.createElement('a');
    newRoot.href = rootLink.href; 
    newRoot.className = 'sidebar-cat-root';
    
    // Security: textContent over innerHTML
    const rnNode = document.createTextNode(rootName + ' ');
    const rcSpan = document.createElement('span');
    rcSpan.className = 'sidebar-cat-count';
    rcSpan.textContent = `${rootCount} Articles`;
    newRoot.appendChild(rnNode);
    newRoot.appendChild(rcSpan);
    
    sidebarWrap.insertBefore(newRoot, sidebarWrap.firstChild);
  }

  const items = sidebarWrap.querySelectorAll('.category_list > li');
  const newList = document.createElement('ul');
  newList.className = 'sidebar-cat-list';

  items.forEach(li => {
    let aTag = li.querySelector('a');
    if (aTag && aTag.nextElementSibling && aTag.nextElementSibling.tagName === 'A') {
       // sometimes there's a weird hidden element, take the correct link
    }
    if (!aTag) return;

    let name = aTag.textContent; let count = '0';
    const match = name.match(/(.*?)\s*\((\d+)\)/);
    if (match) { name = match[1].trim(); count = match[2]; }

    const newLi = document.createElement('li');
    newLi.className = 'sidebar-cat-item';
    
    const newA = document.createElement('a');
    newA.href = aTag.href; 
    newA.className = 'sidebar-cat-link';

    const iconSvg = getIconForCategory(name);
    const iconSpan = document.createElement('span');
    iconSpan.className = 'sidebar-cat-icon';
    iconSpan.innerHTML = iconSvg; // safe

    const nameSpan = document.createElement('span');
    nameSpan.className = 'sidebar-cat-name';
    nameSpan.textContent = name;

    const countSpan = document.createElement('span');
    countSpan.className = 'sidebar-cat-count';
    countSpan.textContent = `${count} Articles`;

    newA.appendChild(iconSpan);
    newA.appendChild(nameSpan);
    newA.appendChild(countSpan);
    newLi.appendChild(newA);

    const subUl = li.querySelector('ul.sub_category_list');
    if (subUl) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'sidebar-cat-toggle';
      toggleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      newA.appendChild(toggleBtn);

      const newSubUl = document.createElement('ul');
      newSubUl.className = 'sidebar-sub-list';

      const subItems = subUl.querySelectorAll('li > a');
      subItems.forEach(subA => {
        let subName = subA.textContent; let subCount = '0';
        const subMatch = subName.match(/(.*?)\s*\((\d+)\)/);
        if (subMatch) { subName = subMatch[1].trim(); subCount = subMatch[2]; }

        const newSubLi = document.createElement('li');
        newSubLi.className = 'sidebar-sub-item';
        const newSubLink = document.createElement('a');
        newSubLink.href = subA.href;
        newSubLink.className = 'sidebar-sub-link';

        const sNameSpan = document.createElement('span');
        sNameSpan.className = 'sidebar-sub-name';
        sNameSpan.textContent = subName;

        const sCountSpan = document.createElement('span');
        sCountSpan.className = 'sidebar-sub-count';
        sCountSpan.textContent = subCount;

        newSubLink.appendChild(sNameSpan);
        newSubLink.appendChild(sCountSpan);
        newSubLi.appendChild(newSubLink);
        newSubUl.appendChild(newSubLi);
      });
      
      newLi.appendChild(newSubUl);

      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        newLi.classList.toggle('expanded');
      });
    }

    newList.appendChild(newLi);
  });

  const oldTistoryList = sidebarWrap.querySelector('.tt_category');
  if (oldTistoryList) oldTistoryList.style.display = 'none';
  sidebarWrap.appendChild(newList);
}
