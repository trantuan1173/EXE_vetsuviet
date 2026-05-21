const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, submitQuizValidation } = require('../middleware/validator');

// GET /api/quiz/lesson/:lessonId
router.get('/lesson/:lessonId', authMiddleware, quizController.getQuizByLesson);

// POST /api/quiz/submit
router.post('/submit', authMiddleware, submitQuizValidation, validate, quizController.submitQuiz);

// GET /api/quiz/history
router.get('/history', authMiddleware, quizController.getQuizHistory);

module.exports = router;
