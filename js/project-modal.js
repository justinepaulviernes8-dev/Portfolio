// =========================================================
// Feature: Project modal (opens a bigger view of a project card)
// Uses in index.html:
//   - each card: <article data-project data-details="...">
//     with [data-tag], [data-title], [data-description], [data-tools] inside
//   - the "View Project" button: [data-open-project] (opens the .is-active carousel slide)
//   - the modal: #project-modal and its #modal-... elements, [data-close-modal]
// The zoom animation is in the <style> block in <head> (@keyframes modal-in / modal-out)
// =========================================================

function initProjectModal() {
  const modal = document.querySelector('#project-modal');

  if (!modal) {
    console.error('project-modal.js: #project-modal is missing in index.html.');
    return;
  }

  const modalImage = modal.querySelector('#modal-image');
  const modalTag = modal.querySelector('#modal-tag');
  const modalTitle = modal.querySelector('#modal-title');
  const modalDescription = modal.querySelector('#modal-description');
  const modalDetails = modal.querySelector('#modal-details');
  const modalTools = modal.querySelector('#modal-tools');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lastButton = null;

  // Copy the card's content into the modal (textContent only, never innerHTML)
  function fillModal(card) {
    const image = card.querySelector('img');
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTag.textContent = card.querySelector('[data-tag]').textContent;
    modalTitle.textContent = card.querySelector('[data-title]').textContent;
    modalDescription.textContent = card.querySelector('[data-description]').textContent;
    modalDetails.textContent = card.dataset.details || '';

    // Rebuild the tools list (skip the first span, which is the "Tools:" label)
    modalTools.replaceChildren();
    card.querySelectorAll('[data-tools] span:not(:first-child)').forEach((tool) => {
      const item = document.createElement('li');
      item.textContent = tool.textContent;
      item.className = 'rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-slate-800';
      modalTools.appendChild(item);
    });
  }

  function openModal(button) {
    lastButton = button;
    // A button inside a card opens that card; the carousel's button opens the center (.is-active) slide
    const card = button.closest('[data-project]') || document.querySelector('[data-project].is-active');
    fillModal(card);
    modal.showModal(); // the [open] attribute starts the modal-in animation
    document.documentElement.classList.add('overflow-hidden'); // stop the page behind from scrolling
  }

  // Really close the dialog, let the page scroll again, and return focus to the card's button
  function finishClose() {
    modal.classList.remove('is-closing');
    modal.close();
    document.documentElement.classList.remove('overflow-hidden');
    if (lastButton) lastButton.focus();
  }

  // Play the closing animation first, then close
  function closeModal() {
    if (!modal.open || modal.classList.contains('is-closing')) return;

    if (reduceMotion.matches) {
      finishClose();
      return;
    }
    let finished = false;
    function finishClosing() {
      if (finished) return; // only run once
      finished = true;
      finishClose();
    }

    modal.classList.add('is-closing'); // starts the modal-out animation (0.2s)
    modal.addEventListener('animationend', finishClosing, { once: true });
    // Backup: if the animation never finishes (e.g. the tab is hidden), close anyway
    setTimeout(finishClosing, 300);
  }

  // Open buttons on each card
  document.querySelectorAll('[data-open-project]').forEach((button) => {
    button.addEventListener('click', () => openModal(button));
  });

  // Close buttons inside the modal (the X button)
  modal.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  // Click on the dark backdrop (outside the white box) closes it
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  // Escape key: use our animated close instead of the instant default
  modal.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
  });
}

initProjectModal();
