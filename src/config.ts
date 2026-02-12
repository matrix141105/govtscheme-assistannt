
// centralized API configuration
// This allows switching between localhost, local network IP, and production URLs easily.

const getApiBaseUrl = () => {
    // If VITE_API_URL is set in .env, use it (Best for local network dev)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Default to localhost for development if not configured
    if (import.meta.env.DEV) {
        return "http://127.0.0.1:8000";
    }

    // Fallback for production (relative path if serving from same origin, or specific URL)
    return "https://govscheme-backend.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();

console.log("Connecting to Backend at:", API_BASE_URL);
