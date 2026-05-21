const authService = require('../services/authService');
const { sendResponse } = require('../utils/response');

const authController = {
  // POST /api/auth/register
  register: async (req, res, next) => {
    try {
      const { email, password, fullName } = req.body;
      const result = await authService.register(email, password, fullName);
      sendResponse(res, 201, true, 'Registration successful', result);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendResponse(res, 200, true, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/profile
  getProfile: async (req, res, next) => {
    try {
      const user = await authService.getProfile(req.user.id);
      sendResponse(res, 200, true, 'Profile retrieved', user);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/auth/profile
  updateProfile: async (req, res, next) => {
    try {
      const { fullName, avatar } = req.body;
      const user = await authService.updateProfile(req.user.id, { fullName, avatar });
      sendResponse(res, 200, true, 'Profile updated', user);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/logout
  logout: async (req, res, next) => {
    try {
      sendResponse(res, 200, true, 'Logout successful');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
