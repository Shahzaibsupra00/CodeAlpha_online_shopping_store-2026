const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  categoryController.createCategory
);
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  categoryController.updateCategory
);
router.delete('/:id', authenticate, authorizeAdmin, categoryController.deleteCategory);

module.exports = router;
