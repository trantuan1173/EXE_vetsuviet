import api from './api';

const quizService = {
  getQuizByLesson: (lessonId) => api.get(`/quiz/lesson/${lessonId}`),

  submitQuiz: (quizId, userAnswers) =>
    api.post('/quiz/submit', { quizId, userAnswers }),

  getQuizHistory: () => api.get('/quiz/history'),
};

export default quizService;
