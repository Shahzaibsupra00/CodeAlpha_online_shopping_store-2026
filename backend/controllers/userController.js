const userService = require('../services/userService');
const ApiResponse = require('../utils/apiResponse');

/**
 * User Controller (Admin)
 */
const userController = {
  /**
   * GET /api/users
   */
  getAllUsers: async (req, res, next) => {
    try {
      const { users, pagination } = await userService.getAllUsers(req.query);
      ApiResponse.paginated(res, users, pagination);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/users/:id
   */
  getUserById: async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);
      ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/users/:id
   */
  updateUser: async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      ApiResponse.success(res, { user }, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/users/:id
   */
  deleteUser: async (req, res, next) => {
    try {
      await userService.deleteUser(req.params.id);
      ApiResponse.success(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
