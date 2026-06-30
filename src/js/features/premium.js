export function initV11Features() {
  const isHome = document.body.id === 'tt-body-index';
  const isCategory = document.body.id === 'tt-body-category';
  const isPost = document.body.id === 'tt-body-page';

  // 1-B. Dashboard Carousel
  if (isHome) {
    const grid = document.querySelector('.magazine-grid');
    if (grid) {
      grid.classList.remove('magazine-grid');
      grid.classList.add('carousel-track');
      
      const wrapper = document.createElement('div');
      wrapper.className = 'carousel-wrapper';
      grid.parentNode.insertBefore(wrapper, grid);
      wrapper.appendChild(grid);

      const cards = grid.querySelectorAll('.inpa-card');
      cards.forEach(card => card.classList.add('carousel-slide'));
    }
  }

  // 2-B. Category View Toggle
  if (isCategory) {
    const header = document.querySelector('.arch-section-header.list-only-title');
    const grid = document.querySelector('.magazine-grid');
    if (header && grid) {
      header.classList.add('with-toggle');
      
      const toggleHtml = `
        <div class="view-mode-toggle">
          <button class="view-btn active" data-view="grid" aria-label="Grid View">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </button>
          <button class="view-btn" data-view="list" aria-label="List View">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
        </div>
      `;
      header.insertAdjacentHTML('beforeend', toggleHtml);

      const btns = header.querySelectorAll('.view-btn');
      const savedView = localStorage.getItem('categoryViewMode') || 'grid';
      
      const setView = (mode) => {
        btns.forEach(b => b.classList.remove('active'));
        header.querySelector(`[data-view="${mode}"]`).classList.add('active');
        if (mode === 'list') {
          grid.classList.add('list-view');
        } else {
          grid.classList.remove('list-view');
        }
        localStorage.setItem('categoryViewMode', mode);
      };

      setView(savedView);

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          setView(btn.getAttribute('data-view'));
        });
      });
    }
  }

  // 3-A. Post Action Row (Moved to skin.html directly, logic handled there if needed)
}
