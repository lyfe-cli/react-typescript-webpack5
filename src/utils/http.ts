import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { codeMessage } from './errorHandler';

// const ENV = process.env.TZ

const request = axios.create({
  baseURL: '',
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  withCredentials: true,
  validateStatus: () => true,
  transformRequest: [
    d => {
      d = JSON.stringify(d);
      return d;
    }
  ],
  transformResponse: [
    d => {
      if (typeof d === 'string' && d.startsWith('{')) {
        d = JSON.parse(d);
      }
      return d;
    }
  ]
});

request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  error => {
    error.data = {};
    error.data.msg = '服务器异常，请重试～';
    return Promise.resolve(error);
  }
);

request.interceptors.response.use((response: AxiosResponse) => {
  const status = response.status;
  let msg = '';
  if (status < 200 || status >= 300) {
    msg = codeMessage[status];

    if (typeof response.data === 'string') {
      response.data = { msg };
    } else {
      response.data.msg = msg;
    }
  }
  return response;
});

export default request;
