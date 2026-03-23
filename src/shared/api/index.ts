import axios from 'axios';

// Базовый клиент с настроенным BaseURL
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления авторизационного токена
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
