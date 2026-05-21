const orderService = require('../services/orderService');
const { sendResponse } = require('../utils/response');

const orderController = {
  // POST /api/orders
  createOrder: async (req, res, next) => {
    try {
      const order = await orderService.createOrder(req.user.id, req.body);
      sendResponse(res, 201, true, 'Order created successfully', order);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/orders
  getUserOrders: async (req, res, next) => {
    try {
      const orders = await orderService.getUserOrders(req.user.id);
      sendResponse(res, 200, true, 'Orders retrieved', orders);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/orders/:id
  getOrderDetail: async (req, res, next) => {
    try {
      const order = await orderService.getOrderDetail(req.params.id, req.user.id);
      sendResponse(res, 200, true, 'Order detail retrieved', order);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/orders/:id/cancel
  cancelOrder: async (req, res, next) => {
    try {
      const order = await orderService.cancelOrder(req.params.id, req.user.id);
      sendResponse(res, 200, true, 'Order cancelled', order);
    } catch (error) {
      next(error);
    }
  },

  // ---- ADMIN ----
  // GET /api/admin/orders
  getAllOrders: async (req, res, next) => {
    try {
      const { page, limit, status } = req.query;
      const result = await orderService.getAllOrders({ page, limit, status });
      sendResponse(res, 200, true, 'All orders retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/orders/:id/status
  updateOrderStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id, status);
      sendResponse(res, 200, true, 'Order status updated', order);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
