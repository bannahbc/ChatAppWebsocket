import axios from 'axios';
import { Base_Url } from './ApiUtils';

export const API = axios.create({
    baseURL: Base_Url + 'api/',
    headers:{
        'Content-Type' : 'application/json'
    },
    timeout:15000
})


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  // alert(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;
      try {
        const newAccess = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
        // Optionally redirect to login
      }
    }

    return Promise.reject(error);
  }
);



// Example of how the refreshAccessToken function should be structured
// Assume your refresh endpoint is at 'api/token/refresh'

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    // No refresh token, force logout (handle this where needed)
    throw new Error('No refresh token available');
  }

  try {
    // Note: Use a plain Axios call here, NOT the 'API' instance,
    // to prevent the interceptor from trying to use a stale access token.
    const response = await axios.post(Base_Url + 'api/token/refresh', {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    
    // Store the new access token
    localStorage.setItem('access', newAccessToken);

    return newAccessToken;

  } catch (error) {
    // If refresh fails (e.g., refresh token is expired/invalid)
    // You should force a full logout here
    localStorage.removeItem('access');
    localStorage.removeItem('refreshToken');
    // window.location.href = '/login'; // Redirect the user

    throw error; // Re-throw the error to be caught by the interceptor
  }
};