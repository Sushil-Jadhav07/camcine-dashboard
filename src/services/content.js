import { apiClient, ApiError } from './api.js';

const unwrap = (response, fallbackMessage) => {
  if (response?.success) {
    return { success: true, data: response.data, message: response.message };
  }
  throw new ApiError(response?.message || fallbackMessage);
};

const authHeaders = () => {
  const headers = {};
  if (apiClient.token) headers.Authorization = `Bearer ${apiClient.token}`;
  return headers;
};

const uploadFile = async (endpoint, formData, fallbackMessage) => {
  const res = await fetch(`${apiClient.baseURL}${endpoint}`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new ApiError(data.message || fallbackMessage, res.status, data);
  }
  return { success: true, data: data.data, message: data.message };
};

export const contentService = {
  async getContent(params = {}) {
    try {
      return unwrap(await apiClient.get('/content', params), 'Failed to fetch content');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch content. Please try again.');
    }
  },

  async getStats() {
    try {
      return unwrap(await apiClient.get('/content/stats'), 'Failed to fetch stats');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch stats.');
    }
  },

  async getContentById(id) {
    try {
      return unwrap(await apiClient.get(`/content/${id}`), 'Content not found');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch content item.');
    }
  },

  async createContent(data) {
    try {
      return unwrap(await apiClient.post('/content', data), 'Failed to create content');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create content.');
    }
  },

  async updateContent(id, data) {
    try {
      return unwrap(await apiClient.put(`/content/${id}`, data), 'Failed to update content');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update content.');
    }
  },

  async updateStatus(id, status) {
    try {
      return unwrap(await apiClient.patch(`/content/${id}/status`, { status }), 'Failed to update status');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update status.');
    }
  },

  async archiveContent(id) {
    try {
      return unwrap(await apiClient.delete(`/content/${id}`), 'Failed to archive content');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to archive content.');
    }
  },

  async getEpisodes(contentId, params = {}) {
    try {
      return unwrap(await apiClient.get(`/content/${contentId}/episodes`, params), 'Failed to fetch episodes');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch episodes.');
    }
  },

  async addEpisode(contentId, data) {
    try {
      return unwrap(await apiClient.post(`/content/${contentId}/episodes`, data), 'Failed to add episode');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to add episode.');
    }
  },

  async getEpisode(contentId, episodeId) {
    try {
      return unwrap(await apiClient.get(`/content/${contentId}/episodes/${episodeId}`), 'Failed to fetch episode');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch episode.');
    }
  },

  async updateEpisode(contentId, episodeId, data) {
    try {
      return unwrap(await apiClient.put(`/content/${contentId}/episodes/${episodeId}`, data), 'Failed to update episode');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update episode.');
    }
  },

  async deleteEpisode(contentId, episodeId) {
    try {
      return unwrap(await apiClient.delete(`/content/${contentId}/episodes/${episodeId}`), 'Failed to delete episode');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete episode.');
    }
  },

  async getCast(contentId) {
    try {
      return unwrap(await apiClient.get(`/content/${contentId}/cast`), 'Failed to fetch cast');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch cast.');
    }
  },

  async addCastMember(contentId, castMember) {
    try {
      return unwrap(await apiClient.post(`/content/${contentId}/cast`, castMember), 'Failed to add cast member');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to add cast member.');
    }
  },

  async addCastBulk(contentId, cast) {
    try {
      return unwrap(await apiClient.post(`/content/${contentId}/cast/bulk`, { cast }), 'Failed to add cast');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to add cast.');
    }
  },

  async updateCastMember(contentId, castId, castMember) {
    try {
      return unwrap(await apiClient.put(`/content/${contentId}/cast/${castId}`, castMember), 'Failed to update cast member');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update cast member.');
    }
  },

  async deleteCastMember(contentId, castId) {
    try {
      return unwrap(await apiClient.delete(`/content/${contentId}/cast/${castId}`), 'Failed to delete cast member');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete cast member.');
    }
  },

  async uploadImage(file, linkedToId, linkedToType, purpose, autoUpdate = true) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (linkedToId) formData.append('linked_to_id', linkedToId);
      if (linkedToType) formData.append('linked_to_type', linkedToType);
      if (purpose) formData.append('image_purpose', purpose);
      formData.append('auto_update', autoUpdate ? 'true' : 'false');
      return uploadFile('/upload/image', formData, 'Image upload failed');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Image upload failed.');
    }
  },

  async uploadVideo(file, linkedToId, linkedToType, autoUpdate = true) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (linkedToId) formData.append('linked_to_id', linkedToId);
      if (linkedToType) formData.append('linked_to_type', linkedToType);
      formData.append('auto_update', autoUpdate ? 'true' : 'false');
      return uploadFile('/upload/video', formData, 'Video upload failed');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Video upload failed.');
    }
  },

  async uploadTrailer(file, linkedToId, autoUpdate = true) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (linkedToId) formData.append('linked_to_id', linkedToId);
      formData.append('auto_update', autoUpdate ? 'true' : 'false');
      return uploadFile('/upload/trailer', formData, 'Trailer upload failed');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Trailer upload failed.');
    }
  },

  async uploadAudio(file, linkedToId, linkedToType = 'content', autoUpdate = true) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (linkedToId) formData.append('linked_to_id', linkedToId);
      if (linkedToType) formData.append('linked_to_type', linkedToType);
      formData.append('auto_update', autoUpdate ? 'true' : 'false');
      return uploadFile('/upload/audio', formData, 'Audio upload failed');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Audio upload failed.');
    }
  },

  async uploadLyrics(file, linkedToId, linkedToType = 'content', autoUpdate = true) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (linkedToId) formData.append('linked_to_id', linkedToId);
      if (linkedToType) formData.append('linked_to_type', linkedToType);
      formData.append('auto_update', autoUpdate ? 'true' : 'false');
      return uploadFile('/upload/lyrics', formData, 'Lyrics upload failed');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Lyrics upload failed.');
    }
  },

  async getMyUploads(params = {}) {
    try {
      return unwrap(await apiClient.get('/upload/my-uploads', params), 'Failed to fetch uploads');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch uploads.');
    }
  },

  async deleteUpload(uploadId) {
    try {
      return unwrap(await apiClient.delete(`/upload/${uploadId}`), 'Failed to delete upload');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete upload.');
    }
  },
};
