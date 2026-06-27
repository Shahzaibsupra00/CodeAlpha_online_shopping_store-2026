/**
 * Toast notification system
 */
import config from '../config/config.js';

let container = null;

const getContainer = () => {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
};

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export const showToast = (message, type = 'info', duration = config.TOAST_DURATION) => {
  const toastContainer = getContainer();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;

  toastContainer.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

export default { showToast };
