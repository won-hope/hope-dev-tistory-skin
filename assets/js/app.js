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
