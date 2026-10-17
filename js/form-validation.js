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

  form.addEventListener('submit', (event) => {
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
    successMessage.textContent = `Thanks, ${name}! Your message has been sent.`;
    successMessage.classList.remove('hidden');
    form.reset();
  });

  // Clear a field's error as soon as the user fixes it
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid')) setError(field, validateField(field));
    });
  });
}

initFormValidation();
