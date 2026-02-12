import { API_BASE_URL } from "@/config";

interface FetchOptions extends RequestInit {
    retries?: number;
    retryDelay?: number;
}

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
    const { retries = 2, retryDelay = 2000, ...fetchOptions } = options;
    let attempt = 0;

    // Ensure endpoint starts with / if not absolute (though we usually pass full path or relative)
    // Our config.ts provides API_BASE_URL which might be http://... or /api
    // Let's standardise: the consumer should pass "/profiles", and we prepend API_BASE_URL
    const url = `${API_BASE_URL}${endpoint}`;

    while (attempt <= retries) {
        try {
            const response = await fetch(url, fetchOptions);

            // If successful, return response
            if (response.ok) {
                return response;
            }

            // If 5xx error (server error), we might want to retry
            if (response.status >= 500 && attempt < retries) {
                throw new Error(`Server Error: ${response.status}`);
            }

            // If 4xx error (client error), don't retry, just throw
            if (response.status >= 400) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(errorData.detail || `Request failed with status ${response.status}`, response.status);
            }

            return response;
        } catch (error) {
            if (attempt < retries) {
                console.warn(`Attempt ${attempt + 1} failed. Retrying in ${retryDelay}ms...`, error);
                await sleep(retryDelay);
                attempt++;
            } else {
                console.error("All fetch attempts failed:", error);
                throw error; // Rethrow final error
            }
        }
    }

    throw new Error("Network request failed after retries.");
}
