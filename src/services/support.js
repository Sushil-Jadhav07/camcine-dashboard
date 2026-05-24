import { apiClient } from './api.js';

export const supportService = {
  getAll: (params) => apiClient.get('/support/tickets', params),
  getById: (id) => apiClient.get(`/support/tickets/${id}`),
  reply: (id, data) => apiClient.post(`/support/tickets/${id}/reply`, data),
  updateStatus: (id, data) => apiClient.put(`/support/tickets/${id}`, data),
};
