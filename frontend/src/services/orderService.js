import api from './api';

const orderService = {
  createOrder: (data) => api.post('/orders', data),

  getUserOrders: () => api.get('/orders'),

  getOrderDetail: (id) => api.get(`/orders/${id}`),

  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

export default orderService;
