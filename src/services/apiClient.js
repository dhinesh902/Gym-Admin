import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gym_auth_token');
      localStorage.removeItem('gym_auth_user');
      window.dispatchEvent(new Event('gym-auth-expired'));
    }
    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => (
  error.response?.data?.message || error.response?.data?.error || error.message || fallback
);

export default apiClient;
