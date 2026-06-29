export function initWeatherTheme() {
  const lat = 37.5665; const lon = 126.9780;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,precipitation,rain,showers,snowfall,weather_code&timezone=Asia%2FSeoul`;

  fetch(url).then(res => res.json()).then(json => {
    const current = json.current;
    let weatherState = 'sunny'; let weatherKo = '맑음'; let icon = '☀️';
    if (current.snowfall > 0) { weatherState = 'snowy'; weatherKo = '눈'; icon = '❄️'; }
    else if (current.precipitation > 0) { weatherState = 'rainy'; weatherKo = '비'; icon = '☔'; }
    else if ([0, 1].includes(current.weather_code)) { weatherState = 'sunny'; weatherKo = '맑음'; icon = '☀️'; }
    else { weatherState = 'cloudy'; weatherKo = '흐림'; icon = '☁️'; }

    if (current.is_day === 0) weatherState = 'night';
    if (window.SkinOptions && window.SkinOptions.autoWeatherTheme) {
      document.documentElement.setAttribute('data-weather', weatherState);
    }

    const badge = document.getElementById('weatherBadge');
    if (badge) {
      badge.style.display = 'flex';
      const iconSpan = badge.querySelector('.weather-icon');
      const textSpan = badge.querySelector('.weather-text');
      if (iconSpan) iconSpan.textContent = icon;
      if (textSpan) textSpan.textContent = `서울 · ${weatherKo} · ${Math.round(current.temperature_2m)}°C`;
    }
  }).catch(err => {
    document.documentElement.setAttribute('data-weather', 'none');
  });
}

export function initGlobalMeteors() {
  const meteorContainer = document.createElement('div');
  meteorContainer.className = 'global-meteor-shower';
  document.body.appendChild(meteorContainer);

  for (let i = 0; i < 12; i++) {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    meteor.style.left = `${Math.random() * 100}%`;
    meteor.style.top = `${Math.random() * 50}%`;
    meteor.style.animationDelay = `${Math.random() * 10}s`;
    meteorContainer.appendChild(meteor);
  }
}

export function initStarsParallax() {
  const starsLayers = document.querySelectorAll('.stars-layer');
  if (starsLayers.length === 0) return;
  
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 60;
    const y = (e.clientY / window.innerHeight - 0.5) * 60;
    
    starsLayers.forEach((layer, index) => {
      const factor = (index + 1) * 0.5; 
      layer.style.marginLeft = `${-x * factor}px`;
      layer.style.marginTop = `${-y * factor}px`;
    });
  });
}

export function initTerminalTyping() {
  const textTarget = document.getElementById('terminalTypingText');
  if (!textTarget) return;
  const text = "본질을 꿰뚫는 문제 해결과 견고한 시스템 설계를 통해,\n세상에 지속 가능한 가치를 더하는 소프트웨어를 만듭니다.";
  let i = 0;
  textTarget.textContent = ''; 
  function typeWriter() {
    if (i < text.length) {
      if (text.charAt(i) === '\n') {
        textTarget.insertAdjacentHTML('beforeend', '<br>');
      } else {
        // textContent 대신 insertAdjacentHTML 혹은 textNode 추가 방식 사용
        textTarget.insertAdjacentText('beforeend', text.charAt(i));
      }
      i++;
      setTimeout(typeWriter, Math.random() * 50 + 30); 
    }
  }
  setTimeout(typeWriter, 1500); 
}

export function initDecryptAnimation() {
  const el = document.getElementById('decryptText');
  if (!el) return;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const rawKeywords = window.SkinOptions?.heroKeywords;
  const targetWords = rawKeywords ? rawKeywords.split(',') : ['Intelligence', 'Agents', 'Future', 'Excellence'];
  
  let kIdx = 0;
  
  function decryptWord(word) {
    let iteration = 0;
    let interval = null;
    
    clearInterval(interval);
    
    interval = setInterval(() => {
      el.innerText = word
        .split('')
        .map((letter, index) => {
          if(index < iteration) {
            return word[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if(iteration >= word.length){ 
        clearInterval(interval);
        setTimeout(() => {
          kIdx = (kIdx + 1) % targetWords.length;
          decryptWord(targetWords[kIdx].trim());
        }, 3000);
      }
      iteration += 1 / 3;
    }, 30);
  }

  setTimeout(() => {
    decryptWord(targetWords[kIdx].trim());
  }, 1000);
}

export function initWarpDrive() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (!target) return;
    if (target.target === '_blank' || target.hasAttribute('download')) return;
    
    const href = target.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;

    const isInternal = target.host === window.location.host || !target.host;
    if (!isInternal) return;

    e.preventDefault();
    
    const engine = document.createElement('div');
    engine.id = 'warpEngine';
    
    for (let i = 0; i < 150; i++) {
      const line = document.createElement('div');
      line.className = 'warp-line';
      const angle = Math.random() * 360;
      const startDist = Math.random() * 100 + 20;
      line.style.setProperty('--angle', `${angle}deg`);
      line.style.setProperty('--start-dist', `${startDist}px`);
      line.style.animationDelay = `${Math.random() * 0.15}s`;
      engine.appendChild(line);
    }
    
    const flash = document.createElement('div');
    flash.id = 'warpFlash';

    document.body.appendChild(engine);
    document.body.appendChild(flash);
    document.body.classList.add('warp-active');

    setTimeout(() => {
      window.location.href = target.href;
    }, 700);
  });
}
