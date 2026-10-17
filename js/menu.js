// =========================================================
// Feature 1: Mobile menu toggle
// Uses in index.html: #menu-button, #mobile-menu
// The animations are Tailwind classes in index.html:
//   - the X shape reacts to aria-expanded on the button (group-aria-expanded:)
//   - the slide-down reacts to data-open on the menu (data-[open=true]:)
// =========================================================

function initMenu() {
  const menuButton = document.querySelector('#menu-button');
  const mobileMenu = document.querySelector('#mobile-menu');

  if (!menuButton || !mobileMenu) {
    console.error('menu.js: a menu element is missing. Check the ids in index.html.');
    return;
  }

  function setMenu(isOpen) {
    mobileMenu.dataset.open = String(isOpen); // starts the slide-down / slide-up
    mobileMenu.inert = !isOpen;                // closed menu can't be reached with Tab
    menuButton.setAttribute('aria-expanded', String(isOpen)); // turns the bars into an X
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
  });

  // Close the menu after choosing a link
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Close the menu with the Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
}

initMenu();
