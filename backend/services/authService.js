const User = require('../models/User');
const ApiError = require('../utils/apiError');

/**
 * Auth Service — business logic for authentication
 */
class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    const user = await User.create({ name, email, password });
    const token = user.generateToken();

    return { user, token };
  }

  /**
   * Login with email and password
   */
  async login({ email, password }) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = user.generateToken();

    return { user, token };
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    const { name, email, phone, address } = updateData;

    // Check if email is taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        throw ApiError.conflict('Email already in use');
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  /**
   * Change password
   */
  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.unauthorized('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }
}

module.exports = new AuthService();
