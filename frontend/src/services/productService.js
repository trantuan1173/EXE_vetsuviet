import api from './api';

const productService = {
  getProducts: (params) => api.get('/products', { params }),

  getProductDetail: (id) => api.get(`/products/${id}`),

  getCategories: () => api.get('/products/categories'),

  getDynasties: () => api.get('/products/dynasties'),

  getCourses: () => api.get('/products/courses'),

  getProductsByCourse: (courseId, limit = 3) => 
    api.get(`/products/course/${courseId}`, { params: { limit } }),
};

export default productService;
