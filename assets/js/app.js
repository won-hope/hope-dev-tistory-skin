/* ----------------------------------------------------
   HOPEDEV Static Theme V1 JavaScript Features
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileDrawer();
  initCategoryAccordion();
  initScrollProgressAndHeaderTitle();
  initTableOfContents();
  initCodeCopy();
  initLightbox();
  initBackToTop();

  // V2 Additions
  initLoader();
  renderDashboard();
  renderPopularCategories();
  renderEngineeringCircle();
  renderSidebarCategoryCounts();

  // V3 Additions
  if (typeof initV3Features === 'function') initV3Features();
});

/**
 * 1. LocalStorage 기반 다크모드 저장 및 복원
 */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const html = document.documentElement;

  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcons(theme);
  };

  const updateThemeIcons = (theme) => {
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');
    const labels = document.querySelectorAll('#themeToggle span');

    if (theme === 'dark') {
      sunIcons.forEach(el => el.style.display = 'none');
      moonIcons.forEach(el => el.style.display = 'inline-block');
      labels.forEach(el => el.textContent = 'Light Mode');
      if (themeToggle) themeToggle.setAttribute('aria-label', '라이트 모드로 전환');
    } else {
      sunIcons.forEach(el => el.style.display = 'inline-block');
      moonIcons.forEach(el => el.style.display = 'none');
      labels.forEach(el => el.textContent = 'Dark Mode');
      if (themeToggle) themeToggle.setAttribute('aria-label', '다크 모드로 전환');
    }
  };

  // Toggle handlers
  const toggleTheme = () => {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  };

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

  // Initialize
  applyTheme(getSavedTheme());
}

/**
 * 2. 모바일 메뉴 열기/닫기 & 키보드 접근성
 */
function initMobileDrawer() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('drawerOverlay');
  const navToggle = document.getElementById('mobileNavToggle');

  if (!sidebar || !overlay || !navToggle) return;

  const openDrawer = () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    // Trap focus helper
    sidebar.focus();
  };

  const closeDrawer = () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
  };

  navToggle.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeDrawer();
      navToggle.focus();
    }
  });

  // Focus trapping within mobile drawer
  sidebar.setAttribute('tabindex', '-1');
  const focusableElements = sidebar.querySelectorAll('a, button, [tabindex="0"]');
  if (focusableElements.length > 0) {
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    sidebar.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
}

/**
 * 3. 카테고리 접기/펼치기 아코디언
 */
function initCategoryAccordion() {
  const trigger = document.getElementById('categoryTrigger');
  const content = document.getElementById('categoryList');

  if (!trigger || !content) return;

  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', !expanded);
    trigger.classList.toggle('expanded', !expanded);
    content.classList.toggle('expanded', !expanded);
  });
}

/**
 * 4. 스크롤 진행률 & 상세페이지 스크롤 시 글 제목 상단 표시
 */
function initScrollProgressAndHeaderTitle() {
  const topBar = document.getElementById('topBar');
  const progressBar = document.getElementById('scrollProgressBar');
  const headerTitle = document.getElementById('headerArticleTitle');
  const articleTitle = document.querySelector('.article-title');

  if (!topBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // 4.1 Scroll Progress Bar update
    if (scrollHeight > 0) {
      const percentage = (scrollTop / scrollHeight) * 100;
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', Math.round(percentage));
      }
    }

    // 4.2 Top Bar backdrop style on scroll
    if (scrollTop > 10) {
      topBar.classList.add('scrolled');
    } else {
      topBar.classList.remove('scrolled');
    }

    // 4.3 Show Article Title in Top Bar when scrolling past the main title
    if (headerTitle && articleTitle) {
      const titleBottom = articleTitle.getBoundingClientRect().bottom + window.scrollY;
      if (scrollTop > titleBottom - 50) {
        headerTitle.classList.add('show');
      } else {
        headerTitle.classList.remove('show');
      }
    }
  }, { passive: true });
}

/**
 * 5. article.html의 h2, h3를 읽어 우측 목차 자동 생성 및 IntersectionObserver 기반 Scrollspy
 */
