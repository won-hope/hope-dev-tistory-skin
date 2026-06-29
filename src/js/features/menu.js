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
    if (count >= 5) return; // 다시 5개(1줄) 출력으로 변경
    
    // Safe Category Name & Count parsing
    let name = link.textContent;
    let articleCount = '0';
    const countSpan = link.querySelector('.c_cnt');
    if (countSpan) {
      articleCount = countSpan.textContent.replace(/[^0-9]/g, '');
      // Remove the count text from the main text content
      name = link.textContent.replace(countSpan.textContent, '').trim();
    } else {
      // Fallback regex if span is missing
      const match = link.textContent.match(/^(.*?)\s*\(?(\d+)\)?\s*$/);
      if (match) {
        name = match[1].trim();
        articleCount = match[2];
      }
    }
    if (name === '분류 전체보기' || name === '') return;

    const rank = count + 1;
    const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-default';
    
    // 이미지 파일명 생성 (예: AWS -> aws.png, Node.js -> node.js.png)
    // 공백은 하이픈으로 변경하고 소문자로 처리
    const imgName = name.toLowerCase().replace(/\s+/g, '-');
    const imgSrc = `./images/${imgName}.png`;

    const card = document.createElement('a');
    card.href = link.href;
    card.className = 'tech-core-card';
    card.setAttribute('data-category', name);
    
    card.innerHTML = `
      <div class="tech-badge ${rankClass}">#${rank}</div>
      <div class="tech-icon-wrap">
        <img src="${imgSrc}" alt="${name}" onerror="this.style.display='none'" class="cat-image">
      </div>
      <div class="tech-info">
        <h3 class="tech-name"></h3>
        <span class="tech-count">${articleCount} Articles</span>
      </div>
    `;
    
    // Safe text injection
    card.querySelector('.tech-name').textContent = name;
    grid.appendChild(card);
    
    count++;
  });
}
