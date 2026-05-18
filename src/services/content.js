import { apiClient, ApiError } from './api.js';

const endpointCache = new Map();

const routeByType = {
  movie: '/movies',
  short_film: '/movies',
  news: '/movies',
  song: '/songs',
  show: '/episodes',
  series: '/episodes',
};

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

const asArray = value => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

const getId = item => item?.id || item?._id || item?.movie_id || item?.song_id || item?.series_id;

const endpointForType = type => routeByType[type] || '/movies';

const registerEndpoint = (item, endpoint) => {
  const id = getId(item);
  if (id) endpointCache.set(id, endpoint);
};

const normalizePagination = (data, fallbackTotal) => {
  const pagination = data?.pagination || data?.meta || {};
  return {
    page: Number(pagination.page || pagination.current_page || 1),
    limit: Number(pagination.limit || pagination.per_page || fallbackTotal || 20),
    total: Number(pagination.total || pagination.count || fallbackTotal || 0),
    total_pages: Number(pagination.total_pages || pagination.pages || 1),
  };
};

const listFromData = data => {
  if (Array.isArray(data)) return data;
  if (!data) return [];
  return (
    data.content ||
    data.movies ||
    data.songs ||
    data.series ||
    data.episodes ||
    data.items ||
    data.results ||
    data.data ||
    []
  );
};

const normalizeItem = (item, type, endpoint) => {
  const normalized = {
    ...item,
    id: getId(item),
    type: item?.type || type,
    title: item?.title || item?.song_name || item?.series_name,
  };

  if (type === 'show' || endpoint === '/episodes') {
    normalized.type = 'show';
  }
  if (type === 'song' || endpoint === '/songs') {
    normalized.type = 'song';
  }
  if (!normalized.status) {
    normalized.status = normalized.is_published === false ? 'draft' : 'published';
  }

  registerEndpoint(normalized, endpoint);
  return normalized;
};

const normalizeListResponse = (rawData, type, endpoint) => {
  const list = listFromData(rawData).map(item => normalizeItem(item, type, endpoint));
  return {
    content: list,
    pagination: normalizePagination(rawData, list.length),
  };
};

const mergeListResponses = responses => {
  const content = responses.flatMap(response => response.data?.content || []);
  return {
    content,
    pagination: {
      page: 1,
      limit: content.length,
      total: content.length,
      total_pages: 1,
    },
  };
};

const getEndpointForId = async id => {
  if (endpointCache.has(id)) return endpointCache.get(id);

  const candidates = ['/movies', '/songs', '/episodes'];
  for (const endpoint of candidates) {
    try {
      const response = unwrap(await apiClient.get(`${endpoint}/${id}`), 'Content not found');
      const type = endpoint === '/songs' ? 'song' : endpoint === '/episodes' ? 'show' : 'movie';
      registerEndpoint(normalizeItem(normalizeDetail(response.data, type, endpoint), type, endpoint), endpoint);
      return endpoint;
    } catch (error) {
      if (error instanceof ApiError && error.status && error.status !== 404) throw error;
    }
  }

  throw new ApiError('Content not found');
};

const normalizeDetail = (data, type, endpoint) => {
  const item = data?.content || data?.movie || data?.song || data?.series || data?.item || data;
  return normalizeItem(item, type, endpoint);
};

const authHeaders = () => {
  const headers = {};
  if (apiClient.token) headers.Authorization = `Bearer ${apiClient.token}`;
  return headers;
};

const uploadFile = async (endpoint, formData, fallbackMessage) => {
  try {
    const res = await fetch(`${apiClient.baseURL}${endpoint}`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      const message = res.status === 413
        ? 'Upload was rejected by the API server because the request body is too large.'
        : data.message || fallbackMessage;
      throw new ApiError(message, res.status, data);
    }
    return { success: true, data: data.data ?? data, message: data.message };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      'Upload failed. The request may be blocked by CORS or rejected by the API server.',
      0
    );
  }
};

const mimeFromFile = file => {
  if (file?.type) return file.type;
  const extension = file?.name?.split('.').pop()?.toLowerCase();
  const byExtension = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
    avi: 'video/x-msvideo',
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    wav: 'audio/wav',
    flac: 'audio/flac',
    ogg: 'audio/ogg',
    lrc: 'text/plain',
    vtt: 'text/vtt',
    txt: 'text/plain',
    srt: 'text/plain',
  };
  return byExtension[extension] || 'application/octet-stream';
};

