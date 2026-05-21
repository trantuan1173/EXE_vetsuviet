import api from './api';

const userService = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data) => api.put('/users/profile', data),

  changePassword: (currentPassword, newPassword) =>
    api.post('/users/change-password', { currentPassword, newPassword }),

  getQuizHistory: () => api.get('/users/quiz-history'),

  getXPHistory: () => api.get('/users/xp-history'),
};

export default userService;
