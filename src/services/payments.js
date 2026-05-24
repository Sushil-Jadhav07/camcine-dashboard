import { apiClient } from './api.js';

export const paymentService = {
  getAll: (params) => apiClient.get('/payments', params),
  getStats: () => apiClient.get('/payments/stats'),
  getById: (id) => apiClient.get(`/payments/${id}`),
  refund: (id, data) => apiClient.post(`/payments/refund/${id}`, data),
  export: (params) => apiClient.get('/payments/export', params),
};
