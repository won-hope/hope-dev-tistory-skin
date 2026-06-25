/**
 * HOPEDEV Editorial Skin Script
 * Optimized by Silicon Valley TF Team - Ultimate Edition
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    removePreloader();
    initThemeToggle();
    initSearchToggle();
    initSidebarToggle();

    // UI Enhancements
    beautifyMegaMenu();
    initPopularCategories();
    fetchPopularPosts();
    animateCounters();

    // Post Detail Scripts
    initDualTOC();
    initMacCodeBlocks(); // 언어표시 및 코드 복사 버튼 신규 추가
    initReadingProgress();

    if (window.SkinOptions) {
      if (window.SkinOptions.useAnimation) initTypingAnimation();
      if (window.SkinOptions.useWeather) initWeatherTheme();
    }
  });

  function removePreloader() {
    const preloader = document.getElementById('hopePreloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 500);
    }
  }

  function initSidebarToggle() {
    const toggleBtns = document.querySelectorAll('.star-menu-btn');
    const drawer = document.getElementById('sidebarDrawer');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtns = document.querySelectorAll('.sidebar-close');

    if (!drawer || !overlay) return;

    const openSidebar = (e) => {
      e.preventDefault();
      drawer.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    toggleBtns.forEach(btn => btn.addEventListener('click', openSidebar));
    closeBtns.forEach(btn => btn.addEventListener('click', closeSidebar));
    overlay.addEventListener('click', closeSidebar);
  }

  function initSearchToggle() {
    const toggleBtns = document.querySelectorAll('.search-toggle');
    const overlay = document.getElementById('searchOverlay');
    const closeBtn = document.querySelector('.search-close');
    if (!toggleBtns.length || !overlay) return;
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.style.display = 'flex';
        const input = overlay.querySelector('input');
        if (input) input.focus();
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', () => { overlay.style.display = 'none'; });
  }

  function initThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    const sunIcon = btn.querySelector('.icon-sun');
    const moonIcon = btn.querySelector('.icon-moon');
    const html = document.documentElement;

    const updateIcon = (theme) => {
      if (theme === 'dark') { sunIcon.style.display = 'none'; moonIcon.style.display = 'block'; }
      else { sunIcon.style.display = 'block'; moonIcon.style.display = 'none'; }
    };
    const currentTheme = html.getAttribute('data-theme') || 'light';
    updateIcon(currentTheme);
    btn.addEventListener('click', () => {
      let current = html.getAttribute('data-theme');
      let next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon(next);
    });
  }

  /* -------------------------------------------------------------
     [Fix] 메가 메뉴의 카테고리 포스팅 갯수 살리기
     ------------------------------------------------------------- */
  function beautifyMegaMenu() {
    const rootItems = document.querySelectorAll('.header-nav .category_list > li');
    if (!rootItems.length) return;

    rootItems.forEach(li => {
      const mainLink = li.querySelector('a:not(.link_sub_item)');
      if (mainLink) {
        const match = mainLink.textContent.match(/(.*?)\s*\((\d+)\)/);
        if (match) {
          mainLink.innerHTML = `${match[1].trim()} <span class="mega-count">${match[2]}</span>`;
        }
        mainLink.classList.add('mega-link-item');
      }

      const subLinks = li.querySelectorAll('ul.sub_category_list > li > a');
      subLinks.forEach(subA => {
        subA.classList.add('mega-sub-link');
        const matchSub = subA.textContent.match(/(.*?)\s*\((\d+)\)/);
        const iconSvg = `<svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;

        if (matchSub) {
          subA.innerHTML = `${iconSvg} <span>${matchSub[1].trim()}</span> <span class="mega-sub-count">${matchSub[2]}</span>`;
        } else {
          subA.innerHTML = `${iconSvg} <span>${subA.textContent}</span>`;
        }
      });
    });
  }

  /* -------------------------------------------------------------
     [New] 코드 블록 언어 표시 & 복사 버튼 추가
     ------------------------------------------------------------- */
  function initMacCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.post-content pre');
    codeBlocks.forEach(pre => {
      // 티스토리 코드 블록의 언어 속성 감지
      let lang = pre.getAttribute('data-ke-language') || 'code';
      if (lang === 'nohighlight' || lang === 'none') lang = 'text';

      const wrapper = document.createElement('div');
      wrapper.className = 'mac-code-block';

      const header = document.createElement('div');
      header.className = 'mac-code-header';

      const dots = document.createElement('div');
      dots.className = 'mac-code-dots';
      dots.innerHTML = '<span class="mac-dot mac-red"></span><span class="mac-dot mac-yellow"></span><span class="mac-dot mac-green"></span>';

      const langLabel = document.createElement('div');
      langLabel.className = 'mac-code-lang';
      langLabel.textContent = lang;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'mac-code-copy-btn';
      copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';

      copyBtn.addEventListener('click', () => {
        const codeText = pre.innerText || pre.textContent;
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
          setTimeout(() => {
            copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
          }, 2000);
        });
      });

      header.appendChild(dots);
      header.appendChild(langLabel);
      header.appendChild(copyBtn);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }

  function animateCounters() {
    const startDateStr = window.SkinOptions?.blogStartDate || '2024-01-01';
    const start = new Date(startDateStr).getTime();
    const diffDays = Math.floor((new Date().getTime() - start) / (1000 * 60 * 60 * 24));
    const ageEl = document.getElementById('mainBlogAge');
    if (ageEl) ageEl.setAttribute('data-target', diffDays);

    const totalPostsEl = document.getElementById('mainTotalPosts');
    if (totalPostsEl) {
      let total = 0;
      const totalLink = document.querySelector('.header-nav .tt_category > li > a.link_tit');
      if (totalLink) {
        const match = totalLink.textContent.match(/\((\d+)\)/);
        if (match) total = parseInt(match[1], 10);
      }
      if (total === 0) total = document.querySelectorAll('.bento-card').length || 10;
      totalPostsEl.setAttribute('data-target', total);
    }

    const counters = document.querySelectorAll('.counter-num');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          let targetRaw = el.getAttribute('data-target') || el.getAttribute('data-raw');
          let target = parseInt(String(targetRaw).replace(/,/g, ''), 10);
          if (isNaN(target)) target = 0;

          const speed = 40;
          const inc = target / speed;
          let current = 0;

          const updateCount = () => {
            current += inc;
            if (current < target) {
              el.innerText = Math.ceil(current).toLocaleString();
              requestAnimationFrame(updateCount);
            } else {
              el.innerText = target.toLocaleString();
            }
          };
          updateCount();
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
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

  function initPopularCategories() {
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
      const iconSvg = getIconForCategory(name);

      const cardHTML = `
        <a href="${link.href}" class="cat-card">
          <div class="cat-badge ${rankClass}">#${rank}</div>
          <div class="cat-icon">${iconSvg}</div>
          <h3 class="cat-name">${name}</h3>
          <span class="cat-count">${articleCount} Articles</span>
        </a>
      `;
      grid.insertAdjacentHTML('beforeend', cardHTML);
      count++;
    });
  }

  function fetchPopularPosts() {
    const popWrap = document.getElementById('popCatPostsWrap');
    if (!popWrap) return;
    
    const catLinks = document.querySelectorAll('.header-nav .category_list > li > a, .header-nav .category_list > li > ul > li > a');
    let topCats = [];
    catLinks.forEach(link => {
      let name = link.textContent.replace(/\(\d+\)/g, '').trim();
      if (name !== '분류 전체보기' && name !== '' && topCats.length < 2) {
        topCats.push({ name: name, href: link.href });
      }
    });

    if (topCats.length === 0) return;
    popWrap.style.display = 'block';
    
    topCats.forEach((cat, index) => {
      const sectionHtml = `
        <div class="pop-cat-section" id="popCatBlock-${index}" style="margin-top: 5rem;">
          <div class="section-header">
            <h2 class="section-title">${cat.name} 인기 글 🚀</h2>
            <p class="section-desc" style="color: var(--text-muted); margin-top: 0.5rem; font-size: 0.95rem;">${cat.name} 카테고리의 인기 포스팅을 확인해보세요.</p>
          </div>
          <div class="magazine-grid" id="popCatGrid-${index}" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
             <div style="text-align:center; padding: 2rem; color:var(--text-muted); grid-column: 1 / -1;">포스팅을 불러오는 중입니다...</div>
          </div>
        </div>
      `;
      popWrap.insertAdjacentHTML('beforeend', sectionHtml);

      fetch(cat.href)
        .then(res => res.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const articles = doc.querySelectorAll('.magazine-grid article.bento-card');
          const grid = document.getElementById(`popCatGrid-${index}`);
          if(grid) {
            grid.innerHTML = '';
            if(articles.length === 0) {
              grid.innerHTML = `<div style="text-align:center; padding: 2rem; color:var(--text-muted); grid-column: 1 / -1;">등록된 포스팅이 없습니다.</div>`;
              return;
            }
            let added = 0;
            articles.forEach(art => {
              if(added >= 3) return;
              art.style.gridColumn = 'span 1';
              art.style.gridRow = 'span 1';
              const thumb = art.querySelector('.bento-thumb');
              if(thumb) thumb.style.height = '180px';
              const title = art.querySelector('.bento-title');
              if(title) title.style.fontSize = '1.15rem';
              grid.appendChild(art);
              added++;
            });
          }
        })
        .catch(err => {
          const grid = document.getElementById(`popCatGrid-${index}`);
          if(grid) grid.innerHTML = `<div style="text-align:center; padding: 2rem; color:var(--text-muted); grid-column: 1 / -1;">불러오기 실패</div>`;
        });
    });
  }

  function parseAndBuildSidebarCategories() {
    const sidebarWrap = document.getElementById('sidebarCategoryWrap');
    if (!sidebarWrap) return;

    const rootLink = sidebarWrap.querySelector('.link_tit');
    if (rootLink) {
      let rootName = "ROOT"; let rootCount = "";
      const match = rootLink.textContent.match(/(.*?)\s*\((\d+)\)/);
      if (match) { rootName = match[1].trim(); rootCount = match[2]; }
      const newRoot = document.createElement('a');
      newRoot.href = rootLink.href; newRoot.className = 'sidebar-cat-root';
      newRoot.innerHTML = `${rootName} <span style="color:var(--text-muted);font-weight:400;font-size:0.9rem;">(${rootCount})</span>`;
      sidebarWrap.insertBefore(newRoot, sidebarWrap.firstChild);
    }

    const items = sidebarWrap.querySelectorAll('.category_list > li');
    const newList = document.createElement('ul');
    newList.className = 'sidebar-cat-list';

    items.forEach(li => {
      const aTag = li.querySelector('a');
      if (!aTag) return;

      let name = aTag.textContent; let count = '0';
      const match = name.match(/(.*?)\s*\((\d+)\)/);
      if (match) { name = match[1].trim(); count = match[2]; }

      const newLi = document.createElement('li');
      newLi.className = 'sidebar-cat-item';
      const newA = document.createElement('a');
      newA.href = aTag.href; newA.className = 'sidebar-cat-link';

      const iconSvg = getIconForCategory(name);
      newA.innerHTML = `<span class="sidebar-cat-icon">${iconSvg}</span><span class="sidebar-cat-name">${name}</span><span class="sidebar-cat-count">${count}</span>`;
      newLi.appendChild(newA);
      newList.appendChild(newLi);
    });

    const oldTistoryList = sidebarWrap.querySelector('.tt_category');
    if (oldTistoryList) oldTistoryList.style.display = 'none';
    sidebarWrap.appendChild(newList);
  }

  function initDualTOC() {
    const content = document.querySelector('.post-content');
    const sideTocPanel = document.getElementById('sideTocPanel');
    const sideTocContent = document.getElementById('sideTocContent');
    const tocToggleBtn = document.getElementById('tocToggleBtn');
    const tocCloseBtn = document.getElementById('tocCloseBtn');

    if (!content) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      if (tocToggleBtn) tocToggleBtn.style.display = 'none';
      return;
    }

    const inPostToc = document.createElement('div');
    inPostToc.className = 'inpa-inpost-toc';
    inPostToc.innerHTML = `
      <div class="inpa-inpost-toc-header">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg> 목차
      </div>
      <div class="inpa-inpost-toc-body"></div>
    `;
    const inPostBody = inPostToc.querySelector('.inpa-inpost-toc-body');
    const tocLinks = [];

    let h2Counter = 0;
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = 'toc-heading-' + index;

      const inLink = document.createElement('a');
      inLink.href = '#' + heading.id;

      if (heading.tagName.toLowerCase() === 'h2') {
        h2Counter++;
        inLink.innerHTML = `<span class="toc-num">${h2Counter}.</span> ${heading.textContent}`;
      } else {
        inLink.innerHTML = `${heading.textContent}`;
        inLink.classList.add('sub-heading');
      }

      const sideLink = document.createElement('a');
      sideLink.href = '#' + heading.id;
      sideLink.textContent = heading.textContent;
      if (heading.tagName.toLowerCase() === 'h3') sideLink.classList.add('toc-h3');

      const clickHandler = (e) => {
        e.preventDefault();
        const target = document.getElementById(heading.id);
        if (target) {
          const offsetPosition = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      };
      inLink.addEventListener('click', clickHandler);
      sideLink.addEventListener('click', clickHandler);

      inPostBody.appendChild(inLink);
      if (sideTocContent) sideTocContent.appendChild(sideLink);
      tocLinks.push({ id: heading.id, el: sideLink });
    });

    content.insertBefore(inPostToc, content.firstChild);

    if (sideTocPanel && tocToggleBtn) {
      tocToggleBtn.addEventListener('click', () => sideTocPanel.classList.toggle('active'));
      if (tocCloseBtn) tocCloseBtn.addEventListener('click', () => sideTocPanel.classList.remove('active'));

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocLinks.forEach(link => {
              if (link.id === entry.target.id) link.el.classList.add('active');
              else link.el.classList.remove('active');
            });
          }
        });
      }, { rootMargin: '-100px 0px -60% 0px' });

      headings.forEach(heading => observer.observe(heading));
    }
  }

  function initReadingProgress() {
    const progress = document.getElementById('readingProgress');
    if (!progress) return;
    const update = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
    };
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  function initWeatherTheme() {
    // 생략 없이 이전 기능 그대로 유지
    const lat = 37.5665; const lon = 126.9780;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,precipitation,rain,showers,snowfall,weather_code&timezone=Asia%2FSeoul`;

    fetch(url).then(res => res.json()).then(json => {
      const current = json.current;
      let weatherState = 'sunny'; let weatherKo = '맑음'; let icon = '☀️';
      if (current.snowfall > 0) { weatherState = 'snowy'; weatherKo = '눈'; icon = '❄️'; }
      else if (current.precipitation > 0) { weatherState = 'rainy'; weatherKo = '비'; icon = '☔'; }
      else if ([0, 1].includes(current.weather_code)) { weatherState = 'sunny'; weatherKo = '맑음'; icon = '☀️'; }
      else { weatherState = 'cloudy'; weatherKo = '흐림'; icon = '☁️'; }

      if (current.is_day === 0) weatherState = 'night';
      if (window.SkinOptions.autoWeatherTheme) document.documentElement.setAttribute('data-weather', weatherState);

      const badge = document.getElementById('weatherBadge');
      if (badge) {
        badge.style.display = 'flex';
        const iconSpan = badge.querySelector('.weather-icon');
        const textSpan = badge.querySelector('.weather-text');
        if (iconSpan) iconSpan.textContent = icon;
        if (textSpan) textSpan.textContent = `서울 · ${weatherKo} · ${Math.round(current.temperature_2m)}°C`;
      }
    }).catch(err => {
      document.documentElement.setAttribute('data-weather', 'none');
    });
  }

})();