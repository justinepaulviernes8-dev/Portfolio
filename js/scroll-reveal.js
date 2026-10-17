// =========================================================
// Feature: Scroll animation (fade in + slide up when scrolled into view)
// Uses in index.html: any element with the data-reveal attribute
// The animation styles are in the <style> block in <head> (.reveal-ready [data-reveal])
// =========================================================

function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // No animation for people who turned on "reduce motion" — content just shows normally
  if (items.length === 0 || reduceMotion) return;

  // This class turns on the hidden starting state in CSS.
  // It is added by JavaScript, so if JS fails the content is still visible.
  document.documentElement.classList.add('reveal-ready');

  // Small delay for items next to each other (e.g. 3 project cards appear one after another)
  items.forEach((item) => {
    const siblings = [...item.parentElement.children].filter((el) => el.hasAttribute('data-reveal'));
    const position = siblings.indexOf(item);
    item.style.setProperty('--reveal-delay', `${Math.min(position, 3) * 120}ms`);
  });

  // Plays every time: fade in when 15% of the item is on screen,
  // reset (hide instantly) once it has completely left the screen, so it can fade in again
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.15) {
        entry.target.classList.add('is-visible');    // plays the fade-in
      } else if (!entry.isIntersecting) {
        entry.target.classList.remove('is-visible'); // fully off screen: get ready to animate again
      }
    });
  }, { threshold: [0, 0.15], rootMargin: '0px 0px -8% 0px' });

  items.forEach((item) => revealObserver.observe(item));
}

initScrollReveal();
