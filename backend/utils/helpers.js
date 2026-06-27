/**
 * Helper utilities for the application
 */

/**
 * Generate pagination metadata
 */
const getPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Build sort object from query string
 */
const buildSortQuery = (sortBy, sortOrder) => {
  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.createdAt = -1;
  }
  return sort;
};

/**
 * Build filter query for products
 */
const buildProductFilter = (query) => {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
  }

  if (query.featured) {
    filter.featured = query.featured === 'true';
  }

  if (query.inStock) {
    filter.stock = { $gt: 0 };
  }

  return filter;
};

/**
 * Slugify a string
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

/**
 * Format price
 */
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

module.exports = {
  getPagination,
  buildSortQuery,
  buildProductFilter,
  slugify,
  formatPrice,
};
