export function initSpotlightCards() {
  const cards = document.querySelectorAll('.bento-card, .inpa-card, .nature-stat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // CSS Custom Properties for radial-gradient center
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

export function initMagneticButtons() {
  const magneticItems = document.querySelectorAll('.fab-item, .fab-pill-btn, #tocToggleBtn, #tocCloseBtn');

  magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      // Calculate center of the button
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from cursor to center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Dampen the movement (reduce value to make it subtle)
      const magneticPullX = distanceX * 0.3;
      const magneticPullY = distanceY * 0.3;
      
      item.style.transform = `translate(${magneticPullX}px, ${magneticPullY}px)`;
      item.style.transition = 'transform 0.1s ease-out';
    });

    item.addEventListener('mouseleave', () => {
      // Reset position with a bouncy transition
      item.style.transform = 'translate(0px, 0px)';
      item.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });
}
