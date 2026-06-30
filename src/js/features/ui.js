export function removePreloader() {
  const preloader = document.getElementById('hopePreloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 500);
  }
}

export function initSearchToggle() {
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

export function initThemeToggle() {
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

export function initFAB() {
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

export function initScrollReveal() {
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
   [V9 Premium] Pseudo-SPA Transitions
   ------------------------------------------------------------- */
export function initSPATransitions() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    const isInternal = link.hostname === window.location.hostname;
    const isBlank = link.target === '_blank';

    if (isInternal && !isBlank) {
      e.preventDefault();
      
      // 최신 View Transitions API 지원 브라우저 (자연스럽고 부드러운 전환)
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          window.location.href = href;
        });
      } else {
        // 미지원 브라우저의 경우 딜레이 없이 즉각 이동 (답답함 해소)
        window.location.href = href;
      }
    }
  });
}
