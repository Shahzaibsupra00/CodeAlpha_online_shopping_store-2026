const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

router.use(authenticate, authorizeAdmin);

router.get('/dashboard', adminController.getDashboard);

module.exports = router;
