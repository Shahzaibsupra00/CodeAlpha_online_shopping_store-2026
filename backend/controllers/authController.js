const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Auth Controller
 */
const authController = {
  /**
   * POST /api/auth/register
   */
  register: async (req, res, next) => {
    try {
      const { user, token } = await authService.register(req.body);
      ApiResponse.created(res, { user, token }, 'Registration successful');
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   */
  login: async (req, res, next) => {
    try {
      const { user, token } = await authService.login(req.body);
      ApiResponse.success(res, { user, token }, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/profile
   */
  getProfile: async (req, res, next) => {
    try {
      const user = await authService.getProfile(req.user._id);
      ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/profile
   */
  updateProfile: async (req, res, next) => {
    try {
      const user = await authService.updateProfile(req.user._id, req.body);
      ApiResponse.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/password
   */
  changePassword: async (req, res, next) => {
    try {
      const result = await authService.changePassword(req.user._id, req.body);
      ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
