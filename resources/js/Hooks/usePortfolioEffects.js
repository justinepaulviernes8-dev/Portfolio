import { useEffect } from 'react';

// Original portfolio interactions, disposed when Inertia leaves this page.
export default function usePortfolioEffects() {
    useEffect(() => {
        const cleanups = [];
        function listen(target, event, handler, options) {
            target.addEventListener(event, handler, options);
            cleanups.push(() => target.removeEventListener(event, handler, options));
        }
        function observe(callback, options) {
            const observer = new IntersectionObserver(callback, options);
            cleanups.push(() => observer.disconnect());
            return observer;
        }
// =========================================================
// Feature 2: Dark / light mode toggle (saved in localStorage)
// Uses in index.html: #theme-toggle, and the "dark" class on <html>
// Dark styles come from the dark: classes (see @custom-variant in <head>)
// =========================================================

function initTheme() {
  const htmlElement = document.documentElement; // the <html> element
  const themeToggle = document.querySelector('#theme-toggle');

  if (!themeToggle) {
    console.error('theme.js: #theme-toggle is missing in index.html.');
    return;
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    htmlElement.classList.toggle('dark', isDark);
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Use the saved choice; if there is none, follow the device setting
  let savedTheme;
  try { savedTheme = localStorage.getItem('theme'); } catch (_) {}
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // currentTheme remembers the theme in JavaScript, so fast double-clicks always alternate correctly
  let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  listen(themeToggle, 'click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    currentTheme = newTheme;
    try { localStorage.setItem('theme', newTheme); } catch (_) {}

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Older browsers (no View Transitions), "reduce motion", or a hidden tab: switch instantly
    if (!document.startViewTransition || reduceMotion || document.visibilityState !== 'visible') {
      applyTheme(newTheme);
      return;
    }

    // ---- Circle "shockwave" effect ----
    // 1. Find the center of the button (where the circle starts)
    const rect = themeToggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // 2. Radius big enough to reach the farthest corner of the screen
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const duration = 800;
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
    let ring = null;

    // 3. The browser takes a picture of the old page, then we switch the theme
    //    and add the glowing ring (so the ring is only part of the NEW page)
    const transition = document.startViewTransition(() => {
      applyTheme(newTheme);
      ring = document.createElement('div');
      ring.className = 'theme-shockwave';
      ring.style.left = `${x - radius}px`;
      ring.style.top = `${y - radius}px`;
      ring.style.width = `${radius * 2}px`;
      ring.style.height = `${radius * 2}px`;
      ring.style.transform = 'scale(0)';
      document.body.appendChild(ring);
    });

    // 4. The new theme grows out of the button as a circle,
    //    and the ring grows at the same speed so it glows along the circle's edge
    transition.ready.then(() => {
      htmlElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration, easing, pseudoElement: '::view-transition-new(root)' }
      );
      ring.animate(
        { transform: ['scale(0)', 'scale(1)'], opacity: [1, 1, 0] },
        { duration, easing, fill: 'forwards' }
      );
    }).catch(() => {
      // The browser skipped the effect (e.g. the tab was hidden).
      // The theme has still changed, so there is nothing else to do.
    });

    // 5. Clean up: remove the ring when the effect is done
    transition.finished.finally(() => {
      if (ring) ring.remove();
    });
  });
}

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

  listen(menuButton, 'click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
  });

  // Close the menu after choosing a link
  mobileMenu.querySelectorAll('a').forEach((link) => {
    listen(link, 'click', () => setMenu(false));
  });

  // Close the menu with the Escape key
  listen(document, 'keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
}

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
  const sectionObserver = observe((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

// =========================================================
// Feature 3: Contact form validation + success message
// Front-end only: nothing is sent anywhere.
// Uses in index.html: #contact-form, #form-success,
//                     #name, #email, #message and their #...-error texts
// =========================================================

function initFormValidation() {
  const form = document.querySelector('#contact-form');
  const successMessage = document.querySelector('#form-success');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form || !successMessage) {
    console.error('form-validation.js: #contact-form or #form-success is missing in index.html.');
    return;
  }

  // Show or clear the error under one field.
  // textContent is used instead of innerHTML so typed text is never run as HTML.
  function setError(field, message) {
    const errorText = document.querySelector(`#${field.id}-error`);
    errorText.textContent = message;
    errorText.classList.toggle('hidden', message === '');
    if (message) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  }

  // Returns an error message, or '' when the field is valid
  function validateField(field) {
    const value = field.value.trim();

    if (field.id === 'name') {
      if (value === '') return 'Please enter your name.';
      if (value.length < 2) return 'Your name should have at least 2 characters.';
      if (!/^(?=.*\p{L})[\p{L}\p{M} .'\u2019-]+$/u.test(value)) {
        return 'Please enter a valid name using letters, spaces, apostrophes, hyphens or periods. Numbers are not allowed.';
      }
    }
    if (field.id === 'email') {
      if (value === '') return 'Please enter your email address.';
      if (!emailPattern.test(value)) return 'Please enter a valid email address.';
    }
    if (field.id === 'message') {
      if (value === '') return 'Please write a message.';
      if (value.length < 10) return 'Your message should have at least 10 characters.';
    }
    return '';
  }

  listen(form, 'submit', (event) => {
    event.preventDefault();
    successMessage.classList.add('hidden');

    const fields = [form.elements.name, form.elements.email, form.elements.message];
    let firstInvalid = null;

    fields.forEach((field) => {
      const message = validateField(field);
      setError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const name = form.elements.name.value.trim();
    successMessage.textContent = `Thanks, ${name}! Your message passed validation. This demo does not send email.`;
    successMessage.classList.remove('hidden');
    form.reset();
  });

  // Clear a field's error as soon as the user fixes it
  form.querySelectorAll('input, textarea').forEach((field) => {
    listen(field, 'input', () => {
      if (field.hasAttribute('aria-invalid')) setError(field, validateField(field));
    });
  });
}

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

  listen(window, 'scroll', updateButton);
  updateButton();
}

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

  listen(window, 'scroll', () => {
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
  listen(header, 'focusin', () => showHeader(true));
}

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
  const revealObserver = observe((entries) => {
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

initTheme();
initMenu();
initNavHighlight();
initFormValidation();
initBackToTop();
initHideNav();
initScrollReveal();
        return () => {
            cleanups.forEach((cleanup) => cleanup());
            document.documentElement.classList.remove('reveal-ready', 'overflow-hidden');
        };
    }, []);
}
