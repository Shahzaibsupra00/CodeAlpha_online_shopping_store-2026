const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const { getPagination, buildProductFilter, buildSortQuery } = require('../utils/helpers');
const config = require('../config/config');

/**
 * Product Service — business logic for products
 */
class ProductService {
  /**
   * Get all products with filters, search, sort, pagination
   */
  async getAllProducts(query) {
    const page = parseInt(query.page) || config.pagination.defaultPage;
    const limit = Math.min(
      parseInt(query.limit) || config.pagination.defaultLimit,
      config.pagination.maxLimit
    );
    const skip = (page - 1) * limit;

    // Build filter
    const filter = buildProductFilter(query);

    // Build sort
    let sort = {};
    switch (query.sort) {
      case 'price_low': sort = { price: 1 }; break;
      case 'price_high': sort = { price: -1 }; break;
      case 'name_az': sort = { title: 1 }; break;
      case 'name_za': sort = { title: -1 }; break;
      case 'rating': sort = { rating: -1 }; break;
      case 'oldest': sort = { createdAt: 1 }; break;
      default: sort = { createdAt: -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return { products, pagination: getPagination(page, limit, total) };
  }

  /**
   * Get single product by ID
   */
  async getProductById(id) {
    const product = await Product.findById(id).populate('category', 'name');
    if (!product) {
      throw ApiError.notFound('Product not found');
    }
    return product;
  }

  /**
   * Get related products (same category, different product)
   */
  async getRelatedProducts(productId, categoryId, limit = 4) {
    return Product.find({
      category: categoryId,
      _id: { $ne: productId },
    })
      .populate('category', 'name')
      .limit(limit);
  }

  /**
   * Create product (admin)
   */
  async createProduct(data, files) {
    const images = files ? files.map((f) => `/uploads/${f.filename}`) : [];
    const product = await Product.create({ ...data, images });
    return product;
  }

  /**
   * Update product (admin)
   */
  async updateProduct(id, data, files) {
    const product = await Product.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    // If new images are uploaded, add them
    if (files && files.length > 0) {
      const newImages = files.map((f) => `/uploads/${f.filename}`);
      data.images = [...(product.images || []), ...newImages];
    }

    const updated = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    return updated;
  }

  /**
   * Delete product (admin)
   */
  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }
    return product;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8) {
    return Product.find({ featured: true })
      .populate('category', 'name')
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Get latest products
   */
  async getLatestProducts(limit = 8) {
    return Product.find()
      .populate('category', 'name')
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Get product count
   */
  async getProductCount() {
    return Product.countDocuments();
  }
}

module.exports = new ProductService();
