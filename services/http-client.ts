import axios from 'axios';
import { serverErrors } from '~/server/utils/server-errors';

const http = axios.create();
http.defaults.headers.post['Content-Type'] = 'application/json';
http.defaults.withCredentials = true;

http.interceptors.response.use(
  (response) => {
    if (!response.data.isSuccessful) {
      return Promise.reject(response?.data?.errors || [serverErrors['InternalServerError']]);
    }

    return response;
  },
  (response) => {
    if (response?.data?.errors) {
      return Promise.reject(response.data.errors);
    }

    if (response?.code === 'ERR_NETWORK' && !window.navigator.onLine) {
      return Promise.reject([serverErrors['NetworkUnavailable']]);
    }

    return Promise.reject([serverErrors['InternalServerError']]);
  }
);

export { http };
