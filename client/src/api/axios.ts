import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Create a custom axios instance
export const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend runs on a different port
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Automatically attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            useAuthStore.getState().logout();
            // Optional: redirect to login page here, though PrivateRoute usually handles it
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
