import axios from 'axios';
import { handleLogout } from './helpers';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  // console.log('clientApi token: ' + token)
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
    response => {
      return response;
    },
        error => {
      if (error.response && error.response.status === 401) {
        handleLogout();
        window.location = "/";
      } else {
        return Promise.reject(error);
      }
    }
);

export default apiClient;