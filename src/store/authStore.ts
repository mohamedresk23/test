/**
 * @file authStore.ts
 * @description Global Zustand state management store for Authentication.
 * Manages user credentials, JWT access tokens, and configures a global Axios client (`api`)
 * with request/response interceptors to attach `Bearer` tokens and automatically refresh
 * expired sessions upon 401/403 responses.
 */

import { create } from 'zustand';
import axios from 'axios';

/**
 * User Interface
 * Represents the authenticated user profile information.
 */
interface User {
  id: string;
  email: string;
  name: string;
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
}

/**
 * AuthState Interface
 * Defines state fields and authentication actions inside the store.
 */
interface AuthState {
  /** Authenticated user profile object, or null if unauthenticated */
  user: User | null;
  /** Active JWT access token used for API requests */
  accessToken: string | null;
  /** Stores user profile and token upon successful login/refresh */
  setAuth: (user: User, token: string) => void;
  /** Clears user session and token on logout or auth expiration */
  clearAuth: () => void;
  /** Updates the active JWT access token independently */
  setAccessToken: (token: string) => void;
}

/**
 * Zustand Hook: `useAuthStore`
 * Manages authentication state across the application.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, token) => set({ user, accessToken: token }),
  clearAuth: () => set({ user: null, accessToken: null }),
  setAccessToken: (token) => set({ accessToken: token }),
}));

/**
 * Global Axios Client Instance (`api`)
 * Preconfigured with base API URL and credential handling (`withCredentials: true`).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

// Request Interceptor: Attach JWT token to Authorization header if present
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Automatically attempt to refresh expired tokens on 401/403 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If unauthorized/forbidden and retry hasn't been attempted yet
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        useAuthStore.getState().setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
