import api from './api';

const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),

  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserDetail: (id) => api.get(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),

  // Courses
  getAllCourses: (params) => api.get('/admin/courses', { params }),
  createCourse: (data) => api.post('/admin/courses', data),
  updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  initCourseVideoUpload: (id, data) => api.post(`/admin/courses/${id}/video/init`, data),
  signCourseVideoPart: (data) => api.post('/admin/courses/video/sign-part', data),
  completeCourseVideoUpload: (id, data) => api.post(`/admin/courses/${id}/video/complete`, data),
  abortCourseVideoUpload: (data) => api.post('/admin/courses/video/abort', data),
  initCourseCoverUpload: (id, data) => api.post(`/admin/courses/${id}/cover/init`, data),
  completeCourseCoverUpload: (id, data) => api.post(`/admin/courses/${id}/cover/complete`, data),
  abortCourseCoverUpload: (data) => api.post('/admin/courses/cover/abort', data),

  // Quizzes
  getAllQuizzes: (params) => api.get('/admin/quizzes', { params }),
  createQuiz: (data) => api.post('/admin/quizzes', data),
  updateQuiz: (id, data) => api.put(`/admin/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),

  // Quiz Excel import/export
  downloadQuizTemplate: () =>
    api.get('/admin/quizzes/template', { responseType: 'blob' }),
  importQuizQuestions: (quizId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/admin/quizzes/${quizId}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Questions
  getQuestionsByQuiz: (quizId) => api.get(`/admin/quizzes/${quizId}/questions`),
  createQuestion: (data) => api.post('/admin/questions', data),
  updateQuestion: (id, data) => api.put(`/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),

  // Products
  getAllProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  // Orders
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
};

export default adminService;
