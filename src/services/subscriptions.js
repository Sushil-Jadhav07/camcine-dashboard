import { apiClient } from './api.js';

export const subscriptionService = {
  getPlans: () => apiClient.get('/subscriptions/plans'),
  getAll: (params) => apiClient.get('/subscriptions', params),
  getStats: () => apiClient.get('/subscriptions/stats'),
  cancel: (id) => apiClient.patch(`/subscriptions/${id}/cancel`),
  pause: (id) => apiClient.patch(`/subscriptions/${id}/pause`),
  resume: (id) => apiClient.patch(`/subscriptions/${id}/resume`),
};
