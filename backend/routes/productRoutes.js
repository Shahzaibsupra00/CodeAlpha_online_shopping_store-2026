const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/latest', productController.getLatestProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);

// Admin routes
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.array('images', 5),
  productController.createProduct
);
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  upload.array('images', 5),
  productController.updateProduct
);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

module.exports = router;
