const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { getPagination } = require('../utils/helpers');

/**
 * User Service — admin operations for user management
 */
class UserService {
  /**
   * Get all users (admin)
   */
  async getAllUsers(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.role) {
      filter.role = query.role;
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return { users, pagination: getPagination(page, limit, total) };
  }

  /**
   * Get single user (admin)
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  /**
   * Update user (admin)
   */
  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  /**
   * Delete user (admin)
   */
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  /**
   * Get user count
   */
  async getUserCount() {
    return User.countDocuments();
  }
}

module.exports = new UserService();
