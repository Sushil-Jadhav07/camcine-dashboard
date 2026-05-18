import { apiClient, ApiError } from './api.js';

const unwrap = (response, fallbackMessage) => {
  if (response?.success === false) {
    throw new ApiError(response.message || fallbackMessage, undefined, response);
  }
  return {
    success: true,
    data: response?.data ?? response,
    message: response?.message,
  };
};

export const viewService = {
  async recordView(data) {
    try {
      return unwrap(await apiClient.post('/views/record', data), 'Failed to record view');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to record view.');
    }
  },

  async getUserPoints(userId) {
    try {
      return unwrap(await apiClient.get(`/views/user/${userId}/points`), 'Failed to fetch user points');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch user points.');
    }
  },

  async getUserHistory(userId) {
    try {
      return unwrap(await apiClient.get(`/views/user/${userId}/history`), 'Failed to fetch user history');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch user history.');
    }
  },

  async getContentStats(contentId) {
    try {
      return unwrap(await apiClient.get(`/views/content/${contentId}/stats`), 'Failed to fetch content stats');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch content stats.');
    }
  },
};
