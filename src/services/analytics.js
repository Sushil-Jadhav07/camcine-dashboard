import { apiClient } from './api.js';

export const analyticsService = {
  getOverview: (period = '30d') => apiClient.get('/analytics/overview', { period }),
  getActivity: () => apiClient.get('/activity-log'),
};
