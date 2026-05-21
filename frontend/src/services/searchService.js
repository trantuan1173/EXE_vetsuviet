import api from './api';

const searchService = {
  globalSearch: (q, type) => api.get('/search', { params: { q, type } }),
};

export default searchService;
