const orderService = require('../services/orderService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Order Controller
 */
const orderController = {
  createOrder: async (req, res, next) => {
    try {
      const order = await orderService.createOrder(req.user._id, req.body);
      ApiResponse.created(res, { order }, 'Order placed successfully');
    } catch (error) {
      next(error);
    }
  },

  getUserOrders: async (req, res, next) => {
    try {
      const { orders, pagination } = await orderService.getUserOrders(
        req.user._id,
        req.query
      );
      ApiResponse.paginated(res, orders, pagination);
    } catch (error) {
      next(error);
    }
  },

  getOrderById: async (req, res, next) => {
    try {
      const isAdmin = req.user.role === 'admin';
      const order = await orderService.getOrderById(
        req.params.id,
        req.user._id,
        isAdmin
      );
      ApiResponse.success(res, { order });
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoints
  getAllOrders: async (req, res, next) => {
    try {
      const { orders, pagination } = await orderService.getAllOrders(req.query);
      ApiResponse.paginated(res, orders, pagination);
    } catch (error) {
      next(error);
    }
  },

  updateOrderStatus: async (req, res, next) => {
    try {
      const order = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status
      );
      ApiResponse.success(res, { order }, 'Order status updated');
    } catch (error) {
      next(error);
    }
  },

  deleteOrder: async (req, res, next) => {
    try {
      await orderService.deleteOrder(req.params.id);
      ApiResponse.success(res, null, 'Order deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  getOrderStats: async (req, res, next) => {
    try {
      const stats = await orderService.getOrderStats();
      ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
