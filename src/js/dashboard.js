// --- Throttling Utility ---
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

/* -------------------------------------------------------------
   [Premium] Nature CountUp Animation
   ------------------------------------------------------------- */
export function initNatureCountUp() {
  const startDate = window.SkinOptions?.blogStartDate || "2024-01-01";
  const startMs = new Date(startDate).getTime();
  const diffDays = Math.floor((new Date().getTime() - startMs) / (1000 * 60 * 60 * 24));
  
  const uptimeEl = document.getElementById('mainBlogAge');
  if (uptimeEl) {
    uptimeEl.setAttribute('data-target', diffDays);
  }

  const postsEl = document.getElementById('mainTotalPosts');
  if (postsEl) {
    let postsCount = 0;
    const allPostsLink = document.querySelector('.header-nav .tt_category > li > a.link_tit');
    if (allPostsLink) {
      const match = allPostsLink.textContent.match(/\((\d+)\)/);
      if (match) {
        postsCount = parseInt(match[1], 10);
      }
    }
    if (postsCount === 0) {
      postsCount = document.querySelectorAll('.bento-card').length || 10;
    }
    postsEl.setAttribute('data-target', postsCount);
  }

  const counters = document.querySelectorAll('.counter-num');
  if(counters.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const el = entry.target;
        const rawVal = el.getAttribute('data-target') || el.getAttribute('data-raw') || el.innerText;
        const target = parseInt(String(rawVal).replace(/,/g, '') || '0', 10);
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
export function init3DTiltCards() {
  const cards = document.querySelectorAll('.inpa-card.bento-card');
  cards.forEach(card => {
    // 기존 glare 중복 방지
    let glare = card.querySelector('.glare-overlay');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'glare-overlay';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      // requestAnimationFrame을 활용해 부드럽게 (throttle 대신)
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // 회전 각도를 좀 더 다이내믹하게 (최대 15도)
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;
        
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        
        // 애플 TV 스타일의 다중 그라데이션 홀로그램 빚 반사
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
        glare.style.background = `
          linear-gradient(${angle}deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 40%, transparent 50%),
          radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, transparent 60%)
        `;
      });
    });

    card.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)`;
      });
    });
  });
}

/* -------------------------------------------------------------
   [Premium] Interactive Hero Particles
   ------------------------------------------------------------- */
export function initHeroParticles() {
  const heroOverlay = document.querySelector('.hero-overlay');
  if (!heroOverlay) return;

  // 모바일 기기이거나 시스템 애니메이션 감소 설정이 켜져있으면 파티클 렌더링 생략 (성능 최적화)
  if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

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

  function initVantaHero() {
    const heroSection = document.querySelector('.hero-bg-image');
    if (!heroSection) return;

    if (window.VANTA && window.VANTA.NET) {
      window.vantaHeroEffect = window.VANTA.NET({
        el: heroSection,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.50,          // 전체 크기를 1.5배로 키워 웅장함 극대화
        scaleMobile: 1.00,
        color: 0x00f0ff,      // 사이버 펑크 시안(Cyan) 빛
        backgroundColor: 0x07070a, // 깊고 다크한 우주 톤
        points: 12.00,        // 노드 수 최적화
        maxDistance: 25.00,   // 연결선 길이 증가
        spacing: 25.00,       // 네트 간격을 넓혀 시원한 느낌 부여
        showDots: true        // 점 강조
      });
      // 기존 캔버스 덮어쓰기 방지
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  // 초기 로드 시 Vanta 실행, 없으면 스킵
  setTimeout(initVantaHero, 100);
}