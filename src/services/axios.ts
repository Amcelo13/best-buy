import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/assist.types';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error:any) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    if (response.data && !response.data.success) {
      return Promise.reject(response.data.error || 'Request failed');
    }
    return response;
  },
  (error:any) => {
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(errorMessage);
  }
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.get<ApiResponse<T>>(url, config).then((res:any) => res.data),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.post<ApiResponse<T>>(url, data, config).then((res:any) => res.data),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.put<ApiResponse<T>>(url, data, config).then((res:any) => res.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.delete<ApiResponse<T>>(url, config).then((res:any) => res.data),
};

export default axiosInstance;
