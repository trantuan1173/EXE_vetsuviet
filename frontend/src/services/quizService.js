import api from './api';

const quizService = {
  getQuizByCourse: (courseId) => api.get(`/quiz/course/${courseId}`),

  submitQuiz: (quizId, userAnswers) =>
    api.post('/quiz/submit', { quizId, userAnswers }),

  getQuizHistory: () => api.get('/quiz/history'),
};

export default quizService;
