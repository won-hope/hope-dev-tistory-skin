/**
 * HOPEDEV Editorial Skin Script
 * Optimized by Silicon Valley TF Team
 * Added: Mac Code Block Copy, Interactive TOC
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    removePreloader();
    initThemeToggle();
    initSearchToggle();
    initSidebarToggle();

    // Post Detail Scripts
    initMacCodeBlocks();
    initFloatingTOC();
    initReadingProgress();
    initReadingTime();

    // Main Dashboard Scripts
    initPopularCategories();
    initStats();

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
    const closeBtn = document.querySelector('.sidebar-close');

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
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
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

    if (closeBtn) {
      closeBtn.addEventListener('click', () => { overlay.style.display = 'none'; });
    }
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
     [New] Mac Style Code Blocks & Copy Button
     ------------------------------------------------------------- */
  function initMacCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.post-content pre');
    codeBlocks.forEach((pre, index) => {
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'mac-code-block';

      // Create Header with Mac Buttons
      const header = document.createElement('div');
      header.className = 'mac-code-header';

      // Create Copy Button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'mac-code-copy-btn';
      copyBtn.textContent = 'Copy';

      copyBtn.addEventListener('click', () => {
        const codeText = pre.innerText || pre.textContent;
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        });
      });

      header.appendChild(copyBtn);

      // Wrap elements
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }

  /* -------------------------------------------------------------
     [New] Floating Side TOC Logic
     ------------------------------------------------------------- */
  function initFloatingTOC() {
    const content = document.querySelector('.post-content');
    const tocPanel = document.getElementById('sideTocPanel');
    const tocContent = document.getElementById('sideTocContent');
    const tocToggleBtn = document.getElementById('tocToggleBtn');
    const tocCloseBtn = document.getElementById('tocCloseBtn');

    if (!content || !tocPanel || !tocToggleBtn) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      tocToggleBtn.style.display = 'none';
      return;
    }

    // Toggle Panel
    const togglePanel = () => tocPanel.classList.toggle('active');
    tocToggleBtn.addEventListener('click', togglePanel);
    if (tocCloseBtn) tocCloseBtn.addEventListener('click', () => tocPanel.classList.remove('active'));

    // Populate TOC
    const tocLinks = [];
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = 'toc-heading-' + index;

      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      link.className = 'toc-link';

      if (heading.tagName.toLowerCase() === 'h3') { link.classList.add('toc-h3'); }

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(heading.id);
        if (target) {
          const headerOffset = 80;
          const offsetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      });

      tocContent.appendChild(link);
      tocLinks.push({ id: heading.id, el: link });
    });

    // Scroll Highlight
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

  function initReadingProgress() {
    const progress = document.getElementById('readingProgress');
    if (!progress) return;
    const update = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? (scrolled / max) * 100 : 0;
      progress.style.width = `${value}%`;
    };
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  function initReadingTime() {
    const content = document.querySelector('.post-content');
    const timeVals = document.querySelectorAll('.time-val');
    if (content && timeVals.length > 0) {
      const text = content.textContent || '';
      const wordCount = text.trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(wordCount / 200));
      timeVals.forEach(el => el.textContent = `${minutes}분 소요`);
    }
  }

  function initStats() {
    const startDateStr = window.SkinOptions?.blogStartDate || '2024-01-01';
    const start = new Date(startDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));

    const ageEl = document.getElementById('mainBlogAge');
    if (ageEl) ageEl.innerHTML = `${diffDays}<small>일째</small>`;

    const totalPostsEl = document.getElementById('mainTotalPosts');
    if (totalPostsEl) {
      let total = 0;
      const totalLink = document.querySelector('.header-nav .tt_category > li > a.link_tit');
      if (totalLink) {
        const match = totalLink.textContent.match(/\((\d+)\)/);
        if (match) total = parseInt(match[1], 10);
      }
      if (total === 0) {
        const mainLinks = document.querySelectorAll('.header-nav .category_list > li > a');
        mainLinks.forEach(link => {
          const match = link.textContent.match(/\((\d+)\)/);
          if (match) total += parseInt(match[1], 10);
        });
      }
      if (total === 0) total = document.querySelectorAll('.bento-card').length;
      totalPostsEl.innerHTML = `${total}<small>개</small>`;
    }
  }

  function initPopularCategories() {
    const catLinks = document.querySelectorAll('.header-nav .category_list > li > a, .header-nav .category_list > li > ul > li > a');
    const grid = document.getElementById('popularCategoryGrid');
    if (!grid || catLinks.length === 0) return;

    const images = [
      "https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=200&q=80",
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=200&q=80",
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=80",
      "https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?w=200&q=80"
    ];

    let count = 0;
    catLinks.forEach(link => {
      if (count >= 4) return;
      const match = link.textContent.match(/(.*?)\s*\((\d+)\)/);
      let name = link.textContent;
      let articleCount = '0';
      if (match) { name = match[1].trim(); articleCount = match[2]; }
      if (name === '분류 전체보기' || name === '') return;

      const rank = count + 1;
      const imgSrc = images[count] || images[0];

      const cardHTML = `
        <a href="${link.href}" class="cat-card">
          <div class="cat-badge rank-${rank}">#${rank}</div>
          <div class="cat-icon"><img src="${imgSrc}" alt="${name}"></div>
          <h3 class="cat-name">${name}</h3>
          <span class="cat-count">${articleCount} Articles</span>
        </a>
      `;
      grid.insertAdjacentHTML('beforeend', cardHTML);
      count++;
    });
  }

  function initTypingAnimation() {
    const target = document.getElementById('heroTypingText');
    if (!target || !window.SkinOptions.heroKeywords) return;
    const keywords = window.SkinOptions.heroKeywords.split(',').map(s => s.trim()).filter(Boolean);
    if (keywords.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { target.textContent = keywords[0]; return; }

    let wordIndex = 0; let charIndex = 0; let isDeleting = false;
    function type() {
      const currentWord = keywords[wordIndex];
      if (isDeleting) { target.textContent = currentWord.substring(0, charIndex - 1); charIndex--; }
      else { target.textContent = currentWord.substring(0, charIndex + 1); charIndex++; }

      let typeSpeed = isDeleting ? 50 : 100;
      if (!isDeleting && charIndex === currentWord.length) { typeSpeed = 2000; isDeleting = true; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % keywords.length; typeSpeed = 500; }
      setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);
  }

  async function initWeatherTheme() {
    const CACHE_KEY = 'hopedev_weather_cache';
    const CACHE_MINS = 30;
    const lat = 37.5665; const lon = 126.9780;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover&timezone=Asia%2FSeoul`;

    let weatherData = null;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (new Date().getTime() - parsed.timestamp < CACHE_MINS * 60 * 1000) { weatherData = parsed.data; }
      }
    } catch (e) { }

    if (!weatherData) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('API Error');
        const json = await res.json();
        weatherData = json.current;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: new Date().getTime(), data: weatherData }));
      } catch (err) {
        document.documentElement.setAttribute('data-weather', 'none');
        return;
      }
    }
    applyWeatherTheme(weatherData);
  }

  function applyWeatherTheme(current) {
    const code = current.weather_code;
    const isDay = current.is_day === 1;
    const temp = Math.round(current.temperature_2m);
    const snow = current.snowfall > 0;
    const rain = current.precipitation > 0 || current.rain > 0 || current.showers > 0;

    let weatherState = 'sunny'; let weatherKo = '맑음'; let icon = '☀️';
    if (snow) { weatherState = 'snowy'; weatherKo = '눈'; icon = '❄️'; }
    else if (rain) { weatherState = 'rainy'; weatherKo = '비'; icon = '☔'; }
    else if ([0, 1].includes(code)) { weatherState = 'sunny'; weatherKo = '맑음'; icon = '☀️'; }
    else { weatherState = 'cloudy'; weatherKo = '흐림'; icon = '☁️'; }

    if (!isDay) weatherState = 'night';
    if (window.SkinOptions.autoWeatherTheme) document.documentElement.setAttribute('data-weather', weatherState);
    if (window.SkinOptions.showWeatherBadge) {
      const badge = document.getElementById('weatherBadge');
      if (badge) {
        badge.style.display = 'flex';
        const iconSpan = badge.querySelector('.weather-icon');
        const textSpan = badge.querySelector('.weather-text');
        if (iconSpan) iconSpan.textContent = icon;
        if (textSpan) textSpan.textContent = `서울 · ${weatherKo} · ${temp}°C`;
      }
    }
  }

})();