import { apiClient } from './api.js';

export const settingsService = {
  get: () => apiClient.get('/settings'),
  update: (data) => apiClient.put('/settings', data),
};
