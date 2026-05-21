const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, createOrderValidation } = require('../middleware/validator');

// POST /api/orders
router.post('/', authMiddleware, createOrderValidation, validate, orderController.createOrder);

// GET /api/orders
router.get('/', authMiddleware, orderController.getUserOrders);

// GET /api/orders/:id
router.get('/:id', authMiddleware, orderController.getOrderDetail);

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;
