/**
 * Main JS — initializes header, footer, theme, and page-specific modules
 */
import { isAuthenticated, isAdmin, getCurrentUser, logout } from './auth/auth.js';
import { updateCartCount } from './cart/cart.js';
import { getTheme, setTheme } from './utils/storage.js';

const ICONS = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  cart: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; display: inline-block; vertical-align: middle;"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  box: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
};

/**
 * Initialize common UI — header, navigation, theme
 */
export const initApp = () => {
  initTheme();
  initNavigation();
  updateCartCount();
  replaceIconsWithSVGs();
};

/**
 * Theme toggle
 */
const initTheme = () => {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
    toggleBtn.addEventListener('click', () => {
      const current = getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      document.documentElement.setAttribute('data-theme', next);
      toggleBtn.innerHTML = next === 'dark' ? ICONS.sun : ICONS.moon;
    });
  }
};

/**
 * Scan and replace text emojis with beautiful SVG icons
 */
const replaceIconsWithSVGs = () => {
  // 1. Search button
  const searchBtn = document.getElementById('hero-search-btn');
  if (searchBtn && searchBtn.innerHTML.trim() === '🔍') {
    searchBtn.innerHTML = ICONS.search;
  }

  // 2. Cart icon
  const cartIconLink = document.querySelector('.nav-icon[title="Cart"]');
  if (cartIconLink) {
    const textNode = Array.from(cartIconLink.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('🛒'));
    if (textNode) {
      const svgSpan = document.createElement('span');
      svgSpan.innerHTML = ICONS.cart;
      svgSpan.style.display = 'inline-flex';
      svgSpan.style.alignItems = 'center';
      cartIconLink.replaceChild(svgSpan, textNode);
    }
  }

  // 3. User menu button
  const userMenuBtn = document.getElementById('user-menu-btn');
  if (userMenuBtn) {
    const textNode = Array.from(userMenuBtn.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('👤'));
    if (textNode) {
      const svgSpan = document.createElement('span');
      svgSpan.innerHTML = ICONS.user;
      svgSpan.style.display = 'inline-flex';
      svgSpan.style.alignItems = 'center';
      svgSpan.style.marginRight = '8px';
      userMenuBtn.insertBefore(svgSpan, textNode);
      textNode.textContent = textNode.textContent.replace('👤', '').trim();
      
      const arrowNode = Array.from(userMenuBtn.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('▾'));
      if (arrowNode) {
        const arrowSpan = document.createElement('span');
        arrowSpan.innerHTML = ICONS.chevronDown;
        arrowSpan.style.display = 'inline-flex';
        arrowSpan.style.alignItems = 'center';
        userMenuBtn.replaceChild(arrowSpan, arrowNode);
      }
    }
  }

  // 4. Dropdown Profile
  const profileLink = document.querySelector('.user-dropdown a[href="/pages/profile.html"]');
  if (profileLink && profileLink.textContent.includes('👤')) {
    profileLink.innerHTML = `${ICONS.user} <span>My Profile</span>`;
  }

  // 5. Dropdown Orders
  const ordersLink = document.querySelector('.user-dropdown a[href="/pages/orders.html"]');
  if (ordersLink && ordersLink.textContent.includes('📦')) {
    ordersLink.innerHTML = `${ICONS.box} <span>My Orders</span>`;
  }

  // 6. Dropdown Admin
  const adminLink = document.getElementById('admin-link');
  if (adminLink && adminLink.textContent.includes('⚙️')) {
    adminLink.innerHTML = `${ICONS.settings} <span>Admin Panel</span>`;
  }

  // 7. Dropdown Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn && logoutBtn.textContent.includes('🚪')) {
    logoutBtn.innerHTML = `${ICONS.logout} <span>Logout</span>`;
  }
};

/**
 * Navigation — show/hide auth links, mobile menu
 */
const initNavigation = () => {
  const user = getCurrentUser();
  const authNav = document.getElementById('auth-nav');
  const userNav = document.getElementById('user-nav');
  const adminLink = document.getElementById('admin-link');
  const userName = document.getElementById('user-name');

  if (isAuthenticated() && user) {
    if (authNav) authNav.style.display = 'none';
    if (userNav) userNav.style.display = 'flex';
    if (userName) userName.textContent = user.name;
    if (adminLink && isAdmin()) adminLink.style.display = 'block';
  } else {
    if (authNav) authNav.style.display = 'flex';
    if (userNav) userNav.style.display = 'none';
  }

  // User dropdown
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown');
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    document.addEventListener('click', () => {
      userDropdown.classList.remove('active');
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Mobile menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileBtn.classList.toggle('active');
    });
  }

  // Active link highlighting
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href === '/' && currentPath === '/index.html')) {
      link.classList.add('active');
    }
  });
};

// Auto-initialize when DOM loads
document.addEventListener('DOMContentLoaded', initApp);
