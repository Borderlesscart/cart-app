import axios from 'axios';
import { useNotificationStore } from '#imports';

export const API = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: false,
  });

  API.interceptors.request.use(
    (request) => {
      // automatically set token in axios default header
      const jwtToken = useCookie('jwtToken')
  
      if (jwtToken) {
        request.headers.authorization = 'Bearer ' + jwtToken;
      }
      // Important: request interceptors **must** return the request.
      return request;
    },
    (err) => {
        const notificationStore = useNotificationStore()
        const errorMessage =
                err?.response?.data?.message ||
                err?.response?.message ||
                err?.toString()
        notificationStore.updateError(errorMessage)
    }
  );
  
  API.interceptors.response.use(
    (response: any) => {
      return response?.data;
    },
    (err) => {
      const originalRequest = err.config;
      const notificationStore = useNotificationStore()

      if (err?.response?.status === 404) {
        notificationStore.updateError(err.response?.data?.message || `${err.config.url} not found`)
      } else if (err?.response?.status === 403) {
        notificationStore.updateError(`Permission Error`)
      } else if (err?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        notificationStore.updateError(`user authentication invalid/expired: redirecting to login...`)
        //Check if router is currently in client-portal
        const path = location.pathname.split('/')[1];
  
          localStorage.removeItem('user');
          localStorage.removeItem('token');  
  
        // return router.go(0); // refresh page and auto-redirect to login
      } else {
        const errorMessage =
                err?.response?.data?.message ||
                err?.response?.message ||
                err?.toString()
        notificationStore.updateError(errorMessage)
      }
    }
  );
  