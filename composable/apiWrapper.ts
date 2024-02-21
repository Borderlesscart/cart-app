import axios from 'axios';

export const API = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: false,
  });

  API.interceptors.request.use(
    (request) => {
      // automatically set token in axios default header
    //   const token = JSON.parse(localStorage.getItem('token'));
  
    //   const clientToken = JSON.parse(localStorage.getItem('client-token'));
    //   const path = location.pathname.split('/')[1];
    //   if (path === 'client-portal' && clientToken) {
    //     request.headers.authorization = 'Bearer ' + clientToken;
    //     return request;
    //   }
  
    //   if (token) {
    //     request.headers.authorization = 'Bearer ' + token;
    //   }
  
      // Important: request interceptors **must** return the request.
      return request;
    },
    (error) => {
        // Trigger Error component
      return Promise.reject(error);
    }
  );
  
  API.interceptors.response.use(
    (response: any) => {
      return response?.data;
    },
    (err) => {
      const originalRequest = err.config;
      const authStore = useAuthStore()
    //   authStore.login({user_id:'', password:''})
      console.log(err)
      if (err?.response?.status === 404) {
        throw new Error(
          err.response?.data?.message || `${err.config.url} not found`
        );
      } else if (err?.response?.status === 403) {
        // this.$toast.error(this.message);
        throw new Error('Permission error');
      } else if (err?.response?.status === 401 && !originalRequest._retry) {
        // checking for error as a result of expired/missing api jwt token
        originalRequest._retry = true;
        // toaster.error(
        //   'Failing to read data: user authentication invalid/expired! Redirecting...',
        //   {
        //     position: POSITION.TOP_LEFT,
        //     timeout: 5000,
        //   }
        // );
  
        //Check if router is currently in client-portal
        const path = location.pathname.split('/')[1];
  
        if (path === 'client-portal' || path === 'client-login') {
          localStorage.removeItem('client-token');
          localStorage.removeItem('client');
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('vuex');
        }
  
        // return router.go(0); // refresh page and auto-redirect to login
      } else {
        return Promise.reject(err);
      }
    }
  );
  