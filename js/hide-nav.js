// =========================================================
// Extra: Hide the navigation when scrolling down,
//        show it again when scrolling up
// Uses in index.html: #site-header, #menu-button
// The slide animation comes from transition-transform on the header
// =========================================================

function initHideNav() {
  const header = document.querySelector('#site-header');
  const menuButton = document.querySelector('#menu-button');

  if (!header) {
    console.error('hide-nav.js: #site-header is missing in index.html.');
    return;
  }

  let lastScrollY = window.scrollY;

  function showHeader(show) {
    // -translate-y-full moves the header up by its own height (out of view)
    header.classList.toggle('-translate-y-full', !show);
  }

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const nearTop = currentScrollY < 80;
    const menuIsOpen = menuButton && menuButton.getAttribute('aria-expanded') === 'true';

    // Ignore tiny movements so the header doesn't flicker
    if (Math.abs(currentScrollY - lastScrollY) < 8) return;

    if (nearTop || menuIsOpen) {
      showHeader(true);
    } else {
      showHeader(!scrollingDown);
    }

    lastScrollY = currentScrollY;
  });

  // Keyboard users: show the header again when Tab moves focus into it
  header.addEventListener('focusin', () => showHeader(true));
}

initHideNav();
