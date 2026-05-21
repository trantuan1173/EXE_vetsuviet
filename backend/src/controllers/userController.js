const userService = require('../services/userService');
const { sendResponse } = require('../utils/response');

const userController = {
  // GET /api/users/profile
  getProfile: async (req, res, next) => {
    try {
      const user = await userService.getUserProfile(req.user.id);
      sendResponse(res, 200, true, 'Profile retrieved', user);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/users/profile
  updateProfile: async (req, res, next) => {
    try {
      const { fullName, avatar } = req.body;
      const user = await userService.updateProfile(req.user.id, { fullName, avatar });
      sendResponse(res, 200, true, 'Profile updated', user);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/users/change-password
  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(req.user.id, currentPassword, newPassword);
      sendResponse(res, 200, true, result.message);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/quiz-history
  getQuizHistory: async (req, res, next) => {
    try {
      const history = await userService.getQuizHistory(req.user.id);
      sendResponse(res, 200, true, 'Quiz history retrieved', history);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/xp-history
  getXPHistory: async (req, res, next) => {
    try {
      const history = await userService.getXPHistory(req.user.id);
      sendResponse(res, 200, true, 'XP history retrieved', history);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
