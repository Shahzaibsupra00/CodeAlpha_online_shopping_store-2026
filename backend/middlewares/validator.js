const ApiError = require('../utils/apiError');

/**
 * Validation middleware factory
 * Takes a validation schema object and returns middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rules.label || field} is required`);
        continue;
      }

      // Skip further checks if field is optional and not provided
      if (!rules.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Type check
      if (rules.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push('Please provide a valid email address');
        }
      }

      // Min length
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        errors.push(`${rules.label || field} must be at least ${rules.minLength} characters`);
      }

      // Max length
      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push(`${rules.label || field} must not exceed ${rules.maxLength} characters`);
      }

      // Min value (for numbers)
      if (rules.min !== undefined && parseFloat(value) < rules.min) {
        errors.push(`${rules.label || field} must be at least ${rules.min}`);
      }

      // Max value (for numbers)
      if (rules.max !== undefined && parseFloat(value) > rules.max) {
        errors.push(`${rules.label || field} must not exceed ${rules.max}`);
      }

      // Pattern
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(rules.patternMessage || `${rules.label || field} format is invalid`);
      }

      // Enum
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${rules.label || field} must be one of: ${rules.enum.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return next(ApiError.badRequest('Validation failed', errors));
    }

    next();
  };
};

module.exports = { validate };
