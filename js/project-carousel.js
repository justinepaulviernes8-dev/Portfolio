// =========================================================
// Feature: 3D project carousel (center card big, side cards smaller and tilted)
// Uses in index.html:
//   - #project-carousel (the stage) with <article data-project> slides inside
//   - #carousel-prev, #carousel-next, #carousel-dots
//   - #carousel-info, #carousel-tag, #carousel-title, #carousel-description, #carousel-tools
// The "View Project" button below the carousel is handled by js/project-modal.js
// (it opens the slide that has the .is-active class)
// =========================================================

function initProjectCarousel() {
  const stage = document.querySelector('#project-carousel');

  if (!stage) {
    console.error('project-carousel.js: #project-carousel is missing in index.html.');
    return;
  }

  const slides = [...stage.querySelectorAll('[data-project]')];
  const prevButton = document.querySelector('#carousel-prev');
  const nextButton = document.querySelector('#carousel-next');
  const dotsBox = document.querySelector('#carousel-dots');
  const info = document.querySelector('#carousel-info');
  const infoTag = document.querySelector('#carousel-tag');
  const infoTitle = document.querySelector('#carousel-title');
  const infoDescription = document.querySelector('#carousel-description');
  const infoTools = document.querySelector('#carousel-tools');
  let active = 0;

  // How each card looks, by its distance from the center card
  //   x = move sideways (% of card width), s = size, r = 3D tilt, o = opacity, b = brightness
  const positions = {
    0: { x: 0, s: 1, r: 0, o: 1, b: 1, z: 5 },
    1: { x: 62, s: 0.78, r: -28, o: 0.9, b: 0.55, z: 4 },
    2: { x: 108, s: 0.6, r: -38, o: 0.55, b: 0.4, z: 3 },
    hidden: { x: 140, s: 0.5, r: -45, o: 0, b: 0.3, z: 1 },
  };

  // One dot button per project
  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'h-2.5 w-2.5 rounded-full bg-gray-300 transition-all duration-300 hover:bg-blue-400 aria-[current=true]:w-7 aria-[current=true]:bg-blue-600 dark:bg-slate-600';
    dot.setAttribute('aria-label', `Show project ${index + 1}`);
    dot.addEventListener('click', () => goTo(index));
    dotsBox.appendChild(dot);
    return dot;
  });

  // Copy the active project's text into the panel under the carousel
  function updateInfo() {
    const slide = slides[active];
    infoTag.textContent = slide.querySelector('[data-tag]').textContent;
    infoTitle.textContent = slide.querySelector('[data-title]').textContent;
    infoDescription.textContent = slide.querySelector('[data-description]').textContent;

    infoTools.replaceChildren();
    slide.querySelectorAll('[data-tools] span:not(:first-child)').forEach((tool) => {
      const item = document.createElement('li');
      item.textContent = tool.textContent;
      item.className = 'rounded-md bg-white px-2.5 py-1 text-xs font-medium shadow-sm dark:bg-slate-800';
      infoTools.appendChild(item);
    });
  }

  // Place every card based on its distance from the active one (wraps around in a circle)
  function render() {
    const total = slides.length;

    slides.forEach((slide, index) => {
      let distance = (index - active + total) % total;
      if (distance > total / 2) distance -= total; // e.g. 4 becomes -1 (one to the left)

      const side = Math.sign(distance); // -1 = left, 1 = right, 0 = center
      const p = positions[Math.abs(distance)] || positions.hidden;

      slide.style.transform =
        `translate(-50%, -50%) translateX(${p.x * side}%) scale(${p.s}) rotateY(${p.r * side}deg)`;
      slide.style.opacity = p.o;
      slide.style.filter = `brightness(${p.b})`;
      slide.style.zIndex = p.z;
      slide.style.pointerEvents = p.o === 0 ? 'none' : 'auto';

      const isActive = distance === 0;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive)); // screen readers only read the center card
      dots[index].setAttribute('aria-current', String(isActive));
    });

    // Fade the text panel out, change the text, fade it back in
    info.classList.add('opacity-0');
    setTimeout(() => {
      updateInfo();
      info.classList.remove('opacity-0');
    }, 200);
  }

  function goTo(index) {
    active = (index + slides.length) % slides.length; // wrap around at both ends
    render();
  }

  // Arrow buttons
  prevButton.addEventListener('click', () => goTo(active - 1));
  nextButton.addEventListener('click', () => goTo(active + 1));

  let justSwiped = false; // a swipe also fires a click; this stops it from moving twice

  // Click a side card to bring it to the center; click the center card to open its pop-up
  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if (justSwiped) {
        justSwiped = false;
        return;
      }
      if (index === active) {
        document.querySelector('#carousel-view-project').click();
      } else {
        goTo(index);
      }
    });
  });

  // Keyboard: left / right arrow keys when the carousel has focus
  stage.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') goTo(active - 1);
    if (event.key === 'ArrowRight') goTo(active + 1);
  });

  // Touch / mouse swipe
  let startX = null;
  stage.addEventListener('pointerdown', (event) => { startX = event.clientX; });
  stage.addEventListener('pointerup', (event) => {
    if (startX === null) return;
    const moved = event.clientX - startX;
    startX = null;
    if (Math.abs(moved) > 50) {
      justSwiped = true;
      setTimeout(() => { justSwiped = false; }, 0); // only ignore the click that comes right after
      goTo(moved < 0 ? active + 1 : active - 1);
    }
  });

  render();
}

initProjectCarousel();
