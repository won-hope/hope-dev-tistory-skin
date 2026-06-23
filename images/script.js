/**
 * HOPEDEV Editorial Cubism Skin Script
 * Vanilla JS implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSearchToggle();
  if (window.SkinOptions && window.SkinOptions.useAnimation) {
    initTypingAnimation();
  }
  if (window.SkinOptions && window.SkinOptions.useWeather) {
    initWeatherTheme();
  }
});

/* --------------------------------------------------------------------------
   Theme Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  const sunIcon = btn.querySelector('.icon-sun');
  const moonIcon = btn.querySelector('.icon-moon');
  const html = document.documentElement;

  const updateIcon = (theme) => {
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  };

  // Initial icon
  const currentTheme = html.getAttribute('data-theme') || 'light';
  updateIcon(currentTheme);

  btn.addEventListener('click', () => {
    let current = html.getAttribute('data-theme');
    let next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });
}

/* --------------------------------------------------------------------------
   Search Toggle
   -------------------------------------------------------------------------- */
function initSearchToggle() {
  const toggleBtn = document.querySelector('.search-toggle');
  const overlay = document.getElementById('searchOverlay');
  const closeBtn = document.querySelector('.search-close');

  if (!toggleBtn || !overlay) return;

  toggleBtn.addEventListener('click', () => {
    overlay.style.display = 'flex';
    const input = overlay.querySelector('input');
    if(input) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });
}

/* --------------------------------------------------------------------------
   Typing Animation
   -------------------------------------------------------------------------- */
function initTypingAnimation() {
  const target = document.getElementById('heroTypingText');
  if (!target || !window.SkinOptions.heroKeywords) return;

  // Split by comma and trim
  const keywords = window.SkinOptions.heroKeywords.split(',').map(s => s.trim()).filter(Boolean);
  if (keywords.length === 0) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.textContent = keywords[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentWord = keywords[wordIndex];
    
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % keywords.length;
      typeSpeed = 500; // Pause before typing next
    }

    setTimeout(type, typeSpeed);
  }

  // Start
  setTimeout(type, 1000);
}

/* --------------------------------------------------------------------------
   Weather API (Seoul) - Open-Meteo
   -------------------------------------------------------------------------- */
async function initWeatherTheme() {
  const CACHE_KEY = 'hopedev_weather_cache';
  const CACHE_MINS = 30;
  
  // Seoul Coordinates
  const lat = 37.5665;
  const lon = 126.9780;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover&timezone=Asia%2FSeoul`;

  let weatherData = null;

  // Check cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const now = new Date().getTime();
      if (now - parsed.timestamp < CACHE_MINS * 60 * 1000) {
        weatherData = parsed.data;
      }
    }
  } catch(e) {}

  if (!weatherData) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Error');
      const json = await res.json();
      weatherData = json.current;
      
      // Save cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: new Date().getTime(),
        data: weatherData
      }));
    } catch(err) {
      console.warn('Weather fetch failed. Using fallback.');
      document.documentElement.setAttribute('data-weather', 'none');
      return;
    }
  }

  applyWeatherTheme(weatherData);
}

function applyWeatherTheme(current) {
  const code = current.weather_code;
  const isDay = current.is_day === 1;
  const temp = Math.round(current.temperature_2m);
  const snow = current.snowfall > 0;
  const rain = current.precipitation > 0 || current.rain > 0 || current.showers > 0;
  
  let weatherState = 'sunny';
  let weatherKo = '맑음';

  // Logic prioritizing snow/rain
  if (snow) {
    weatherState = 'snowy';
    weatherKo = '눈';
  } else if (rain) {
    weatherState = 'rainy';
    weatherKo = '비';
  } else {
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog
    if ([0, 1].includes(code)) {
      weatherState = 'sunny';
      weatherKo = '맑음';
    } else if ([2, 3, 45, 48].includes(code)) {
      weatherState = 'cloudy';
      weatherKo = '흐림';
    } else {
      // Fallback for missing unmapped codes
      weatherState = 'cloudy';
      weatherKo = '흐림';
    }
  }

  // Night modifier
  if (!isDay) {
    weatherState = 'night';
  }

  // Set Theme if auto is true or unset
  if (window.SkinOptions.autoWeatherTheme) {
    document.documentElement.setAttribute('data-weather', weatherState);
  }

  // Set Badge
  if (window.SkinOptions.showWeatherBadge) {
    const badge = document.getElementById('weatherBadge');
    if (badge) {
      badge.style.display = 'flex';
      badge.querySelector('.weather-text').textContent = `서울 · ${weatherKo} · ${temp}°C`;
    }
  }
}