function initTableOfContents() {
  const articleBody = document.querySelector('.article-body');
  const tocList = document.getElementById('tocList');

  if (!articleBody || !tocList) return;

  const headings = articleBody.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    // Hide right-toc if no headings present
    const rightToc = document.querySelector('.right-toc');
    if (rightToc) rightToc.style.display = 'none';
    return;
  }

  // Clear any dummy contents
  tocList.innerHTML = '';

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -60% 0px', // Trigger near top of viewport
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // Remove active class from all TOC items
        const activeLinks = tocList.querySelectorAll('.toc-item');
        activeLinks.forEach(link => link.classList.remove('active'));

        // Add active class to corresponding link
        const targetLink = tocList.querySelector(`a[href="#${id}"]`);
        if (targetLink && targetLink.parentElement) {
          targetLink.parentElement.classList.add('active');
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  headings.forEach((heading, idx) => {
    // 5.1 Ensure element has valid ID
    if (!heading.id) {
      heading.id = `heading-${idx}-${heading.textContent.trim().replace(/[^a-zA-Z0-9가-힣]/g, '-').toLowerCase()}`;
    }

    // 5.2 Create TOC element
    const li = document.createElement('li');
    li.className = `toc-item level-${heading.tagName.toLowerCase()}`;

    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;

    // Smooth scrolling respects motion constraints
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const targetElement = document.getElementById(heading.id);
      if (targetElement) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.scrollY - 70, // offset for header
          behavior: reduceMotion ? 'auto' : 'smooth'
        });

        // Push state manually
        history.pushState(null, null, `#${heading.id}`);
      }
    });

    li.appendChild(a);
    tocList.appendChild(li);

    // 5.3 Observe heading for scrollspy
    observer.observe(heading);
  });
}

/**
 * 6. 코드 복사 버튼 및 Copied 피드백
 */
function initCodeCopy() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      // Find code inside the same wrapper
      const wrapper = btn.closest('.code-block-wrapper');
      if (!wrapper) return;

      const codeElement = wrapper.querySelector('pre code');
      if (!codeElement) return;

      const codeText = codeElement.textContent;

      try {
        await navigator.clipboard.writeText(codeText);

        // Feedback State
        btn.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        btn.textContent = 'Error';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 2000);
      }
    });
  });
}

/**
 * 7. 이미지 클릭 라이트박스
 */
function initLightbox() {
  const articleImages = document.querySelectorAll('.article-image');
  const overlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  if (!overlay || !lightboxImg || !closeBtn) return;

  const openLightbox = (imgSrc, altText) => {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = altText;
    overlay.classList.add('active');
    closeBtn.focus();
  };

  const closeLightbox = () => {
    overlay.classList.remove('active');
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxImg.alt = '';
    }, 300);
  };

  articleImages.forEach(img => {
    // Keyboard accessibility - make images focusable
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `${img.alt} 이미지 크게 보기`);

    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });

    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * 10. 맨 위로 이동 버튼
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  // Track scroll position to convert button style
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // If scrolled past 300px, float it in mobile-drawer views
    if (scrollTop > 300) {
      backToTopBtn.classList.add('floating', 'show');
    } else {
      backToTopBtn.classList.remove('show');
      // Wait for exit transition to remove float wrapper class
      setTimeout(() => {
        if (window.scrollY <= 300) {
          backToTopBtn.classList.remove('floating');
        }
      }, 200);
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  });
}

/* ----------------------------------------------------
   V2 Features Implementation
   ---------------------------------------------------- */

const blogDashboardConfig = {
  totalVisitors: 15420,
  totalPosts: 42,
  blogStartDate: "2023-01-15",
  engineeringCircleCount: 4
};