const uploadToDirectUrl = (uploadUrl, file, mimeType, onProgress) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', uploadUrl);
  xhr.setRequestHeader('Content-Type', mimeType);
  xhr.upload.onprogress = event => {
    if (event.lengthComputable && onProgress) {
      onProgress(Math.round((event.loaded / event.total) * 100));
    }
  };
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      if (onProgress) onProgress(100);
      resolve();
      return;
    }
    reject(new ApiError(`Direct upload failed with status ${xhr.status}.`, xhr.status));
  };
  xhr.onerror = () => reject(new ApiError(
    'Direct upload failed. Check Google Cloud Storage CORS settings for this bucket.',
    0
  ));
  xhr.send(file);
});

const directUploadEndpointFor = contentType => {
  if (contentType === 'song') return '/songs/upload/direct-url';
  if (contentType === 'show' || contentType === 'series') return '/episodes/upload/direct-url';
  return '/movies/upload/direct-url';
};

const findUrl = value => {
  if (!value) return '';
  if (typeof value === 'string') return /^https?:\/\//.test(value) || value.startsWith('/') ? value : '';
  if (Array.isArray(value)) {
    return value.map(findUrl).find(Boolean) || '';
  }
  if (typeof value === 'object') {
    const direct =
      value.url ||
      value.file_url ||
      value.fileUrl ||
      value.secure_url ||
      value.location ||
      value.path ||
      value.thumbnail_url ||
      value.poster_url ||
      value.trailer_url ||
      value.video_url;
    if (direct) return findUrl(direct);
    return Object.values(value).map(findUrl).find(Boolean) || '';
  }
  return '';
};

const withoutClientOnlyFields = (data = {}) => {
  const payload = { ...data };
  delete payload.id;
  delete payload._id;
  delete payload.type;
  Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
  return payload;
};

const payloadForEndpoint = (data = {}, endpoint) => {
  const payload = withoutClientOnlyFields(data);

  if (endpoint === '/songs') {
    if (data.title && !payload.song_name) payload.song_name = data.title;
    delete payload.title;
  }

  if (endpoint === '/episodes') {
    if (data.title && !payload.series_name) payload.series_name = data.title;
    delete payload.title;
    if (data.type === 'short_film') payload.type = 'short_film';
  }

  return payload;
};

