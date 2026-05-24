import { apiClient } from './api.js';

export const newsService = {
  getAll: (params) => apiClient.get('/news', params),
  getById: (id) => apiClient.get(`/news/${id}`),
  create: (data) => apiClient.post('/news', data),
  update: (id, data) => apiClient.put(`/news/${id}`, data),
  publish: (id) => apiClient.patch(`/news/${id}/publish`),
  remove: (id) => apiClient.delete(`/news/${id}`),
};
