const ApiError = require('../utils/apiError');
const config = require('../config/config');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('❌ Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = ApiError.badRequest('Invalid ID format');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(`${field} already exists`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest('Validation Error', messages);
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = ApiError.badRequest('File too large. Maximum size is 5MB');
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.errors || [],
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  // Don't 404 for static frontend files — let Express static handle those
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

module.exports = { errorHandler, notFoundHandler };
