const Course = require('../models/Course');
const Product = require('../models/Product');
const { sendResponse } = require('../utils/response');

const searchController = {
  // GET /api/search
  globalSearch: async (req, res, next) => {
    try {
      const { q, type } = req.query;

      if (!q || q.trim().length === 0) {
        return sendResponse(res, 400, false, 'Search query is required');
      }

      const searchRegex = { $regex: q, $options: 'i' };
      const results = {};

      // Search courses
      if (!type || type === 'course') {
        results.courses = await Course.find(
          {
            isPublished: true,
            $or: [{ title: searchRegex }, { description: searchRegex }],
          },
          'title thumbnail dynasty difficulty enrolledCount'
        ).limit(10);
      }

      // Search products
      if (!type || type === 'product') {
        results.products = await Product.find(
          {
            isPublished: true,
            $or: [{ name: searchRegex }, { description: searchRegex }],
          },
          'name image price category stock'
        ).limit(10);
      }

      sendResponse(res, 200, true, 'Search results', results);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = searchController;
