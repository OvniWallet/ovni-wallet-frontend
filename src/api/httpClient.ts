import axios from 'axios';
import { ENV } from '../config/env';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { createRefreshInterceptor } from './sessionRefresh';

export const httpClient = axios.create({
  // Dejamos únicamente ENV.API_URL ya que tu entorno ya cuenta con el prefijo /api/v1
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  createRefreshInterceptor(httpClient, {
    getRefreshToken: () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
    refresh: async (refreshToken) => {
      const response = await httpClient.post('/auth/refresh', { refresh_token: refreshToken });
      return response.data.data;
    },
    storeTokens: (tokens) => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
    },
    onRefreshFailed: () => {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.assign('/login');
    },
  }),
);