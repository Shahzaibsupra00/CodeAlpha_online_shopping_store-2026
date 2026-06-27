/**
 * Client-side validation utilities
 */

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 6) return { valid: false, strength: 'weak', message: 'At least 6 characters required' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  const strengths = ['weak', 'fair', 'good', 'strong'];
  return {
    valid: true,
    strength: strengths[Math.min(score, 3)],
    message: `Password strength: ${strengths[Math.min(score, 3)]}`,
  };
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // Optional
  const regex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/;
  return regex.test(phone) ? null : 'Invalid phone number';
};

/**
 * Validate a form against rules
 * Returns array of error messages (empty if valid)
 */
export const validateForm = (data, rules) => {
  const errors = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    const label = fieldRules.label || field;

    if (fieldRules.required) {
      const err = validateRequired(value, label);
      if (err) { errors.push(err); continue; }
    }

    if (!value) continue;

    if (fieldRules.type === 'email' && !validateEmail(value)) {
      errors.push('Invalid email address');
    }

    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors.push(`${label} must be at least ${fieldRules.minLength} characters`);
    }

    if (fieldRules.min !== undefined && parseFloat(value) < fieldRules.min) {
      errors.push(`${label} must be at least ${fieldRules.min}`);
    }
  }

  return errors;
};

/**
 * Show validation errors on form inputs
 */
export const showFieldError = (inputEl, message) => {
  inputEl.classList.add('error');
  let errorEl = inputEl.parentElement.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    inputEl.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
};

export const clearFieldErrors = (form) => {
  form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
  form.querySelectorAll('.form-error').forEach((el) => el.remove());
};
