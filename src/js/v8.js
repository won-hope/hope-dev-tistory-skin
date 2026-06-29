/* ==========================================================================
   [V8 Premium] JavaScript Features (Zen Mode & VS Code Blocks)
   ========================================================================== */

/* -------------------------------------------------------------
   1. Zen Mode (몰입형 읽기 모드)
   ------------------------------------------------------------- */
export function initZenMode() {
  // 본문 영역이 있는 포스트 페이지에서만 동작
  const articleContent = document.querySelector('.tt-article-content, .article-content, #article-content');
  if (!articleContent) return;

  const btn = document.createElement('button');
  btn.className = 'zen-mode-toggle';
  btn.title = '집중 읽기 모드 (Zen Mode)';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  `;

  btn.addEventListener('click', () => {
    document.body.classList.toggle('zen-mode');
    
    // 버튼 아이콘 변경 (켜짐/꺼짐 상태)
    if (document.body.classList.contains('zen-mode')) {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      `;
    }
  });

  document.body.appendChild(btn);
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
