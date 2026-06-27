const productService = require('../services/productService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Product Controller
 */
const productController = {
  /**
   * GET /api/products
   */
  getAllProducts: async (req, res, next) => {
    try {
      const { products, pagination } = await productService.getAllProducts(req.query);
      ApiResponse.paginated(res, products, pagination);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/featured
   */
  getFeaturedProducts: async (req, res, next) => {
    try {
      const products = await productService.getFeaturedProducts();
      ApiResponse.success(res, products);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/latest
   */
  getLatestProducts: async (req, res, next) => {
    try {
      const products = await productService.getLatestProducts();
      ApiResponse.success(res, products);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id
   */
  getProductById: async (req, res, next) => {
    try {
      const product = await productService.getProductById(req.params.id);
      ApiResponse.success(res, { product });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id/related
   */
  getRelatedProducts: async (req, res, next) => {
    try {
      const product = await productService.getProductById(req.params.id);
      const related = await productService.getRelatedProducts(
        product._id,
        product.category._id || product.category
      );
      ApiResponse.success(res, related);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/products
   */
  createProduct: async (req, res, next) => {
    try {
      const product = await productService.createProduct(req.body, req.files);
      ApiResponse.created(res, { product }, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/products/:id
   */
  updateProduct: async (req, res, next) => {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body,
        req.files
      );
      ApiResponse.success(res, { product }, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/products/:id
   */
  deleteProduct: async (req, res, next) => {
    try {
      await productService.deleteProduct(req.params.id);
      ApiResponse.success(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
