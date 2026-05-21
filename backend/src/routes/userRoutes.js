const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All user routes require auth
router.use(authMiddleware);

// GET /api/users/profile
router.get('/profile', userController.getProfile);

// PUT /api/users/profile
router.put('/profile', userController.updateProfile);

// POST /api/users/change-password
router.post('/change-password', userController.changePassword);

// GET /api/users/quiz-history
router.get('/quiz-history', userController.getQuizHistory);

// GET /api/users/xp-history
router.get('/xp-history', userController.getXPHistory);

module.exports = router;
