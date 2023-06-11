import axios from 'axios';

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

export default apiClient;