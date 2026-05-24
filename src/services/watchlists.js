import { apiClient } from './api.js';

export const watchlistService = {
  get: (userId) => apiClient.get(`/users/${userId}/watchlist`),
  remove: (userId, contentId) => apiClient.delete(`/users/${userId}/watchlist/${contentId}`),
};
