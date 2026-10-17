// =========================================================
// Extra: Back-to-top button (appears after scrolling down)
// Uses in index.html: #back-to-top
// =========================================================

function initBackToTop() {
  const backToTop = document.querySelector('#back-to-top');

  if (!backToTop) {
    console.error('back-to-top.js: #back-to-top is missing in index.html.');
    return;
  }

  function updateButton() {
    const show = window.scrollY > 500;
    backToTop.classList.toggle('opacity-0', !show);
    backToTop.classList.toggle('pointer-events-none', !show);
    // Hide it from keyboard users while it is invisible
    backToTop.tabIndex = show ? 0 : -1;
  }

  window.addEventListener('scroll', updateButton);
  updateButton();
}

initBackToTop();
