/* ==========================================================================
   [V8 Premium] JavaScript Features (Zen Mode & VS Code Blocks)
   ========================================================================== */

/* -------------------------------------------------------------
   1. Zen Mode (몰입형 읽기 모드)
   ------------------------------------------------------------- */
export function initZenMode() {
  // 본문 영역이 있는 포스트 페이지에서만 동작
  const articleContent = document.querySelector('.post-content, .tt-article-content');
  if (!articleContent) return;

  const btn = document.createElement('button');
  btn.className = 'fab-item fab-zen cosmic-pulse';
  btn.title = '집중 읽기 모드 (Zen Mode)';
  btn.setAttribute('aria-label', 'Zen Mode');
  
  // 초기 아이콘 (눈 모양 등)
  btn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;

  btn.addEventListener('click', () => {
    document.body.classList.toggle('zen-mode');
    
    if (document.body.classList.contains('zen-mode')) {
      // 켜졌을 때 (눈 감은 모양)
      btn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      `;
    } else {
      // 꺼졌을 때 (기본 눈)
      btn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `;
    }
  });

  const fabInner = document.querySelector('.fab-inner');
  if (fabInner) {
    // 기존에 제가 넣은 더미 태그가 있으면 삭제 (post.html 대응)
    const existing = fabInner.querySelector('.fab-zen');
    if (existing) existing.remove();
    
    fabInner.prepend(btn);
    // 구분선 추가
    const divider = document.createElement('div');
    divider.className = 'fab-divider';
    btn.after(divider);
  } else {
    btn.className = 'zen-mode-toggle';
    document.body.appendChild(btn);
  }
}

/* -------------------------------------------------------------
   2. VS Code Style Professional Code Blocks
   ------------------------------------------------------------- */
export function initProfessionalCodeBlocks() {
  const preElements = document.querySelectorAll('pre');
  
  preElements.forEach((pre, index) => {
    // 이미 감싸져 있거나 티스토리 구형 블록인 경우 건너뛰기
    if (pre.parentNode.classList.contains('vscode-block')) return;

    // 언어명 추출 (code 태그의 class 활용)
    let langName = 'TEXT';
    const codeEl = pre.querySelector('code');
    const classSource = codeEl ? codeEl.className : pre.className;
    
    const langMatch = classSource.match(/lang(?:uage)?-([\w-]+)/i);
    if (langMatch && langMatch[1]) {
      langName = langMatch[1];
    }

    // 래퍼(Wrapper) 생성
    const wrapper = document.createElement('div');
    wrapper.className = 'vscode-block';
    
    // 헤더(Header) 생성
    const header = document.createElement('div');
    header.className = 'vscode-header';
    
    // 1. Mac Dots (🔴 🟡 🟢)
    const macDots = document.createElement('div');
    macDots.className = 'vscode-mac-dots';
    macDots.innerHTML = '<span></span><span></span><span></span>';
    
    // 2. Language Label
    const langLabel = document.createElement('div');
    langLabel.className = 'vscode-lang';
    langLabel.innerText = langName;
    
    // 3. Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'vscode-copy-btn';
    copyBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      Copy
    `;
    
    copyBtn.addEventListener('click', () => {
      const textToCopy = codeEl ? codeEl.innerText : pre.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = originalHtml;
        }, 2000);
      });
    });

    header.appendChild(macDots);
    header.appendChild(langLabel);
    header.appendChild(copyBtn);
    
    // DOM 구조 변경: pre를 wrapper로 감싸기
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
  });
}
