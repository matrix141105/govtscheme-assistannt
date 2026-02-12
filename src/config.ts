// centralized API configuration
// This allows switching between localhost, local network IP, and production URLs easily.

const getApiBaseUrl = () => {
    // HARDCODED PRODUCTION URL as requested to ensure mobile connectivity
    return "https://govtscheme-assistannt.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();

console.log("Connecting to Backend at:", API_BASE_URL);
