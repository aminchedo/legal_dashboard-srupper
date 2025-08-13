import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types';

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.request(config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  private handleError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const message = (error.response.data as any)?.message || error.message;
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error - please check your connection');
    } else {
      // Something else happened
      return new Error(error.message);
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// API endpoint functions
export const endpoints = {
  // Authentication
  auth: {
    login: (data: { email: string; password: string }) =>
      apiClient.post('/auth/login', data),
    logout: () => apiClient.post('/auth/logout'),
    refresh: () => apiClient.post('/auth/refresh'),
    profile: () => apiClient.get('/auth/profile'),
  },

  // Documents
  documents: {
    list: (params?: any) => apiClient.get('/documents', { params }),
    get: (id: string) => apiClient.get(`/documents/${id}`),
    create: (data: FormData) => apiClient.post('/documents', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id: string, data: any) => apiClient.put(`/documents/${id}`, data),
    delete: (id: string) => apiClient.delete(`/documents/${id}`),
    process: (id: string) => apiClient.post(`/documents/${id}/process`),
    download: (id: string) => apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob'
    }),
    export: (params?: any) => apiClient.get('/documents/export', { params }),
  },

  // Analytics
  analytics: {
    dashboard: () => apiClient.get('/analytics/dashboard'),
    documents: (params?: any) => apiClient.get('/analytics/documents', { params }),
    jobs: (params?: any) => apiClient.get('/analytics/jobs', { params }),
    proxies: (params?: any) => apiClient.get('/analytics/proxies', { params }),
    trends: (params?: any) => apiClient.get('/analytics/trends', { params }),
    export: (type: string, params?: any) => apiClient.get(`/analytics/export/${type}`, { params }),
  },

  // Scraping Jobs
  jobs: {
    list: (params?: any) => apiClient.get('/scraping/jobs', { params }),
    get: (id: string) => apiClient.get(`/scraping/jobs/${id}`),
    create: (data: any) => apiClient.post('/scraping/jobs', data),
    update: (id: string, data: any) => apiClient.put(`/scraping/jobs/${id}`, data),
    delete: (id: string) => apiClient.delete(`/scraping/jobs/${id}`),
    start: (id: string) => apiClient.post(`/scraping/jobs/${id}/start`),
    stop: (id: string) => apiClient.post(`/scraping/jobs/${id}/stop`),
    pause: (id: string) => apiClient.post(`/scraping/jobs/${id}/pause`),
    resume: (id: string) => apiClient.post(`/scraping/jobs/${id}/resume`),
    logs: (id: string, params?: any) => apiClient.get(`/scraping/jobs/${id}/logs`, { params }),
    results: (id: string, params?: any) => apiClient.get(`/scraping/jobs/${id}/results`, { params }),
  },

  // Proxies
  proxies: {
    list: (params?: any) => apiClient.get('/proxies', { params }),
    get: (id: string) => apiClient.get(`/proxies/${id}`),
    create: (data: any) => apiClient.post('/proxies', data),
    update: (id: string, data: any) => apiClient.put(`/proxies/${id}`, data),
    delete: (id: string) => apiClient.delete(`/proxies/${id}`),
    test: (id: string) => apiClient.post(`/proxies/${id}/test`),
    health: () => apiClient.get('/proxies/health'),
    rotate: () => apiClient.post('/proxies/rotate'),
    analytics: (id?: string) => apiClient.get(`/proxies/analytics${id ? `/${id}` : ''}`),
  },

  // System Health
  system: {
    health: () => apiClient.get('/system/health'),
    metrics: (params?: any) => apiClient.get('/system/metrics', { params }),
    logs: (params?: any) => apiClient.get('/system/logs', { params }),
    alerts: () => apiClient.get('/system/alerts'),
    acknowledgeAlert: (id: string) => apiClient.patch(`/system/alerts/${id}/acknowledge`),
    services: () => apiClient.get('/system/services'),
    restart: (service: string) => apiClient.post(`/system/services/${service}/restart`),
  },

  // Settings
  settings: {
    user: () => apiClient.get('/settings/user'),
    updateUser: (data: any) => apiClient.put('/settings/user', data),
    system: () => apiClient.get('/settings/system'),
    updateSystem: (data: any) => apiClient.put('/settings/system', data),
  },

  // Help & Documentation
  help: {
    search: (query: string) => apiClient.get('/help/search', { params: { q: query } }),
    article: (id: string) => apiClient.get(`/help/articles/${id}`),
    categories: () => apiClient.get('/help/categories'),
  },

  // Recording & Data
  recording: {
    start: (config: any) => apiClient.post('/recording/start', config),
    stop: (id: string) => apiClient.post(`/recording/${id}/stop`),
    list: (params?: any) => apiClient.get('/recording', { params }),
    get: (id: string) => apiClient.get(`/recording/${id}`),
    delete: (id: string) => apiClient.delete(`/recording/${id}`),
  },

  data: {
    export: (type: string, params?: any) => apiClient.get(`/data/export/${type}`, { params }),
    import: (data: FormData) => apiClient.post('/data/import', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    tables: () => apiClient.get('/data/tables'),
    query: (sql: string) => apiClient.post('/data/query', { sql }),
  },
};

export default apiClient;