const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

/**
 * Cart Service — business logic for shopping cart
 */
class CartService {
  /**
   * Get user's cart
   */
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate(
      'products.product',
      'title price images stock'
    );

    if (!cart) {
      cart = await Cart.create({ user: userId, products: [] });
    }

    return cart;
  }

  /**
   * Add product to cart
   */
  async addToCart(userId, productId, quantity = 1) {
    // Verify product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }
    if (product.stock < quantity) {
      throw ApiError.badRequest('Insufficient stock');
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
    }

    return Cart.findOne({ user: userId }).populate(
      'products.product',
      'title price images stock'
    );
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(userId, productId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    const itemIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw ApiError.notFound('Product not found in cart');
    }

    // Verify stock
    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      throw ApiError.badRequest('Insufficient stock');
    }

    if (quantity <= 0) {
      cart.products.splice(itemIndex, 1);
    } else {
      cart.products[itemIndex].quantity = quantity;
    }

    await cart.save();

    return Cart.findOne({ user: userId }).populate(
      'products.product',
      'title price images stock'
    );
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();

    return Cart.findOne({ user: userId }).populate(
      'products.product',
      'title price images stock'
    );
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    return cart;
  }
}

module.exports = new CartService();
