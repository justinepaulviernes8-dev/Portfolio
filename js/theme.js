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
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // currentTheme remembers the theme in JavaScript, so fast double-clicks always alternate correctly
  let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    currentTheme = newTheme;
    localStorage.setItem('theme', newTheme);

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

initTheme();
