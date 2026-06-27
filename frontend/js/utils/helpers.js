/**
 * General helper utilities
 */

/**
 * Format price to currency string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Render star rating HTML
 */
export const renderStars = (rating) => {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<span>★</span>';
    } else if (i - 0.5 <= rating) {
      stars += '<span>★</span>';
    } else {
      stars += '<span class="empty">★</span>';
    }
  }
  return `<div class="stars">${stars}</div>`;
};

/**
 * Get query parameter from URL
 */
export const getQueryParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

/**
 * Set query parameter without page reload
 */
export const setQueryParam = (name, value) => {
  const params = new URLSearchParams(window.location.search);
  if (value) {
    params.set(name, value);
  } else {
    params.delete(name);
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Get image URL - handles relative and absolute paths
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:5000${imagePath}`;
};

/**
 * Render product card HTML
 */
export const renderProductCard = (product, wishlist = []) => {
  const imageUrl = product.images && product.images[0]
    ? getImageUrl(product.images[0])
    : '';
  const categoryName = product.category?.name || 'Uncategorized';
  const isWishlisted = wishlist.includes(product._id);

  return `
    <div class="product-card animate-fade-in-up" data-id="${product._id}">
      ${product.featured ? '<span class="product-card-badge featured">Featured</span>' : ''}
      ${product.stock <= 0 ? '<span class="product-card-badge out-of-stock">Out of Stock</span>' : ''}
      <div class="product-card-image">
        ${imageUrl
          ? `<img src="${imageUrl}" class="primary-img" alt="${product.title}" loading="lazy">
             ${product.images[1] ? `<img src="${getImageUrl(product.images[1])}" class="secondary-img" alt="${product.title}" loading="lazy">` : ''}`
          : `<div class="no-image"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-text-muted);"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>`
        }
        <div class="product-card-actions">
          <button class="wishlist-btn ${isWishlisted ? 'wishlisted' : ''}" data-id="${product._id}" title="Wishlist">
            ${isWishlisted ? '❤' : '♡'}
          </button>
        </div>
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${categoryName}</div>
        <h3 class="product-card-title">
          <a href="/pages/product.html?id=${product._id}">${product.title}</a>
        </h3>
        <div class="product-card-rating">
          ${renderStars(product.rating)}
          <span>(${product.rating || 0})</span>
        </div>
        <div class="product-card-footer">
          <span class="product-card-price">${formatPrice(product.price)}</span>
          ${product.stock > 0
            ? `<button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product._id}">Add to Cart</button>`
            : `<span class="text-error text-sm">Out of Stock</span>`
          }
        </div>
      </div>
    </div>
  `;
};

/**
 * Render pagination HTML
 */
export const renderPagination = (pagination) => {
  if (!pagination || pagination.totalPages <= 1) return '';

  let html = '<div class="pagination">';

  html += `<button class="pagination-btn" data-page="${pagination.page - 1}" ${pagination.page <= 1 ? 'disabled' : ''}>‹</button>`;

  const startPage = Math.max(1, pagination.page - 2);
  const endPage = Math.min(pagination.totalPages, pagination.page + 2);

  if (startPage > 1) {
    html += `<button class="pagination-btn" data-page="1">1</button>`;
    if (startPage > 2) html += `<span class="pagination-dots">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="pagination-btn ${i === pagination.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  if (endPage < pagination.totalPages) {
    if (endPage < pagination.totalPages - 1) html += `<span class="pagination-dots">...</span>`;
    html += `<button class="pagination-btn" data-page="${pagination.totalPages}">${pagination.totalPages}</button>`;
  }

  html += `<button class="pagination-btn" data-page="${pagination.page + 1}" ${pagination.page >= pagination.totalPages ? 'disabled' : ''}>›</button>`;
  html += '</div>';

  return html;
};
