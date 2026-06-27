const cartService = require('../services/cartService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Cart Controller
 */
const cartController = {
  getCart: async (req, res, next) => {
    try {
      const cart = await cartService.getCart(req.user._id);
      ApiResponse.success(res, { cart });
    } catch (error) {
      next(error);
    }
  },

  addToCart: async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.addToCart(req.user._id, productId, quantity || 1);
      ApiResponse.success(res, { cart }, 'Product added to cart');
    } catch (error) {
      next(error);
    }
  },

  updateCartItem: async (req, res, next) => {
    try {
      const { quantity } = req.body;
      const cart = await cartService.updateCartItem(
        req.user._id,
        req.params.id,
        quantity
      );
      ApiResponse.success(res, { cart }, 'Cart updated');
    } catch (error) {
      next(error);
    }
  },

  removeFromCart: async (req, res, next) => {
    try {
      const cart = await cartService.removeFromCart(req.user._id, req.params.id);
      ApiResponse.success(res, { cart }, 'Product removed from cart');
    } catch (error) {
      next(error);
    }
  },

  clearCart: async (req, res, next) => {
    try {
      await cartService.clearCart(req.user._id);
      ApiResponse.success(res, null, 'Cart cleared');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;
