const Course = require('../models/Course');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const QuizHistory = require('../models/QuizHistory');
const { sendResponse } = require('../utils/response');

const adminController = {
  // GET /api/admin/dashboard
  getDashboard: async (req, res, next) => {
    try {
      const [totalUsers, totalCourses, totalProducts, totalOrders, totalRevenue, totalXPDistributed] =
        await Promise.all([
          User.countDocuments({ role: 'user' }),
          Course.countDocuments(),
          Product.countDocuments(),
          Order.countDocuments(),
          Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
          ]),
          QuizHistory.aggregate([
            { $group: { _id: null, total: { $sum: '$xpEarned' } } },
          ]),
        ]);

      const stats = {
        totalUsers,
        totalCourses,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalXPDistributed: totalXPDistributed[0]?.total || 0,
      };

      sendResponse(res, 200, true, 'Dashboard stats retrieved', stats);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/admin/users
  getAllUsers: async (req, res, next) => {
    try {
      const { page, limit, search } = req.query;
      const result = await require('../services/userService').getAllUsers({
        page,
        limit,
        search,
      });
      sendResponse(res, 200, true, 'Users retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/admin/users/:id
  getUserDetail: async (req, res, next) => {
    try {
      const result = await require('../services/userService').getUserById(req.params.id);
      sendResponse(res, 200, true, 'User detail retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/users/:id/toggle-status
  toggleUserStatus: async (req, res, next) => {
    try {
      const user = await require('../services/userService').toggleUserStatus(req.params.id);
      sendResponse(res, 200, true, 'User status toggled', user);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
