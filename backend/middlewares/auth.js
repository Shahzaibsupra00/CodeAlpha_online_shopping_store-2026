const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

/**
 * Verify JWT and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Access denied. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Attach user to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw ApiError.unauthorized('User not found. Token is invalid.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired.'));
    }
    next(error);
  }
};

/**
 * Authorize admin-only routes
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  next(ApiError.forbidden('Admin access required.'));
};

module.exports = { authenticate, authorizeAdmin };
