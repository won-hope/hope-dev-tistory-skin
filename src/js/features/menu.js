export function beautifyMegaMenu() {
  const rootItems = document.querySelectorAll('.header-nav .category_list > li');
  if (!rootItems.length) return;

  rootItems.forEach(li => {
    const mainLink = li.querySelector('a:not(.link_sub_item)');
    if (mainLink) {
      const match = mainLink.textContent.match(/(.*?)\s*\((\d+)\)/);
      if (match) {
        // 보안 개선: innerHTML 대신 DOM 조립
        mainLink.textContent = '';
        const tNode = document.createTextNode(match[1].trim() + ' ');
        const cSpan = document.createElement('span');
        cSpan.className = 'mega-count';
        cSpan.textContent = match[2];
        mainLink.appendChild(tNode);
        mainLink.appendChild(cSpan);
      }
      mainLink.classList.add('mega-link-item');
    }

    const subLinks = li.querySelectorAll('ul.sub_category_list > li > a');
    subLinks.forEach(subA => {
      subA.classList.add('mega-sub-link');
      const matchSub = subA.textContent.match(/(.*?)\s*\((\d+)\)/);
      const iconSvg = `<svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;

      subA.textContent = '';
      subA.insertAdjacentHTML('afterbegin', iconSvg);
      
      const titleSpan = document.createElement('span');
      if (matchSub) {
        titleSpan.textContent = matchSub[1].trim();
        const countSpan = document.createElement('span');
        countSpan.className = 'mega-sub-count';
        countSpan.textContent = matchSub[2];
        subA.appendChild(titleSpan);
        subA.appendChild(countSpan);
      } else {
        titleSpan.textContent = subA.textContent;
        subA.appendChild(titleSpan);
      }
    });
  });
}

export function initPopularCategories() {
  const catLinks = document.querySelectorAll('.header-nav .category_list > li > a, .header-nav .category_list > li > ul > li > a');
  const grid = document.getElementById('popularCategoryGrid');
  if (!grid || catLinks.length === 0) return;

  let count = 0;
  catLinks.forEach(link => {
    if (count >= 8) return;
    const match = link.textContent.match(/(.*?)\s*\((\d+)\)/);
    let name = link.textContent;
    let articleCount = '0';
    if (match) { name = match[1].trim(); articleCount = match[2]; }
    if (name === '분류 전체보기' || name === '') return;

    const rank = count + 1;
    const rankClass = rank <= 4 ? `rank-${rank}` : 'rank-default';
    
    // getIconForCategory logic replicated for standalone module
    const n = name.toLowerCase();
    let iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
    if (n.includes('aws')) iconSvg = `<svg viewBox="0 0 24 24" fill="#FF9900"><path d="M11.96 16.27c-1.89 0-3.69-.53-5.22-1.5-.23-.15-.17-.4.07-.48l1.3-.45c.22-.08.43-.02.58.15 1.01 1.08 2.3 1.62 3.61 1.62 1.47 0 2.51-.55 2.51-1.35 0-.75-.68-1.12-2.12-1.39l-1.38-.27c-2.07-.39-3.27-1.37-3.27-2.95 0-1.7 1.49-2.92 3.65-2.92 1.58 0 3.12.5 4.41 1.25.21.13.23.36.04.53l-1.07.95c-.17.15-.41.16-.6-.01-1.04-.9-2.08-1.33-3.15-1.33-1.08 0-1.92.51-1.92 1.25 0 .68.61 1.05 1.83 1.29l1.39.27c2.32.43 3.52 1.42 3.52 3.06.01 1.83-1.52 3.01-4.18 3.01z"/></svg>`;
    else if (n.includes('linux')) iconSvg = `<svg viewBox="0 0 24 24" fill="#333"><circle cx="12" cy="12" r="10"/></svg>`;
    else if (n.includes('node')) iconSvg = `<svg viewBox="0 0 24 24" fill="#68A063"><path d="M11.87 2.26L2.57 7.64v10.74l9.3 5.36 9.3-5.36V7.64L11.87 2.26z"/></svg>`;
    else if (n.includes('git')) iconSvg = `<svg viewBox="0 0 24 24" fill="#F05032"><path d="M23.55 10.45l-9.98-9.98c-.6-.6-1.57-.6-2.17 0L1.42 10.45c-.6.6-.6 1.57 0 2.17l9.98 9.98c.6.6 1.57.6 2.17 0l9.98-9.98c.6-.6.6-1.57 0-2.17z"/></svg>`;
    else if (n.includes('js') || n.includes('javascript')) iconSvg = `<svg viewBox="0 0 24 24" fill="#F7DF1E"><path d="M2 2h20v20H2z"/><path fill="#000" d="M16 16.7c-.5.4-1.2.6-1.9.6-1.4 0-2.3-.6-2.9-1.3l1.8-1.2c.4.6.9.9 1.4.9.5 0 .9-.3.9-.6 0-.4-.4-.5-1.2-.8-1.4-.4-2.2-1.2-2.2-2.1 0-1.3 1-2.2 2.6-2.2.8 0 1.5.2 2 .5l-1.6 1.3c-.3-.2-.6-.3-1-.3-.4 0-.7.2-.7.5 0 .4.4.5 1.3.8 1.4.5 2.1 1.2 2.1 2.1-.1 1.2-.9 2.2-2.6 2.2zm-7-5.5v5.8c0 1.2-.6 1.8-1.8 1.8-.7 0-1.3-.2-1.7-.5l1.6-1.4c.2.2.5.3.7.3.3 0 .5-.2.5-.5v-5.6H9z"/></svg>`;
    else if (n.includes('css')) iconSvg = `<svg viewBox="0 0 24 24" fill="#1572B6"><path d="M2.5 2l1.6 17.5L12 22l7.9-2.5L21.5 2H2.5zm15.1 4H6.1l.3 3.5h10.9l-.6 6.8-4.7 1.5-4.7-1.5-.3-3.6h3.4l.1 1.3 1.5.5 1.5-.5.2-2.3H5.8L5.2 6h12.6l-.2 0z"/></svg>`;

    const card = document.createElement('a');
    card.href = link.href;
    card.className = 'tech-core-card';
    
    // Security: Use innerHTML safely for structure, but textContent for names
    card.innerHTML = `
      <div class="tech-core-bg"></div>
      <div class="tech-badge ${rankClass}">#${rank}</div>
      <div class="tech-icon-wrap">${iconSvg}</div>
      <h3 class="tech-name"></h3>
      <div class="tech-energy-bar">
        <div class="energy-fill" style="width: ${Math.min(parseInt(articleCount)*5, 100)}%;"></div>
      </div>
      <span class="tech-count">${articleCount} DATA UNITS</span>
    `;
    
    // Safe text injection
    card.querySelector('.tech-name').textContent = `[ SYS / ${name} ]`;
    grid.appendChild(card);
    
    count++;
  });
}
