const quizService = require('../services/quizService');
const { sendResponse } = require('../utils/response');

const quizController = {
  // GET /api/quiz/course/:courseId
  getQuizByCourse: async (req, res, next) => {
    try {
      const result = await quizService.getQuizByCourse(req.params.courseId);
      sendResponse(res, 200, true, 'Quiz retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/quiz/lesson/:lessonId
  getQuizByLesson: async (req, res, next) => {
    try {
      const result = await quizService.getQuizByLesson(req.params.lessonId);
      sendResponse(res, 200, true, 'Quiz retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/quiz/submit
  submitQuiz: async (req, res, next) => {
    try {
      const { quizId, userAnswers } = req.body;
      const result = await quizService.submitQuiz(req.user.id, quizId, userAnswers);
      sendResponse(res, 200, true, 'Quiz submitted', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/quiz/history
  getQuizHistory: async (req, res, next) => {
    try {
      const history = await quizService.getUserQuizHistory(req.user.id);
      sendResponse(res, 200, true, 'Quiz history retrieved', history);
    } catch (error) {
      next(error);
    }
  },

  // ---- ADMIN ----
  // GET /api/admin/quizzes
  getAllQuizzes: async (req, res, next) => {
    try {
      const { courseId } = req.query;
      const quizzes = await quizService.getAllQuizzes(courseId);
      sendResponse(res, 200, true, 'Quizzes retrieved', quizzes);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/admin/quizzes
  createQuiz: async (req, res, next) => {
    try {
      const quiz = await quizService.createQuiz(req.body);
      sendResponse(res, 201, true, 'Quiz created', quiz);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/quizzes/:id
  updateQuiz: async (req, res, next) => {
    try {
      const quiz = await quizService.updateQuiz(req.params.id, req.body);
      sendResponse(res, 200, true, 'Quiz updated', quiz);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/admin/quizzes/:id
  deleteQuiz: async (req, res, next) => {
    try {
      await quizService.deleteQuiz(req.params.id);
      sendResponse(res, 200, true, 'Quiz deleted');
    } catch (error) {
      next(error);
    }
  },

  // GET /api/admin/quizzes/:quizId/questions
  getQuestionsByQuiz: async (req, res, next) => {
    try {
      const questions = await quizService.getQuestionsByQuiz(req.params.quizId);
      sendResponse(res, 200, true, 'Questions retrieved', questions);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/admin/questions
  createQuestion: async (req, res, next) => {
    try {
      const question = await quizService.createQuestion(req.body);
      sendResponse(res, 201, true, 'Question created', question);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/questions/:id
  updateQuestion: async (req, res, next) => {
    try {
      const question = await quizService.updateQuestion(req.params.id, req.body);
      sendResponse(res, 200, true, 'Question updated', question);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/admin/questions/:id
  deleteQuestion: async (req, res, next) => {
    try {
      await quizService.deleteQuestion(req.params.id);
      sendResponse(res, 200, true, 'Question deleted');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = quizController;