const categoryStats = [
  { name: "AI Agent", description: "Agentic workflow와 AI 활용 기록", count: 12, href: "article.html?category=ai-agent", icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l-7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>` },
  { name: "System Design", description: "고가용성, 장애 허용 시스템 아키텍처", count: 8, href: "article.html?category=system-design", icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>` },
  { name: "Backend & API", description: "견고한 API 설계 표준, 보안 프로토콜", count: 15, href: "article.html?category=backend-api", icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>` },
  { name: "Data & Performance", description: "DB 튜닝, 캐싱 전략, 병목 분석", count: 5, href: "article.html?category=data-performance", icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` },
  { name: "Troubleshooting", description: "프로덕션 환경 장애 원인 진단 및 회고", count: 0, href: "article.html?category=troubleshooting", icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` },
  { name: "Engineering Notes", description: "실용적 설계 방법론 및 기술 아티클 리뷰", count: 2, href: "article.html?category=engineering-notes", icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` },
  { name: "Project Log", description: "개인 프로젝트 설계 이력 아카이빙", count: 1, href: "article.html?category=project-log", icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>` }
];

const engineeringCircle = [
  { name: "Wondervision", description: "Frontend · UX Design", url: "https://example.com", initials: "WV" },
  { name: "Tech Blog A", description: "Backend · System Design", url: "#", initials: "TB" },
  { name: "Agentic Dev", description: "AI · ML · Automation", url: "#", initials: "AD" },
  { name: "Data Logs", description: "Data Engineering", url: "https://example.org", initials: "DL" }
];

function initLoader() {
  const overlay = document.getElementById('loaderOverlay');
  if (!overlay) {
    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
    return;
  }

  let fallbackTimer;

  const hideLoader = () => {
    if (fallbackTimer) clearTimeout(fallbackTimer);
    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
    overlay.classList.add('hidden');

    // Safety remove or hide completely after CSS transition
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 250);
  };

  // Safe fallback timer max 800ms
  fallbackTimer = setTimeout(hideLoader, 800);

  // Wait 2 requestAnimationFrames after DOMContentLoaded
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hideLoader();
    });
  });
}

function countUp(el, target) {
  if (target === 0) {
    el.textContent = "0";
    return;
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    el.textContent = target.toLocaleString();
    return;
  }

  const duration = 1500;
  const start = performance.now();
  const animate = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);
    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      el.textContent = target.toLocaleString();
    }
  };
  requestAnimationFrame(animate);
}

function calculateDaysSince(dateString) {
  if (!dateString) return null;
  const start = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function renderDashboard() {
  const statsContainer = document.getElementById('dashboardStats');
  if (!statsContainer) return;

  const daysSince = calculateDaysSince(blogDashboardConfig.blogStartDate);
  const buildingLabel = daysSince ? `D+<span class="count-target" data-value="${daysSince}">0</span>` : "Building";

  statsContainer.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
      <div class="stat-val count-target" data-value="${blogDashboardConfig.totalVisitors}">0</div>
      <div class="stat-desc">Total Visitors</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
      <div class="stat-val count-target" data-value="${blogDashboardConfig.totalPosts}">0</div>
      <div class="stat-desc">Total Posts</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
      <div class="stat-val">${buildingLabel}</div>
      <div class="stat-desc">Building Since</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></div>
      <div class="stat-val count-target" data-value="${blogDashboardConfig.engineeringCircleCount}">0</div>
      <div class="stat-desc">Engineering Circle</div>
    </div>
  `;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.count-target');
        counters.forEach(el => {
          const val = parseInt(el.getAttribute('data-value'), 10);
          countUp(el, val);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(statsContainer);
}

function renderPopularCategories() {
  const container = document.getElementById('popularCategoriesGrid');
  if (!container) return;

  const maxCount = Math.max(...categoryStats.map(c => c.count), 1);

  container.innerHTML = categoryStats.map(cat => {
    const percentage = Math.max((cat.count / maxCount) * 100, cat.count > 0 ? 5 : 0);
    return `
      <a href="${cat.href}" class="category-list-card">
        <div class="cat-card-header">
          <div class="cat-icon">${cat.icon}</div>
          <h3 class="cat-name">${cat.name}</h3>
          <span class="cat-count">${cat.count}</span>
        </div>
        <p class="cat-desc">${cat.description}</p>
        <div class="cat-progress-bg">
          <div class="cat-progress-fill" style="width: ${percentage}%"></div>
        </div>
      </a>
    `;
  }).join('');
}

function renderEngineeringCircle() {
  const container = document.getElementById('engineeringCircleGrid');
  if (!container) return;

  container.innerHTML = engineeringCircle.map(circle => {
    const isLinkDisabled = circle.url === '#';
    const tag = isLinkDisabled ? 'div' : 'a';
    const hrefAttr = isLinkDisabled ? '' : `href="${circle.url}" target="_blank" rel="noopener noreferrer"`;
    const disabledClass = isLinkDisabled ? 'disabled-link' : '';

    return `
      <${tag} ${hrefAttr} class="circle-card ${disabledClass}">
        <div class="circle-avatar">${circle.initials}</div>
        <div class="circle-info">
          <h4 class="circle-name">${circle.name}</h4>
          <p class="circle-desc">${circle.description}</p>
        </div>
        ${!isLinkDisabled ? `<svg class="circle-outlink" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>` : ''}
      </${tag}>
    `;
  }).join('');
}

function renderSidebarCategoryCounts() {
  const countSpans = document.querySelectorAll('.category-count');
  countSpans.forEach(span => {
    const catName = span.getAttribute('data-cat');
    const stat = categoryStats.find(c => c.name === catName);
    if (stat && stat.count > 0) {
      span.textContent = stat.count;
      span.classList.add('has-count');
    }
  });
}

/* ----------------------------------------------------
   V3 Features Implementation
   ---------------------------------------------------- */
function initV3Features() {
  initMegaMenu();
  initSearchOverlay();
  initToastFeedback();
  initCategoryFilter();
  initTagCloud();
}

function initMegaMenu() {
  const triggers = document.querySelectorAll('.nav-link[aria-controls="megaMenu"], .mobile-nav-link[aria-controls="megaMenu"]');
  const overlay = document.getElementById('megaMenu');
  if (!overlay || triggers.length === 0) return;

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isExpanded = overlay.getAttribute('aria-hidden') === 'false';
    
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    overlay.setAttribute('aria-hidden', 'false');
    triggers.forEach(t => t.setAttribute('aria-expanded', 'true'));
  };

  const closeMenu = () => {
    overlay.setAttribute('aria-hidden', 'true');
    triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
  };

  triggers.forEach(t => {
    t.addEventListener('click', toggleMenu);
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu(e);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (overlay.getAttribute('aria-hidden') === 'false' && !overlay.contains(e.target) && !Array.from(triggers).some(t => t.contains(e.target))) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') {
      closeMenu();
    }
  });
}

const v3StaticSearchData = [
  { title: 'ReAct 패턴을 활용한 AI Agent 도구 사용 최적화', category: 'AI Agent', summary: 'LLM이 다수의 API 도구 중 최적의 도구를 선택하고 잘못된 피드백을 통해 자가수정하는 과정에서의 프롬프트 및 컨텍스트 제어 기술.', tags: ['AI', 'ReAct', 'Agent'], link: 'article.html' },
  { title: '트래픽 증가를 고려한 인증 시스템 설계', category: 'System Design', summary: '대용량 유저 유입에 대응하고 고가용성을 유지하기 위해 비대칭키 JWT 검증 방식과 Redis 캐싱을 결합한 하이브리드 세션 아키텍처...', tags: ['System Design', 'Architecture'], link: 'article.html' },
  { title: 'Idempotency-Key 헤더를 통한 결제 API 멱등성 보장', category: 'Backend & API', summary: '네트워크 단절로 인한 중복 결제 시도를 API 게이트웨이 레벨에서 처리하고, 분산 락을 활용해 멱등 처리를 보장하는 가이드.', tags: ['API', 'Idempotency'], link: 'article.html' },
  { title: 'PostgreSQL 인덱스 스캔 성능 최적화 및 모니터링', category: 'Data & Performance', summary: '테이블 풀스캔이 일어나는 쿼리를 EXPLAIN ANALYZE로 분석하고, 적합한 부분 인덱스(Partial Index)와 커버링 인덱스를 적용한 튜닝 기록.', tags: ['DB', 'PostgreSQL', 'Performance'], link: 'article.html' },
  { title: 'Production 환경 JVM 메모리 누수 원인 파악 및 해결', category: 'Troubleshooting', summary: '특정 스케줄러 내의 로컬 캐시 객체가 가비지 컬렉션(GC)되지 않아 발생했던 힙 메모리 고갈 원인을 메모리 덤프 분석을 통해 짚어봅니다.', tags: ['JVM', 'Memory', 'Troubleshooting'], link: 'article.html' },
  { title: 'Tistory 오픈소스 스킨 테마 보일러플레이트 기획', category: 'Project Log', summary: '정적 테마 프로토타입에서 실제 티스토리 스킨 엔진(skin.html) 구조로 자동 이관하기 위한 빌더와 컴포넌트 이식 계획 수립.', tags: ['Tistory', 'Project'], link: 'article.html' },
  { title: '이벤트 기반 아키텍처를 도입하기 전 고려할 세 가지', category: 'System Design', summary: '비동기 메시지 큐 도입에 앞서 발생할 수 있는 Outbox 패턴의 당위성, 메시지 순서 보장 방안, 그리고 Dead Letter Queue 처리에 관하여.', tags: ['Architecture', 'Event-Driven'], link: 'article.html' }
];

function initSearchOverlay() {
  const searchTriggers = document.querySelectorAll('.search-trigger');
  const searchOverlay = document.getElementById('searchOverlay');
  if (!searchOverlay) return;

  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const openSearch = (e) => {
    if(e) e.preventDefault();
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
  };

  const closeSearch = () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
  };

  searchTriggers.forEach(t => t.addEventListener('click', openSearch));
  if(searchClose) searchClose.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    if (!val) {
      searchResults.innerHTML = '';
      return;
    }
    const filtered = v3StaticSearchData.filter(item => 
      item.title.toLowerCase().includes(val) || 
      item.summary.toLowerCase().includes(val) || 
      item.tags.some(tag => tag.toLowerCase().includes(val))
    ).slice(0, 8);

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div class="search-result-item" style="text-align:center; padding: 2rem; color: var(--text-muted)">검색 결과가 없습니다.</div>';
    } else {
      searchResults.innerHTML = filtered.map(item => `
        <div class="search-result-item">
          <div style="font-size: 0.75rem; color: var(--accent); margin-bottom: 0.25rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">${item.category}</div>
          <div class="search-result-title"><a href="${item.link}">${item.title}</a></div>
          <div class="search-result-summary">${item.summary}</div>
        </div>
      `).join('');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      const firstRes = searchResults.querySelector('a');
      if(firstRes) {
        window.location.href = firstRes.href;
      }
    }
  });
}

function initToastFeedback() {
  const feedbackTriggers = document.querySelectorAll('.toast-trigger');
  if (feedbackTriggers.length === 0) return;

  const toast = document.createElement('div');
  toast.className = 'toast-container';
  document.body.appendChild(toast);

  let toastTimer;

  feedbackTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = btn.getAttribute('data-toast-msg') || '티스토리 스킨 연결 단계에서 활성화됩니다.';
      toast.textContent = msg;
      toast.classList.add('show');
      
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    });
  });
}

function initCategoryFilter() {
  const chips = document.querySelectorAll('.archive-chip');
  const items = document.querySelectorAll('.archive-item');
  if (chips.length === 0 || items.length === 0) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const targetCat = chip.getAttribute('data-filter');

      items.forEach(item => {
        if (targetCat === 'all' || item.getAttribute('data-cat') === targetCat) {
          item.style.display = 'flex'; // Reset to flex based on our archive item design
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initTagCloud() {
  const tags = document.querySelectorAll('.tag-item');
  if (tags.length === 0) return;
  // In V3, sizes are statically set through classes .tag-1 to .tag-5.
  // We can leave this hook for future dynamic interactions.
}