export const contentService = {
  async getContent(params = {}) {
    try {
      const { type, ...rest } = params;
      if (type) {
        const endpoint = endpointForType(type);
        const response = unwrap(await apiClient.get(endpoint, rest), 'Failed to fetch content');
        return { success: true, data: normalizeListResponse(response.data, type, endpoint), message: response.message };
      }

      const responses = await Promise.all(
        [
          ['movie', '/movies'],
          ['show', '/episodes'],
          ['song', '/songs'],
        ].map(async ([itemType, endpoint]) => {
          const response = unwrap(await apiClient.get(endpoint, rest), 'Failed to fetch content');
          return { success: true, data: normalizeListResponse(response.data, itemType, endpoint) };
        })
      );

      return { success: true, data: mergeListResponses(responses) };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch content. Please try again.');
    }
  },

  async getStats() {
    try {
      const response = await this.getContent({ limit: 50 });
      const items = response.data.content || [];
      return {
        success: true,
        data: {
          total: items.length,
          movies: items.filter(item => item.type === 'movie').length,
          shows: items.filter(item => item.type === 'show').length,
          songs: items.filter(item => item.type === 'song').length,
          published: items.filter(item => item.status === 'published').length,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch stats.');
    }
  },

  async getContentById(id) {
    try {
      const endpoint = await getEndpointForId(id);
      const type = endpoint === '/songs' ? 'song' : endpoint === '/episodes' ? 'show' : 'movie';
      const response = unwrap(await apiClient.get(`${endpoint}/${id}`), 'Content not found');
      return { success: true, data: normalizeDetail(response.data, type, endpoint), message: response.message };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch content item.');
    }
  },

  async createContent(data) {
    try {
      const endpoint = endpointForType(data.type);
      const response = unwrap(await apiClient.post(endpoint, payloadForEndpoint(data, endpoint)), 'Failed to create content');
      const normalized = normalizeDetail(response.data, data.type || 'movie', endpoint);
      registerEndpoint(normalized, endpoint);
      return { success: true, data: { content: normalized, ...response.data }, message: response.message };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create content.');
    }
  },

  async updateContent(id, data) {
    try {
      const endpoint = data?.type ? endpointForType(data.type) : await getEndpointForId(id);
      const response = unwrap(await apiClient.put(`${endpoint}/${id}`, payloadForEndpoint(data, endpoint)), 'Failed to update content');
      const type = data?.type || (endpoint === '/songs' ? 'song' : endpoint === '/episodes' ? 'show' : 'movie');
      const normalized = normalizeDetail(response.data, type, endpoint);
      registerEndpoint(normalized, endpoint);
      return { success: true, data: normalized, message: response.message };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update content.');
    }
  },

  async updateStatus(id, status) {
    try {
      const endpoint = await getEndpointForId(id);
      if (endpoint !== '/movies') {
        return this.updateContent(id, { status });
      }
      return unwrap(await apiClient.patch(`/movies/${id}/status`, { status }), 'Failed to update status');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update status.');
    }
  },

  async archiveContent(id) {
    try {
      const endpoint = await getEndpointForId(id);
      return unwrap(await apiClient.delete(`${endpoint}/${id}`), 'Failed to delete content');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete content.');
    }
  },

  async getEpisodes(seriesId, params = {}) {
    try {
      const response = unwrap(await apiClient.get(`/episodes/${seriesId}`, params), 'Failed to fetch episodes');
      const series = normalizeDetail(response.data, 'show', '/episodes');
      const episodes = asArray(response.data?.episodes || response.data?.series?.episodes || series.episodes);
      return { success: true, data: { series, episodes }, message: response.message };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch episodes.');
    }
  },

  async addEpisode(seriesId, data) {
    try {
      return unwrap(await apiClient.post(`/episodes/${seriesId}/episode`, data), 'Failed to add episode');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to add episode.');
    }
  },

  async addEpisodeWithUploads(seriesId, data, files = {}, onProgress) {
    const uploaded = {};
    if (files.thumbnail) {
      const thumbnail = await this.directUpload(files.thumbnail, 'thumbnail', 'show', progress => onProgress?.('thumbnail', progress));
      uploaded.thumbnail_url = thumbnail.url;
    }
    if (files.video) {
      const video = await this.directUpload(files.video, 'video', 'show', progress => onProgress?.('video', progress));
      uploaded.video_url = video.url;
    }
    return this.addEpisode(seriesId, { ...data, ...uploaded });
  },

  async getEpisode(seriesId, episodeId) {
    const response = await this.getEpisodes(seriesId);
    const episode = asArray(response.data.episodes).find(item => getId(item) === episodeId);
    if (!episode) throw new ApiError('Episode not found');
    return { success: true, data: episode };
  },

  async updateEpisode(seriesId, episodeId, data) {
    try {
      return unwrap(await apiClient.put(`/episodes/${seriesId}/episode/${episodeId}`, data), 'Failed to update episode');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update episode.');
    }
  },

  async deleteEpisode(seriesId, episodeId) {
    try {
      return unwrap(await apiClient.delete(`/episodes/${seriesId}/episode/${episodeId}`), 'Failed to delete episode');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete episode.');
    }
  },

  async getCast(contentId) {
    try {
      // Backend returns cast as part of the content detail
      const detail = await this.getContentById(contentId);
      return { success: true, data: asArray(detail.data?.cast) };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch cast.');
    }
  },

  async addCastMember(contentId, type, castData) {
    try {
      const endpoint = endpointForType(type);
      return unwrap(await apiClient.post(`${endpoint}/${contentId}/cast`, castData), 'Failed to add cast member');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to add cast member.');
    }
  },

  async addCastBulk(contentId, type, castArray) {
    try {
      if (type !== 'movie') throw new ApiError('Bulk cast upload is only supported for movies.');
      return unwrap(await apiClient.post(`/movies/${contentId}/cast/bulk`, { cast: castArray }), 'Failed to add bulk cast');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to add bulk cast.');
    }
  },

  async updateCastMember(contentId, type, castId, castData) {
    try {
      if (type !== 'movie') throw new ApiError('Cast update is only supported for movies.');
      return unwrap(await apiClient.put(`/movies/${contentId}/cast/${castId}`, castData), 'Failed to update cast member');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update cast member.');
    }
  },

  async deleteCastMember(contentId, type, castId) {
    try {
      const endpoint = endpointForType(type);
      return unwrap(await apiClient.delete(`${endpoint}/${contentId}/cast/${castId}`), 'Failed to delete cast member');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete cast member.');
    }
  },

  async attachMediaUrls(id, mediaUrls) {
    const payload = withoutClientOnlyFields(mediaUrls);
    if (!Object.keys(payload).length) return { success: true, data: null };

    try {
      return await this.updateContent(id, payload);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to attach uploaded media URLs.');
    }
  },

  async directUpload(file, uploadType, contentType = 'movie', onProgress) {
    try {
      const endpoint = directUploadEndpointFor(contentType);
      const mimeType = mimeFromFile(file);
      const signed = unwrap(await apiClient.post(endpoint, {
        file_name: file.name,
        mime_type: mimeType,
        upload_type: uploadType,
      }), 'Failed to create upload URL');
      const data = signed.data;
      if (!data?.upload_url || !data?.public_url) {
        throw new ApiError('Upload URL response was missing required fields.');
      }
      await uploadToDirectUrl(data.upload_url, file, data.mime_type || mimeType, onProgress);
      return { success: true, data, url: data.public_url };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Direct upload failed.');
    }
  },

  async uploadImage(file, contentId, contentType = 'movie', onProgress) {
    try {
      return await this.directUpload(file, 'thumbnail', contentType, onProgress);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Thumbnail upload failed.');
    }
  },

  async uploadImageViaApi(file, contentId, contentType = 'movie') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const endpoint = contentType === 'song'
        ? '/songs/upload/thumbnail'
        : contentType === 'show' || contentType === 'series'
          ? '/episodes/upload/thumbnail'
          : '/movies/upload/thumbnail';

      if (contentId) {
        if (endpoint.startsWith('/songs')) formData.append('song_id', contentId);
        else if (endpoint.startsWith('/episodes')) formData.append('series_id', contentId);
        else formData.append('content_id', contentId);
      }

      const response = await uploadFile(endpoint, formData, 'Thumbnail upload failed');
      return { ...response, url: findUrl(response.data) };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Thumbnail upload failed.');
    }
  },

  async uploadVideo(file, contentId, contentType = 'movie', onProgress) {
    try {
      if (contentType !== 'movie') {
        throw new ApiError('Full video upload is only available for movies from this form.');
      }
      return await this.directUpload(file, 'video', contentType, onProgress);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Video upload failed.');
    }
  },

  async uploadVideoViaApi(file, contentId, contentType = 'movie') {
    try {
      if (contentType !== 'movie') {
        throw new ApiError('Full video upload is only available for movies from this form.');
      }
      const formData = new FormData();
      formData.append('file', file);
      if (contentId) formData.append('content_id', contentId);
      const response = await uploadFile('/movies/upload/video', formData, 'Video upload failed');
      return { ...response, url: findUrl(response.data) };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Video upload failed.');
    }
  },

  async uploadTrailer(file, contentId, contentType = 'movie', onProgress) {
    try {
      if (contentType === 'song') {
        throw new ApiError('Trailer upload is not available for songs.');
      }
      return await this.directUpload(file, 'trailer', contentType, onProgress);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Trailer upload failed.');
    }
  },

  async uploadTrailerViaApi(file, contentId, contentType = 'movie') {
    try {
      if (contentType === 'song') {
        throw new ApiError('Trailer upload is not available for songs.');
      }
      const formData = new FormData();
      formData.append('file', file);
      const endpoint = contentType === 'show' || contentType === 'series'
        ? '/episodes/upload/trailer'
        : '/movies/upload/trailer';

      if (contentId) {
        if (endpoint.startsWith('/episodes')) formData.append('series_id', contentId);
        else formData.append('content_id', contentId);
      }

      const response = await uploadFile(endpoint, formData, 'Trailer upload failed');
      return { ...response, url: findUrl(response.data) };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Trailer upload failed.');
    }
  },

  async uploadAudio(fileHq, fileLq, songId, onProgress) {
    try {
      const mediaUrls = {};
      if (fileHq) {
        const hq = await this.directUpload(fileHq, 'audio', 'song', progress => onProgress?.('audio_hq', progress));
        mediaUrls.audio_url_hq = hq.url;
      }
      if (fileLq) {
        const lq = await this.directUpload(fileLq, 'audio_lq', 'song', progress => onProgress?.('audio_lq', progress));
        mediaUrls.audio_url_lq = lq.url;
      }
      if (!Object.keys(mediaUrls).length) throw new ApiError('At least one audio file is required.');
      await this.updateContent(songId, { type: 'song', ...mediaUrls });
      return { success: true, data: mediaUrls, ...mediaUrls };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Audio upload failed.');
    }
  },

  async uploadLyrics(file, songId, onProgress) {
    try {
      const lyrics = await this.directUpload(file, 'lyrics', 'song', progress => onProgress?.('lyrics', progress));
      await this.updateContent(songId, { type: 'song', lyrics_url: lyrics.url });
      return lyrics;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Lyrics upload failed.');
    }
  },

  async getMyUploads() {
    return { success: true, data: { uploads: [], pagination: { total: 0 } } };
  },

  async deleteUpload() {
    throw new ApiError('Upload deletion API is not present in Camcine_API_Documentation.md.');
  },
};
