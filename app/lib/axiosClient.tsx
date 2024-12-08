'use client';

import axios from 'axios';
// import { config } from 'process';

const getToken = () => {
    if (typeof window === 'undefined') return null;
    const authToken = localStorage.getItem('auth-token');
    if (authToken === null) {
        return null;
    }

    return JSON.parse(authToken);
};

// Helper function to get the refresh token
const getRefreshToken = () => {
    if (typeof window === 'undefined') return null;
    const refreshToken = localStorage.getItem('refresh-token');
    if (refreshToken === null) {
        return null;
    }
    return JSON.parse(refreshToken);

};

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API,
});

axiosClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// axiosClient.interceptors.response.use(
//     (response) => {
//         if (response && response.data) {
//             if (response.data.data) response.data = response.data.data;
//             return response;
//         }
//         return response;
//     },
//     async (error) => {
//         console.log(error);
//         throw error;

//     }
// );

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            if (response.data.data) response.data = response.data.data;
            return response;
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark request as retried
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                return Promise.reject(error); // No refresh token, can't retry
            }

            try {
                if (typeof window !== "undefined") {
                    localStorage.removeItem('auth-token');
                }
                delete axiosClient.defaults.headers.common['Authorization'];
                delete originalRequest.headers['Authorization'];

                // Call refresh API
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_API}auth/refresh`,
                    {
                        token: getToken(),
                        refreshToken,
                        deviceId: "web",
                    }
                );

                const { newAuthToken, newRefreshToken } = refreshResponse.data.data;
                console.log(refreshResponse.data.data);

                // Store new tokens
                if (typeof window !== "undefined") {
                    localStorage.setItem('auth-token', JSON.stringify(newAuthToken));
                    localStorage.setItem('refresh-token', JSON.stringify(newRefreshToken));
                }

                // Update headers for the original request
                axiosClient.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${newAuthToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAuthToken}`;

                // Retry the original request
                return axiosClient(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                return Promise.reject(refreshError);
            }
        }

        // If not a 401 or refresh failed, pass the error
        return Promise.reject(error);
    }
);



export default axiosClient;