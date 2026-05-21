const { verifyToken } = require('../config/jwt');
const User = require('../models/User');
const { sendResponse } = require('../utils/response');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, false, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendResponse(res, 401, false, 'User not found.');
    }

    if (!user.isActive) {
      return sendResponse(res, 403, false, 'Account is disabled.');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendResponse(res, 401, false, 'Invalid token.');
    }
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, 401, false, 'Token expired.');
    }
    return sendResponse(res, 500, false, 'Server error.');
  }
};

module.exports = authMiddleware;
