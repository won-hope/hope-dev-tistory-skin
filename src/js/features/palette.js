export function initCommandPalette() {
  const paletteHTML = `
    <div id="commandPalette" class="palette-overlay" aria-hidden="true">
      <div class="palette-modal">
        <div class="palette-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="paletteSearch" placeholder="명령어를 입력하거나 검색어를 입력하세요..." autocomplete="off">
          <div class="palette-badges">
            <kbd>ESC</kbd>
          </div>
        </div>
        <div class="palette-body">
          <div class="palette-section-title">Quick Actions</div>
          <ul class="palette-list" id="paletteActions">
            <li class="palette-item" data-action="theme">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              <span>테마 변경 (Dark / Light)</span>
            </li>
            <li class="palette-item" data-action="zen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>집중 읽기 모드 (Zen Mode) 전환</span>
            </li>
            <li class="palette-item" data-action="home">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span>메인 홈으로 이동</span>
            </li>
            <li class="palette-item" data-action="search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
              <span>전체화면 검색 열기</span>
            </li>
          </ul>
        </div>
        <div class="palette-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> 내비게이션</span>
          <span><kbd>Enter</kbd> 선택</span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', paletteHTML);

  const palette = document.getElementById('commandPalette');
  const input = document.getElementById('paletteSearch');
  const items = document.querySelectorAll('.palette-item');
  let selectedIndex = 0;
  let isOpen = false;

  function updateSelection() {
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  function executeAction(action) {
    closePalette();
    setTimeout(() => {
      switch (action) {
        case 'theme':
          const themeBtn = document.getElementById('themeToggleBtn');
          if (themeBtn) themeBtn.click();
          break;
        case 'zen':
          const zenBtn = document.querySelector('.fab-zen');
          if (zenBtn) zenBtn.click();
          else document.body.classList.toggle('zen-mode');
          break;
        case 'home':
          // 로컬 테스트를 위해 preview.html로 이동 지원
          window.location.href = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '/preview.html' : '/';
          break;
        case 'search':
          const searchBtn = document.querySelector('.search-toggle');
          if (searchBtn) searchBtn.click();
          break;
      }
    }, 100);
  }

  function openPalette() {
    isOpen = true;
    palette.classList.add('active');
    palette.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    selectedIndex = 0;
    updateSelection();
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    isOpen = false;
    palette.classList.remove('active');
    palette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    input.value = '';
  }

  // Event Listeners
  document.addEventListener('keydown', (e) => {
    // Cmd + K or Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen) closePalette();
      else openPalette();
    }

    if (!isOpen) return;

    if (e.key === 'Escape') {
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const action = items[selectedIndex].getAttribute('data-action');
      executeAction(action);
    }
  });

  palette.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });

  items.forEach((item, idx) => {
    item.addEventListener('mouseenter', () => {
      selectedIndex = idx;
      updateSelection();
    });
    item.addEventListener('click', () => {
      executeAction(item.getAttribute('data-action'));
    });
  });
}
