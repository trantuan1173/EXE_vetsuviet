const { sendResponse } = require('../utils/response');

// Middleware to check if user has required role(s)
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Unauthorized. Please login.');
    }

    if (!roles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        'Forbidden. You do not have permission to access this resource.'
      );
    }

    next();
  };
};

// Shorthand for admin-only routes
const adminOnly = roleMiddleware('admin');

// Shorthand for user and admin routes
const userAndAdmin = roleMiddleware('user', 'admin');

module.exports = { roleMiddleware, adminOnly, userAndAdmin };
