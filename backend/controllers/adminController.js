const userService = require('../services/userService');
const productService = require('../services/productService');
const orderService = require('../services/orderService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Admin Dashboard Controller
 */
const adminController = {
  /**
   * GET /api/admin/dashboard
   */
  getDashboard: async (req, res, next) => {
    try {
      const [totalUsers, totalProducts, orderStats] = await Promise.all([
        userService.getUserCount(),
        productService.getProductCount(),
        orderService.getOrderStats(),
      ]);

      ApiResponse.success(res, {
        totalUsers,
        totalProducts,
        totalOrders: orderStats.totalOrders,
        revenue: orderStats.revenue,
        recentOrders: orderStats.recentOrders,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
