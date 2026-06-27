/**
 * Modal and Confirm Dialog utilities
 */

export const showModal = (id) => {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
  }
};

export const hideModal = (id) => {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
};

/**
 * Show a confirmation dialog
 * Returns a promise that resolves true if confirmed
 */
export const confirmDialog = (message, title = 'Confirm Action') => {
  return new Promise((resolve) => {
    // Remove existing confirm dialogs
    const existing = document.getElementById('confirm-dialog');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'confirm-dialog';
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal confirm-dialog">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" id="confirm-cancel-x">✕</button>
        </div>
        <div class="modal-body">
          <div class="confirm-icon warning">⚠</div>
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="confirm-cancel">Cancel</button>
          <button class="btn btn-danger" id="confirm-ok">Confirm</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add('no-scroll');

    const cleanup = (result) => {
      overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
      setTimeout(() => overlay.remove(), 300);
      resolve(result);
    };

    overlay.querySelector('#confirm-ok').onclick = () => cleanup(true);
    overlay.querySelector('#confirm-cancel').onclick = () => cleanup(false);
    overlay.querySelector('#confirm-cancel-x').onclick = () => cleanup(false);
    overlay.onclick = (e) => {
      if (e.target === overlay) cleanup(false);
    };
  });
};

export default { showModal, hideModal, confirmDialog };
