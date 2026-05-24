import { apiClient } from './api.js';

export const actorService = {
  getAll: (params) => apiClient.get('/actors', params),
  getById: (id) => apiClient.get(`/actors/${id}`),
  getFilmography: (id) => apiClient.get(`/actors/${id}/filmography`),
  update: (id, data) => apiClient.put(`/actors/${id}`, data),
};
