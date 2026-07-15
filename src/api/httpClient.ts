import axios from 'axios';
import { ENV } from '../config/env';

export const httpClient = axios.create({
  // Dejamos únicamente ENV.API_URL ya que tu entorno ya cuenta con el prefijo /api/v1
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);