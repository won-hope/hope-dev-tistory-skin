export function initDualTOC() {
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
  // Safe HTML structure
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
      const numSpan = document.createElement('span');
      numSpan.className = 'toc-num';
      numSpan.textContent = h2Counter + '. ';
      const textNode = document.createTextNode(heading.textContent);
      inLink.appendChild(numSpan);
      inLink.appendChild(textNode);
    } else {
      inLink.textContent = heading.textContent;
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

export function initMacCodeBlocks() {
  const codeBlocks = document.querySelectorAll('.post-content pre');
  codeBlocks.forEach(pre => {
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
    
    let codeEl = pre.querySelector('code');
    if (codeEl) {
      let lines = codeEl.innerHTML.split('\n');
      if (lines[lines.length-1] === '') lines.pop();
      // Code blocks often have HTML entities, safe to use innerHTML for highlighted lines
      codeEl.innerHTML = lines.map(line => `<span class="line">${line}</span>`).join('\n');
    }

    const copyBtn = document.createElement('button');
    copyBtn.className = 'mac-code-copy-btn';
    const copyIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
    const copiedIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
    copyBtn.innerHTML = copyIcon;

    copyBtn.addEventListener('click', () => {
      const codeText = pre.innerText || pre.textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        copyBtn.innerHTML = copiedIcon;
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = copyIcon;
          copyBtn.classList.remove('copied');
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

export function initReadingProgress() {
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

  const update = () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
  };
  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  update();
}

export function initReadingTime() {
  const content = document.querySelector('.post-content');
  const metaContainer = document.querySelector('.inpa-post-meta');
  if (!content) return;

  const textLength = content.innerText.replace(/\s/g, '').length;
  const wpm = 300; 
  let time = Math.ceil(textLength / wpm);
  if (time < 1) time = 1;

  if (metaContainer) {
    const timeBadge = document.createElement('span');
    timeBadge.className = 'meta-item reading-time';
    timeBadge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ☕ ${time}분 소요`;
    metaContainer.appendChild(timeBadge);
  }

  const titleArea = document.querySelector('.post-title');
  if (titleArea) {
    const estBadge = document.createElement('div');
    estBadge.className = 'est-reading-time cyber-desc';
    estBadge.innerHTML = `<span class="cyber-blink">_</span> [ SCANNING... EST. TIME: ${time} MINS ]`;
    estBadge.style.marginTop = '1rem';
    estBadge.style.color = '#00f0ff';
    estBadge.style.fontFamily = 'var(--font-mono)';
    estBadge.style.fontSize = '0.85rem';
    titleArea.parentElement.insertBefore(estBadge, titleArea.nextSibling);
  }
}

export function initSeriesNav() {
  const seriesContainer = document.getElementById('seriesNavContainer');
  const categoryBadge = document.querySelector('.inpa-post-badge');
  const categoryLinkEl = categoryBadge ? categoryBadge.querySelector('a') : null;
  
  if (!seriesContainer || !categoryLinkEl) return;
  
  const categoryUrl = categoryLinkEl.href;
  const categoryName = categoryLinkEl.textContent;
  
  seriesContainer.innerHTML = `<div class="series-header"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> <strong class="series-cat-name"></strong> 시리즈</div><div class="series-list"><div style="text-align:center; padding: 20px;"><div class="star-spinner" style="display:inline-block; width:20px;height:20px;border:2px solid var(--point-color);border-top:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div></div></div>`;
  seriesContainer.querySelector('.series-cat-name').textContent = `'${categoryName}'`;
  
  fetch(categoryUrl)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const articles = Array.from(doc.querySelectorAll('.inpa-card-link')).slice(0, 5);
      
      if (articles.length > 0) {
        const ul = document.createElement('ul');
        articles.forEach(a => {
          const titleEl = a.querySelector('.inpa-card-title') || a;
          const li = document.createElement('li');
          if (a.href === window.location.href) li.className = 'current';
          const link = document.createElement('a');
          link.href = a.href;
          link.textContent = titleEl.textContent;
          li.appendChild(link);
          ul.appendChild(li);
        });
        const listContainer = seriesContainer.querySelector('.series-list');
        listContainer.innerHTML = '';
        listContainer.appendChild(ul);
      } else {
        seriesContainer.style.display = 'none';
      }
    })
    .catch(() => seriesContainer.style.display = 'none');
}

export function lazyLoadImages() {
  const images = document.querySelectorAll('.post-content img:not([loading])');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });
}
