import { apiClient } from './api.js';

export const notificationService = {
  getAll: (params) => apiClient.get('/notifications', params),
  markRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAll: () => apiClient.patch('/notifications/read-all'),
  remove: (id) => apiClient.delete(`/notifications/${id}`),
};
