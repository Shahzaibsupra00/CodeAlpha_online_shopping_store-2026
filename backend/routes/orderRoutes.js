const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

// User routes (authenticated)
router.post('/', authenticate, orderController.createOrder);
router.get('/my-orders', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrderById);

// Admin routes
router.get('/', authenticate, authorizeAdmin, orderController.getAllOrders);
router.put('/:id', authenticate, authorizeAdmin, orderController.updateOrderStatus);
router.delete('/:id', authenticate, authorizeAdmin, orderController.deleteOrder);

module.exports = router;
