import axios from 'axios';
import { useNotificationStore } from '#imports';

export const API = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: false,
  });

  // 

  API.interceptors.request.use(
    (request) => {    
      const jwtToken = useCookie('jwtToken')
      if (jwtToken.value) {
        request.headers.authorization = 'Bearer ' + jwtToken.value.access_token;
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
        navigateTo('/auth/login')
      } else if(err?.response?.status === 400){
        const errorMessage =
                Array.isArray(err?.response?.data?.message)? 
                err?.response?.data?.message.join('/n'): err?.response?.data?.message||
                err?.response?.data?.error ||
                err?.response?.message ||
                err.toString()
        notificationStore.updateError(errorMessage)
      } else {
        const errorMessage =
                err?.response?.data?.message ||
                err?.response?.message ||
                err?.toString()
        notificationStore.updateError(errorMessage)
      }
    }
  );
  