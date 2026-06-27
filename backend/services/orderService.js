const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const { getPagination } = require('../utils/helpers');

/**
 * Order Service — business logic for orders
 */
class OrderService {
  /**
   * Create order from cart
   */
  async createOrder(userId, orderData) {
    const { shippingAddress, paymentMethod } = orderData;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate(
      'products.product',
      'title price images stock'
    );

    if (!cart || cart.products.length === 0) {
      throw ApiError.badRequest('Cart is empty');
    }

    // Build order products and calculate total
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of cart.products) {
      const product = item.product;

      if (!product) {
        throw ApiError.badRequest('A product in your cart no longer exists');
      }
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for ${product.title}`);
      }

      orderProducts.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || '',
      });

      totalAmount += product.price * item.quantity;

      // Reduce stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create order
    const order = await Order.create({
      user: userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'Pending',
    });

    // Clear cart
    cart.products = [];
    await cart.save();

    return order;
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: userId }),
    ]);

    return { orders, pagination: getPagination(page, limit, total) };
  }

  /**
   * Get single order
   */
  async getOrderById(orderId, userId, isAdmin = false) {
    const query = isAdmin ? { _id: orderId } : { _id: orderId, user: userId };
    const order = await Order.findOne(query).populate('user', 'name email');

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }

  /**
   * Get all orders (admin)
   */
  async getAllOrders(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.status) {
      filter.status = query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return { orders, pagination: getPagination(page, limit, total) };
  }

  /**
   * Update order status (admin)
   */
  async updateOrderStatus(orderId, status) {
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest('Invalid order status');
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }

  /**
   * Delete order (admin)
   */
  async deleteOrder(orderId) {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }
    return order;
  }

  /**
   * Get order statistics (admin)
   */
  async getOrderStats() {
    const [totalOrders, revenue, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return {
      totalOrders,
      revenue: revenue[0]?.total || 0,
      recentOrders,
    };
  }
}

module.exports = new OrderService();
