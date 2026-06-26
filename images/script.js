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
    parseAndBuildSidebarCategories();

    // UI Enhancements
    beautifyMegaMenu();
    initPopularCategories();
    fetchPopularPosts();
    animateCounters();

    // Post Detail Scripts
    initDualTOC();
    initMacCodeBlocks(); // 언어표시 및 코드 복사 버튼 신규 추가
    initReadingProgress();
    initGlobalMeteors(); // 다크모드 글로벌 유성우 추가
    
    // Premium Features 2.0
    initSeriesNav();
    initScrollReveal();
    initReadingTime();
    initFAB();
    initTerminalTyping();

    if (window.SkinOptions) {
      if (window.SkinOptions.useAnimation) initDecryptAnimation();
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
    if (!overlay) return;

    const input = document.getElementById('searchInput');
    const backdrop = overlay.querySelector('.search-overlay-backdrop');

    function openSearch() {
      overlay.style.display = 'flex';
      requestAnimationFrame(() => {
        overlay.classList.add('active');
        if (input) input.focus();
      });
      document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }, 200);
    }

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
    });

    if (backdrop) backdrop.addEventListener('click', closeSearch);

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') closeSearch();
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        openSearch();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    });

    window.submitSearch = function(keyword) {
      if (keyword) {
        window.location.href = '/search/' + encodeURIComponent(keyword);
      }
    };
  }

  function initThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    const sunIcon = btn.querySelector('.icon-sun');
    const moonIcon = btn.querySelector('.icon-moon');
    const html = document.documentElement;

    const isSystemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

    const updateIcon = (theme) => {
      const isDark = theme === 'dark' || (theme === 'system' && isSystemDark());
      if (isDark) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    };

    const currentTheme = html.getAttribute('data-theme') || 'light';
    updateIcon(currentTheme);

    btn.addEventListener('click', () => {
      let current = html.getAttribute('data-theme');
      let next = 'dark';
      
      if (current === 'dark') {
        next = 'light';
      } else if (current === 'system' && isSystemDark()) {
        next = 'light';
      }
      
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
      
      // Premium Code Block: Add line numbers
      let codeEl = pre.querySelector('code');
      if (codeEl) {
        let lines = codeEl.innerHTML.split('\n');
        if (lines[lines.length-1] === '') lines.pop();
        codeEl.innerHTML = lines.map(line => `<span class="line">${line}</span>`).join('\n');
      }

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

  function initDecryptAnimation() {
    const el = document.getElementById('decryptText');
    if (!el) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    const rawKeywords = window.SkinOptions?.heroKeywords;
    const targetWords = rawKeywords ? rawKeywords.split(',') : ['Intelligence', 'Agents', 'Future', 'Excellence'];
    
    let kIdx = 0;
    
    function decryptWord(word) {
      let iteration = 0;
      let interval = null;
      
      clearInterval(interval);
      
      interval = setInterval(() => {
        el.innerText = word
          .split('')
          .map((letter, index) => {
            if(index < iteration) {
              return word[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        if(iteration >= word.length){ 
          clearInterval(interval);
          setTimeout(() => {
            kIdx = (kIdx + 1) % targetWords.length;
            decryptWord(targetWords[kIdx].trim());
          }, 3000);
        }
        iteration += 1 / 3;
      }, 30);
    }

    setTimeout(() => {
      decryptWord(targetWords[kIdx].trim());
    }, 1000);
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

          let start = null;
          const duration = 2500; 

          const easeOutExpo = (t) => {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          };

          const updateCount = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const current = target * easeOutExpo(progress);
            
            if (progress < 1) {
              el.innerText = Math.floor(current).toLocaleString();
              requestAnimationFrame(updateCount);
            } else {
              el.innerText = target.toLocaleString();
            }
          };
          requestAnimationFrame(updateCount);
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
        <a href="${link.href}" class="tech-core-card">
          <div class="tech-core-bg"></div>
          <div class="tech-badge ${rankClass}">#${rank}</div>
          <div class="tech-icon-wrap">${iconSvg}</div>
          <h3 class="tech-name">[ SYS / ${name} ]</h3>
          <div class="tech-energy-bar">
            <div class="energy-fill" style="width: ${Math.min(parseInt(articleCount)*5, 100)}%;"></div>
          </div>
          <span class="tech-count">${articleCount} DATA UNITS</span>
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
          <div class="section-header tech-section-header">
            <h2 class="section-title cyber-title">${cat.name} HOT LOGS <span class="cyber-blink">_</span></h2>
            <p class="section-desc cyber-desc">Analyzing popular data streams for [${cat.name}] sector.</p>
          </div>
          <div class="magazine-grid" id="popCatGrid-${index}" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
             <div class="radar-scan-empty" style="grid-column: 1 / -1;">
               <div class="radar-line"></div>
               <div class="radar-text">[ INITIALIZING SCAN... ]</div>
             </div>
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
              grid.innerHTML = `
                <div class="radar-scan-empty" style="grid-column: 1 / -1;">
                  <div class="radar-line"></div>
                  <div class="radar-text">[ NO DATA SIGNAL ]<br><span style="font-size:0.85rem; color:rgba(255,255,255,0.6); margin-top:0.5rem; display:block;">수집된 포스팅이 없습니다</span></div>
                </div>
              `;
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
      newRoot.innerHTML = `${rootName} <span class="sidebar-cat-count">${rootCount} Articles</span>`;
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
      newA.innerHTML = `<span class="sidebar-cat-icon">${iconSvg}</span><span class="sidebar-cat-name">${name}</span><span class="sidebar-cat-count">${count} Articles</span>`;
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
    const tocOverlay = document.getElementById('tocOverlay');

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
          if (sideTocPanel) sideTocPanel.classList.remove('active');
          if (tocOverlay) tocOverlay.classList.remove('show');
          document.body.style.overflow = '';
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
      const openToc = () => {
        sideTocPanel.classList.add('active');
        if (tocOverlay) tocOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
      };
      const closeToc = () => {
        sideTocPanel.classList.remove('active');
        if (tocOverlay) tocOverlay.classList.remove('show');
        document.body.style.overflow = '';
      };

      tocToggleBtn.addEventListener('click', openToc);
      if (tocCloseBtn) tocCloseBtn.addEventListener('click', closeToc);
      if (tocOverlay) tocOverlay.addEventListener('click', closeToc);

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
    let progress = document.getElementById('readingProgress');
    if (!progress) {
      progress = document.createElement('div');
      progress.id = 'readingProgress';
      progress.style.position = 'fixed';
      progress.style.top = '0';
      progress.style.left = '0';
      progress.style.height = '3px';
      progress.style.background = 'linear-gradient(90deg, #00f0ff, #ff0080)';
      progress.style.boxShadow = '0 0 10px #00f0ff';
      progress.style.zIndex = '9999';
      progress.style.width = '0%';
      progress.style.transition = 'width 0.1s ease-out';
      document.body.appendChild(progress);
    }
    
    // Add Estimated Reading Time
    const postContent = document.querySelector('.post-content');
    if (postContent) {
      const text = postContent.innerText || postContent.textContent;
      const wordCount = text.trim().length;
      // Roughly 400 chars per minute for Korean
      const readingTime = Math.max(1, Math.ceil(wordCount / 400));
      const titleArea = document.querySelector('.post-title');
      if (titleArea) {
        const estBadge = document.createElement('div');
        estBadge.className = 'est-reading-time cyber-desc';
        estBadge.innerHTML = `<span class="cyber-blink">_</span> [ SCANNING... EST. TIME: ${readingTime} MINS ]`;
        estBadge.style.marginTop = '1rem';
        estBadge.style.color = '#00f0ff';
        estBadge.style.fontFamily = 'var(--font-mono)';
        estBadge.style.fontSize = '0.85rem';
        titleArea.parentElement.insertBefore(estBadge, titleArea.nextSibling);
      }
    }

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

  /* -------------------------------------------------------------
     [New] Background Stars Mouse Parallax (V8.0)
     ------------------------------------------------------------- */
  function initStarsParallax() {
    const starsLayers = document.querySelectorAll('.stars-layer');
    if (starsLayers.length === 0) return;
    
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60; // 60px max movement
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      
      starsLayers.forEach((layer, index) => {
        // Create 3D depth by moving each layer at different speeds
        const factor = (index + 1) * 0.5; 
        layer.style.marginLeft = `${-x * factor}px`;
        layer.style.marginTop = `${-y * factor}px`;
      });
    });
  }

  /* -------------------------------------------------------------
     [New] Global Meteor Shower (Dark Mode Only)
     ------------------------------------------------------------- */
  function initGlobalMeteors() {
    const meteorContainer = document.createElement('div');
    meteorContainer.className = 'global-meteor-shower';
    document.body.appendChild(meteorContainer);

    for (let i = 0; i < 12; i++) {
      const meteor = document.createElement('div');
      meteor.className = 'meteor';
      meteor.style.left = `${Math.random() * 100}%`;
      meteor.style.top = `${Math.random() * 50}%`;
      meteor.style.animationDelay = `${Math.random() * 10}s`;
      meteorContainer.appendChild(meteor);
    }
  }

  /* -------------------------------------------------------------
     [New] Warp Drive Page Transition (V9.0)
     ------------------------------------------------------------- */
  function initWarpDrive() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      if (target.target === '_blank' || target.hasAttribute('download')) return;
      
      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      
      // Allow default for modifier keys
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      const isInternal = target.host === window.location.host || !target.host;
      if (!isInternal) return;

      e.preventDefault();
      
      // Trigger Warp Engine
      const engine = document.createElement('div');
      engine.id = 'warpEngine';
      
      // Spawn 150 warp lines
      for (let i = 0; i < 150; i++) {
        const line = document.createElement('div');
        line.className = 'warp-line';
        const angle = Math.random() * 360;
        const startDist = Math.random() * 100 + 20;
        line.style.setProperty('--angle', `${angle}deg`);
        line.style.setProperty('--start-dist', `${startDist}px`);
        line.style.animationDelay = `${Math.random() * 0.15}s`;
        engine.appendChild(line);
      }
      
      const flash = document.createElement('div');
      flash.id = 'warpFlash';

      document.body.appendChild(engine);
      document.body.appendChild(flash);
      document.body.classList.add('warp-active');

      // Navigate after animation
      setTimeout(() => {
        window.location.href = target.href;
      }, 700);
    });
  }

  /* -------------------------------------------------------------
     [Premium] Series Navigation (RSS Fetch)
     ------------------------------------------------------------- */
  function initSeriesNav() {
    const seriesContainer = document.getElementById('seriesNavContainer');
    const categoryBadge = document.querySelector('.inpa-post-badge');
    const categoryLinkEl = categoryBadge ? categoryBadge.querySelector('a') : null;
    
    if (!seriesContainer || !categoryLinkEl) return;
    
    const categoryUrl = categoryLinkEl.href;
    const categoryName = categoryLinkEl.textContent;
    
    seriesContainer.innerHTML = `<div class="series-header"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> <strong>'${categoryName}'</strong> 시리즈</div><div class="series-list"><div style="text-align:center; padding: 20px;"><div class="star-spinner" style="display:inline-block; width:20px;height:20px;border:2px solid var(--point-color);border-top:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div></div></div>`;
    
    fetch(categoryUrl)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Extract links from standard inpa-card-link or list-items
        const articles = Array.from(doc.querySelectorAll('.inpa-card-link')).slice(0, 5);
        if (articles.length > 0) {
          let listHtml = '<ul>';
          articles.forEach(a => {
            const titleEl = a.querySelector('.inpa-card-title') || a;
            const title = titleEl.textContent;
            const isCurrent = a.href === window.location.href ? 'class="current"' : '';
            listHtml += `<li ${isCurrent}><a href="${a.href}">${title}</a></li>`;
          });
          listHtml += '</ul>';
          seriesContainer.querySelector('.series-list').innerHTML = listHtml;
        } else {
          seriesContainer.style.display = 'none';
        }
      })
      .catch(() => seriesContainer.style.display = 'none');
  }

  /* -------------------------------------------------------------
     [Premium] Scroll Interaction (IntersectionObserver)
     ------------------------------------------------------------- */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.inpa-card, .post-content h2, .post-content h3, .post-content p, .post-content img, .ad-container').forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------------
     [Premium] Reading Time Calculation
     ------------------------------------------------------------- */
  function initReadingTime() {
    const content = document.querySelector('.post-content');
    const metaContainer = document.querySelector('.inpa-post-meta');
    if (!content || !metaContainer) return;

    const textLength = content.innerText.replace(/\s/g, '').length;
    const wpm = 300; 
    let time = Math.ceil(textLength / wpm);
    if (time < 1) time = 1;
    
    const timeBadge = document.createElement('span');
    timeBadge.className = 'meta-item reading-time';
    timeBadge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ☕ ${time}분 소요`;
    metaContainer.appendChild(timeBadge);
  }

  /* -------------------------------------------------------------
     [Premium] FAB Toggle
     ------------------------------------------------------------- */
  function initFAB() {
    const fabMain = document.getElementById('hopeFabMain');
    const fabMenu = document.getElementById('hopeFabMenu');
    if (!fabMain || !fabMenu) return;

    fabMain.addEventListener('click', () => {
      fabMenu.classList.toggle('active');
      fabMain.classList.toggle('active');
    });

    document.getElementById('hopeFabTop')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fabMenu.classList.remove('active');
      fabMain.classList.remove('active');
    });
    
    document.getElementById('hopeFabShare')?.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('주소가 복사되었습니다!');
        fabMenu.classList.remove('active');
        fabMain.classList.remove('active');
      });
    });
  }

  /* -------------------------------------------------------------
     [Premium] Terminal Typing Animation
     ------------------------------------------------------------- */
  function initTerminalTyping() {
    const textTarget = document.getElementById('terminalTypingText');
    if (!textTarget) return;
    const text = "본질을 꿰뚫는 문제 해결과 견고한 시스템 설계를 통해,\n세상에 지속 가능한 가치를 더하는 소프트웨어를 만듭니다.";
    let i = 0;
    textTarget.innerHTML = ''; 
    function typeWriter() {
      if (i < text.length) {
        if (text.charAt(i) === '\n') {
          textTarget.innerHTML += '<br>';
        } else {
          textTarget.innerHTML += text.charAt(i);
        }
        i++;
        setTimeout(typeWriter, Math.random() * 50 + 30); 
      }
    }
    // Start typing animation after 1.5 seconds to feel like the terminal is booting up
    setTimeout(typeWriter, 1500); 
  }

  /* -------------------------------------------------------------
     [Premium] Nature CountUp Animation
     ------------------------------------------------------------- */
  function initNatureCountUp() {
    const counters = document.querySelectorAll('.counter-num');
    if(counters.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          const el = entry.target;
          const rawVal = el.getAttribute('data-raw');
          const target = parseInt(rawVal || el.innerText.replace(/,/g, '') || 0, 10);
          if (isNaN(target)) return;
          let count = 0;
          const duration = 2000;
          const step = Math.max(1, Math.floor(target / (duration / 16)));
          
          function update() {
            count += step;
            if(count >= target) {
              el.innerText = target.toLocaleString();
            } else {
              el.innerText = count.toLocaleString();
              requestAnimationFrame(update);
            }
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(c => observer.observe(c));
  }

  /* -------------------------------------------------------------
     [Premium] 3D Hover Tilt & Shine
     ------------------------------------------------------------- */
  function init3DTiltCards() {
    const cards = document.querySelectorAll('.inpa-card.bento-card');
    cards.forEach(card => {
      // Create glare overlay dynamically
      const glare = document.createElement('div');
      glare.className = 'glare-overlay';
      card.appendChild(glare);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, transparent 60%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
      });
    });
  }

  /* -------------------------------------------------------------
     [Premium] Interactive Hero Particles
     ------------------------------------------------------------- */
  function initHeroParticles() {
    const heroOverlay = document.querySelector('.hero-overlay');
    if (!heroOverlay) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'heroCanvas';
    heroOverlay.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: undefined, y: undefined, radius: 120 };

    function resize() {
      width = heroOverlay.clientWidth;
      height = heroOverlay.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    }

    class Particle {
      constructor(x, y, size, color) {
        this.x = x; this.y = y;
        this.size = size; this.color = color;
        this.baseX = this.x; this.baseY = this.y;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (mouse.x !== undefined && mouse.y !== undefined) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * 5;
          let directionY = forceDirectionY * force * 5;

          if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
          } else {
            if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 15;
            }
            if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 15;
            }
          }
        } else {
            if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 15;
            }
            if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 15;
            }
        }
        this.draw();
      }
    }

    function initParticles() {
      particles = [];
      let numberOfParticles = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let color = 'rgba(255, 255, 255, 0.6)';
        particles.push(new Particle(x, y, size, color));
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
    }

    window.addEventListener('resize', resize);
    
    // Mouse events directly on hero wrapper to easily track mouse
    const heroContent = document.querySelector('.hero-content') || heroOverlay;
    document.querySelector('.hero-section').addEventListener('mousemove', function(event) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });
    document.querySelector('.hero-section').addEventListener('mouseleave', function() {
      mouse.x = undefined;
      mouse.y = undefined;
    });

    resize();
    animate();
  }

  /* -------------------------------------------------------------
     DOMContentLoaded
     ------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initCopyButton();
    initCodeCopy();
    initTableOfContents();
    initReadingProgress();
    initWeatherTheme();
    initPostFeatures();
    initPopularCategories();
    fetchPopularPosts();
    parseAndBuildSidebarCategories();
    initGlobalMeteors();
    initStarsParallax();
    initWarpDrive();
    
    // Premium Dashboard Features
    initNatureCountUp();
    init3DTiltCards();
    initHeroParticles();
  });

})();