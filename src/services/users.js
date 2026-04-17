import { apiClient, ApiError } from './api.js';
import { buildUserUpdatePayload, mapRoleToApi, normalizeUserFromApi, normalizeUsersFromApi } from './roleMapper.js';

export const userService = {
  async getAllUsers(params = {}) {
    try {
      const response = await apiClient.get('/users', params);
      
      if (response.success) {
        const users = response.data?.users ? normalizeUsersFromApi(response.data.users) : normalizeUsersFromApi(response.data);
        return {
          success: true,
          data: response.data?.users
            ? { ...response.data, users }
            : users
        };
      }
      
      throw new ApiError(response.message || 'Failed to fetch users');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch users. Please try again.');
    }
  },

  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      
      if (response.success) {
        return {
          success: true,
          data: normalizeUserFromApi(response.data?.user || response.data)
        };
      }
      
      throw new ApiError(response.message || 'Failed to fetch user');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch user. Please try again.');
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/users/${userId}`, buildUserUpdatePayload(userData));
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'User updated successfully',
          data: normalizeUserFromApi(response.data?.user || response.data)
        };
      }
      
      throw new ApiError(response.message || 'Failed to update user');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update user. Please try again.');
    }
  },

  async deactivateUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'User deactivated successfully'
        };
      }
      
      throw new ApiError(response.message || 'Failed to deactivate user');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to deactivate user. Please try again.');
    }
  },

  async getUsersByRole(role, params = {}) {
    try {
      const response = await apiClient.get('/users', { ...params, role: mapRoleToApi(role) });
      
      if (response.success) {
        const users = response.data?.users ? normalizeUsersFromApi(response.data.users) : normalizeUsersFromApi(response.data);
        return {
          success: true,
          data: response.data?.users
            ? { ...response.data, users }
            : users
        };
      }
      
      throw new ApiError(response.message || 'Failed to fetch users by role');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch users by role. Please try again.');
    }
  },

  async searchUsers(query, params = {}) {
    try {
      const response = await apiClient.get('/users', { ...params, search: query });
      
      if (response.success) {
        const users = response.data?.users ? normalizeUsersFromApi(response.data.users) : normalizeUsersFromApi(response.data);
        return {
          success: true,
          data: response.data?.users
            ? { ...response.data, users }
            : users
        };
      }
      
      throw new ApiError(response.message || 'Failed to search users');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to search users. Please try again.');
    }
  }
};
