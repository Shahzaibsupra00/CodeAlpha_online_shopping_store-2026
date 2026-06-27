/**
 * Loading / Skeleton utilities
 */

/**
 * Show a loading spinner in a container
 */
export const showLoader = (container) => {
  if (typeof container === 'string') {
    container = document.getElementById(container);
  }
  if (!container) return;
  container.innerHTML = `
    <div class="page-loader">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;
};

/**
 * Show skeleton cards for product grid
 */
export const showSkeletonGrid = (container, count = 8) => {
  if (typeof container === 'string') {
    container = document.getElementById(container);
  }
  if (!container) return;

  let skeletons = '';
  for (let i = 0; i < count; i++) {
    skeletons += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-text short"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text medium"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
      </div>
    `;
  }
  container.innerHTML = skeletons;
};

/**
 * Show button loading state
 */
export const setButtonLoading = (btn, loading) => {
  if (loading) {
    btn.classList.add('loading');
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
    if (btn.dataset.originalText) {
      btn.textContent = btn.dataset.originalText;
    }
  }
};

export default { showLoader, showSkeletonGrid, setButtonLoading };
