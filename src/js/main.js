import { initNatureCountUp, init3DTiltCards, initHeroParticles } from './dashboard.js';
import { initZenMode, initProfessionalCodeBlocks } from './v8.js';

import { removePreloader, initSearchToggle, initThemeToggle, initFAB, initScrollReveal } from './features/ui.js';
import { initWeatherTheme, initGlobalMeteors, initStarsParallax, initTerminalTyping, initDecryptAnimation, initWarpDrive } from './features/effects.js';
import { initSidebarToggle, parseAndBuildSidebarCategories } from './features/sidebar.js';
import { beautifyMegaMenu, initPopularCategories } from './features/menu.js';
import { initDualTOC, initMacCodeBlocks, initReadingProgress, initReadingTime, initSeriesNav, lazyLoadImages } from './features/post.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. UI & Setup
  removePreloader();
  initThemeToggle();
  initSearchToggle();
  initSidebarToggle();
  parseAndBuildSidebarCategories();
  initFAB();
  initScrollReveal();

  // 2. Menu & Categories
  beautifyMegaMenu();
  initPopularCategories();

  // 3. Post Features
  lazyLoadImages(); // 보안 및 성능 리팩토링 추가
  initDualTOC();
  initMacCodeBlocks();
  initReadingProgress();
  initReadingTime();
  initSeriesNav();

  // 4. Premium Effects
  initGlobalMeteors();
  initStarsParallax();
  initTerminalTyping();
  initWarpDrive();
  if (window.SkinOptions) {
    if (window.SkinOptions.useAnimation) initDecryptAnimation();
    if (window.SkinOptions.useWeather) initWeatherTheme();
  }

  // 5. Dashboard & Legacy V8 modules
  initNatureCountUp();
  init3DTiltCards();
  initHeroParticles();
  initZenMode();
  initProfessionalCodeBlocks();
});