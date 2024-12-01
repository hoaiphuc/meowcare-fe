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

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            if (response.data.data) response.data = response.data.data;
            return response;
        }
        return response;
    },
    (error) => {
        console.log(error);
        throw error;

    }
);

// axiosClient.interceptors.response.use(
//     (response) => {
//         if (response && response.data) {
//             if (response.data.data) response.data = response.data.data;
//             return response;
//         }
//         return response;
//     },
//     (error) => {
//         if (error.response) {
//             console.log('Error status:', error.response.status);
//             console.log('Error message:', error.response.data.message);
//             console.log('Full response:', error.response.data);
//         } else if (error.request) {
//             console.log('No response received:', error.request);
//         } else {
//             console.log('Error message:', error.message);
//         }
//         return Promise.reject(error);
//     }
// );



export default axiosClient;