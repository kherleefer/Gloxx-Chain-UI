import axios from 'axios';
//import donenv from 'dotenv';
import { PreferencesService } from './preferencesService';
import { Router, useRouter } from 'vue-router';
import { handleAuthError } from '@/utils/authUtils';

//if it is a web consider using enviroment Varaible
const API_URL = 'http://localhost:3000'; // change to your api URL

type UpdateListener = () => void;
type UpdateType = 'mining' | 'balance' | 'stake';

 const listeners: Record<UpdateType, UpdateListener[]> = {
  mining: [],
  balance: [],
  stake: []
};

// Subscribe to updates
export const subscribeToUpdates = (type: UpdateType, listener: UpdateListener) => {
  listeners[type].push(listener);
};

// Unsubscribe from updates
export const unsubscribeFromUpdates = (type: UpdateType, listener: UpdateListener) => {
  const index = listeners[type].indexOf(listener);
  if (index > -1) {
    listeners[type].splice(index, 1);
  }
};

// Notify listeners of updates
export const notifyUpdate = (type: UpdateType) => {
  listeners[type].forEach(listener => listener());
};

const api = axios.create({
  baseURL: API_URL,
   
});

// Update interceptor to use Preferences
api.interceptors.request.use(async config => {
  const token = await PreferencesService.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let router: Router;

// Initialize router for interceptors
export const initializeRouter = (vueRouter: Router) => {
    router = vueRouter;
};

 
api.interceptors.response.use(
    response => response,
    async error => {
        // this Skip auth check for login endpoint
        if (error.config.url?.includes('/login')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            await handleAuthError(error, router);
            return Promise.reject(error);
        }
        
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.response?.data?.message || 'Unknown error',
            details: error.response?.data?.details
        });
        

        return Promise.reject(error);
    }
);

export default api;