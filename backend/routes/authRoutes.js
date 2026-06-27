const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { authLimiter } = require('../middlewares/rateLimiter');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require('../validators/authValidator');

// Public routes
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);
router.put('/password', authenticate, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
