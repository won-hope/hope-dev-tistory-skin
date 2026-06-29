import { initNatureCountUp, init3DTiltCards, initHeroParticles } from './dashboard.js';
import { initZenMode, initProfessionalCodeBlocks } from './v8.js';
import { removePreloader, initSearchToggle, initThemeToggle, initFAB, initScrollReveal, initSPATransitions } from './features/ui.js';
import { initWeatherTheme, initGlobalMeteors, initStarsParallax, initTerminalTyping, initDecryptAnimation, initWarpDrive } from './features/effects.js';
import { initSidebarToggle, parseAndBuildSidebarCategories } from './features/sidebar.js';
import { beautifyMegaMenu, initPopularCategories } from './features/menu.js';
import { initDualTOC, initMacCodeBlocks, initReadingProgress, initReadingTime, initSeriesNav, lazyLoadImages } from './features/post.js';

document.addEventListener('DOMContentLoaded', () => {
  removePreloader();

  initThemeToggle();
  initSearchToggle();
  initSidebarToggle();
  
  initFAB();
  initScrollReveal();
  
  parseAndBuildSidebarCategories();
  beautifyMegaMenu();
  initPopularCategories();

  lazyLoadImages();

  initDualTOC();
  initMacCodeBlocks();
  initReadingProgress();
  initReadingTime();
  initSeriesNav();

  // Effects & Animations
  initGlobalMeteors();
  initStarsParallax();
  initTerminalTyping();
  initWarpDrive();

  if (window.SkinOptions) {
    if (window.SkinOptions.useAnimation) initDecryptAnimation();
    if (window.SkinOptions.useWeather) initWeatherTheme();
  }

  // Dashboard & Components
  initNatureCountUp();
  init3DTiltCards();
  initHeroParticles();
  initZenMode();
  initProfessionalCodeBlocks();
  
  // V9 Premium Features
  initSPATransitions();
});