import { apiClient, ApiError } from './api.js';
import { buildRegisterPayload, normalizeUserFromApi } from './roleMapper.js';

export const authService = {
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', buildRegisterPayload(userData));
      
      if (response.success) {
        return {
          success: true,
          message: response.message,
          data: response.data
        };
      }
      
      throw new ApiError(response.message || 'Registration failed');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Registration failed. Please try again.');
    }
  },

  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        if (token) {
          apiClient.setToken(token);
        }
        
        return {
          success: true,
          message: response.message,
          data: {
            token,
            user: normalizeUserFromApi(user)
          }
        };
      }
      
      throw new ApiError(response.message || 'Login failed');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Login failed. Please try again.');
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      
      if (response.success && response.data) {
        return {
          success: true,
          data: normalizeUserFromApi(response.data.user)
        };
      }
      
      throw new ApiError(response.message || 'Failed to get user data');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to get user data. Please try again.');
    }
  },

  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Password reset token sent to your email'
        };
      }
      
      throw new ApiError(response.message || 'Failed to send reset token');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to send reset token. Please try again.');
    }
  },

  async changePassword(resetToken, newPassword) {
    try {
      const response = await apiClient.post('/auth/change-password', {
        reset_token: resetToken,
        new_password: newPassword
      });
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Password changed successfully'
        };
      }
      
      throw new ApiError(response.message || 'Failed to change password');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to change password. Please try again.');
    }
  },

  logout() {
    apiClient.setToken(null);
    return { success: true, message: 'Logged out successfully' };
  },

  isAuthenticated() {
    return !!apiClient.token;
  },

  getToken() {
    return apiClient.token;
  }
};
