import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    withCredentials: true, // Crucial for sending JWT cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // You can add logic to redirect back to login, or handle refresh logic
            if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
                // Prevent instant redirect loop if already on login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
