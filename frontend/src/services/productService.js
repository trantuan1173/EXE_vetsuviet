import api from './api';

const productService = {
  getProducts: (params) => api.get('/products', { params }),

  getProductDetail: (id) => api.get(`/products/${id}`),

  getCategories: () => api.get('/products/categories'),
};

export default productService;
