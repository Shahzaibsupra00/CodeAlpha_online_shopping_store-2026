/**
 * Product module — fetching and displaying products
 */
import apiClient from '../api/client.js';
import { renderProductCard, renderPagination, formatPrice, renderStars, getImageUrl } from '../utils/helpers.js';
import { showSkeletonGrid } from '../utils/loader.js';
import { addToCart } from '../cart/cart.js';
import { showToast } from '../utils/toast.js';
import { toggleWishlistItem, isInWishlist, getWishlist, addRecentlyViewed } from '../utils/storage.js';

/**
 * Fetch products with query parameters
 */
export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/products?${query}`);
};

export const fetchFeaturedProducts = () => apiClient.get('/products/featured');
export const fetchLatestProducts = () => apiClient.get('/products/latest');
export const fetchProductById = (id) => apiClient.get(`/products/${id}`);
export const fetchRelatedProducts = (id) => apiClient.get(`/products/${id}/related`);
export const fetchCategories = () => apiClient.get('/categories');

/**
 * Render product grid with event handlers
 */
export const renderProductGrid = (container, products, pagination = null) => {
  if (!container) return;
  const wishlist = getWishlist();

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="no-products">
        <div class="icon">📦</div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="product-grid">
      ${products.map((p) => renderProductCard(p, wishlist)).join('')}
    </div>
    ${pagination ? renderPagination(pagination) : ''}
  `;

  // Attach events
  attachProductCardEvents(container);
};

/**
 * Attach click events to product cards
 */
export const attachProductCardEvents = (container) => {
  // Whole card click (redirects to product details page)
  container.querySelectorAll('.product-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) {
        return;
      }
      const productId = card.dataset.id;
      window.location.href = `/pages/product.html?id=${productId}`;
    });
  });

  // Add to cart buttons (adds and redirects to full cart page)
  container.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.dataset.id;
      try {
        await addToCart(productId, 1);
        window.location.href = '/pages/cart.html';
      } catch {
        // handled in cart module
      }
    });
  });

  // Wishlist buttons
  container.querySelectorAll('.wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.dataset.id;
      const items = toggleWishlistItem(productId);
      const isNowWishlisted = items.includes(productId);
      btn.classList.toggle('wishlisted', isNowWishlisted);
      btn.innerHTML = isNowWishlisted ? '❤' : '♡';
      showToast(
        isNowWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
        'success'
      );
    });
  });
};

/**
 * Render product detail page
 */
export const renderProductDetail = (container, product) => {
  if (!container || !product) return;

  addRecentlyViewed(product._id);

  const mainImage = product.images && product.images[0]
    ? getImageUrl(product.images[0])
    : '';

  const categoryName = product.category?.name || 'Uncategorized';

  container.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-gallery">
        <div class="product-gallery-main">
          ${mainImage
            ? `<img src="${mainImage}" alt="${product.title}" id="main-image">`
            : `<div class="no-image"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-text-muted);"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>`
          }
        </div>
        ${product.images && product.images.length > 1 ? `
          <div class="product-gallery-thumbs">
            ${product.images.map((img, i) => `
              <div class="thumb ${i === 0 ? 'active' : ''}" data-image="${getImageUrl(img)}">
                <img src="${getImageUrl(img)}" alt="Thumbnail ${i + 1}">
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="product-info">
        <div class="product-info-category">${categoryName}</div>
        <h1>${product.title}</h1>
        <div class="product-info-rating">
          ${renderStars(product.rating)}
          <span>${product.rating || 0} / 5</span>
        </div>
        <div class="product-info-price">${formatPrice(product.price)}</div>
        <p class="product-info-description">${product.description}</p>

        <div class="product-info-stock">
          ${product.stock > 0
            ? `<span class="in-stock">● In Stock</span> <span class="text-muted">(${product.stock} available)</span>`
            : `<span class="out-of-stock">● Out of Stock</span>`
          }
        </div>

        ${product.stock > 0 ? `
          <div class="quantity-selector">
            <label>Quantity:</label>
            <button class="qty-btn" id="qty-decrease">−</button>
            <input type="number" class="qty-input" id="qty-input" value="1" min="1" max="${product.stock}">
            <button class="qty-btn" id="qty-increase">+</button>
          </div>

          <div class="product-actions">
            <button class="btn btn-primary btn-lg" id="add-to-cart-detail" data-id="${product._id}">
              🛒 Add to Cart
            </button>
            <button class="btn btn-outline btn-lg wishlist-detail-btn" data-id="${product._id}">
              ${isInWishlist(product._id) ? '❤' : '♡'} Wishlist
            </button>
          </div>
        ` : ''}

        <div class="product-meta">
          <div class="product-meta-item">
            <span>Category:</span>
            <span>${categoryName}</span>
          </div>
          <div class="product-meta-item">
            <span>SKU:</span>
            <span>${product._id.slice(-8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Thumbnail clicks
  container.querySelectorAll('.thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      container.querySelectorAll('.thumb').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      const mainImg = container.querySelector('#main-image');
      if (mainImg) mainImg.src = thumb.dataset.image;
    });
  });

  // Quantity controls
  const qtyInput = container.querySelector('#qty-input');
  const decreaseBtn = container.querySelector('#qty-decrease');
  const increaseBtn = container.querySelector('#qty-increase');

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      const val = parseInt(qtyInput.value);
      if (val > 1) qtyInput.value = val - 1;
    });
  }

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      const val = parseInt(qtyInput.value);
      if (val < product.stock) qtyInput.value = val + 1;
    });
  }

  // Add to cart
  const addBtn = container.querySelector('#add-to-cart-detail');
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const qty = parseInt(qtyInput?.value || 1);
      try {
        await addToCart(product._id, qty);
      } catch {
        // handled
      }
    });
  }

  // Wishlist
  const wishBtn = container.querySelector('.wishlist-detail-btn');
  if (wishBtn) {
    wishBtn.addEventListener('click', () => {
      const id = wishBtn.dataset.id;
      const items = toggleWishlistItem(id);
      const isNow = items.includes(id);
      wishBtn.innerHTML = `${isNow ? '❤' : '♡'} Wishlist`;
      showToast(isNow ? 'Added to wishlist' : 'Removed from wishlist', 'success');
    });
  }
};

export default {
  fetchProducts, fetchFeaturedProducts, fetchLatestProducts,
  fetchProductById, fetchRelatedProducts, fetchCategories,
  renderProductGrid, renderProductDetail, attachProductCardEvents,
};
