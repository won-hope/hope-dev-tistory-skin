import './_legacy.js';
import { initNatureCountUp, init3DTiltCards, initHeroParticles } from './dashboard.js';
import { initZenMode, initProfessionalCodeBlocks } from './v8.js';

document.addEventListener('DOMContentLoaded', () => {
  initNatureCountUp();
  init3DTiltCards();
  initHeroParticles();
  initZenMode();
  initProfessionalCodeBlocks();
});