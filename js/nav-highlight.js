// =========================================================
// Feature 4: Active nav highlight while scrolling
// Uses in index.html: links with data-nav, and <section id="..."> inside <main>
// The highlight style comes from the aria-[current=page]: classes on each link
// =========================================================

function initNavHighlight() {
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main section[id]');

  if (navLinks.length === 0 || sections.length === 0) {
    console.error('nav-highlight.js: no [data-nav] links or <section id> elements found.');
    return;
  }

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Watch which section is in the middle of the screen
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

initNavHighlight();
