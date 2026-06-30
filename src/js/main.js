import { initNatureCountUp, init3DTiltCards, initHeroParticles } from './dashboard.js';
import { initZenMode, initProfessionalCodeBlocks } from './v8.js';
import { removePreloader, initSearchToggle, initThemeToggle, initFAB, initScrollReveal, initSPATransitions } from './features/ui.js';
import { initWeatherTheme, initGlobalMeteors, initStarsParallax, initTerminalTyping, initDecryptAnimation, initWarpDrive } from './features/effects.js';
import { initSidebarToggle, parseAndBuildSidebarCategories } from './features/sidebar.js';
import { beautifyMegaMenu, initPopularCategories } from './features/menu.js';
import { initDualTOC, initMacCodeBlocks, initReadingProgress, initReadingTime, initSeriesNav, lazyLoadImages, initScrollProgressAndHeader } from './features/post.js';
import { initSpotlightCards, initMagneticButtons } from './features/interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  const asciiArt = [
    "  _   _                  ____             _             ",
    " | | | | ___  _ __   ___|  _ \\  _____   _| | ___   __ _ ",
    " | |_| |/ _ \\| '_ \\ / _ \\ | | |/ _ \\ \\ / / |/ _ \\ / _` |",
    " |  _  | (_) | |_) |  __/ |_| |  __/\\ V /| | (_) | (_| |",
    " |_| |_|\\___/| .__/ \\___|____/ \\___| \\_/ |_|\\___/ \\__, |",
    "             |_|                                  |___/ "
  ].join('\n');
  console.log("%c" + asciiArt, "color: #00f0ff; text-shadow: 0 0 10px rgba(0,240,255,0.5); font-weight: bold; font-family: 'Fira Code', monospace;");
  console.log("%cWelcome to Hope Devlog. Architecting Systems, Engineering the Future.", "color: #a9b1d6; font-size: 14px; font-weight: bold;");
  console.log("%cGitHub: https://github.com/won-hope", "color: #ff0033; font-size: 14px; text-decoration: underline;");

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
  initScrollProgressAndHeader();

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
  initSpotlightCards();
  initMagneticButtons();
});