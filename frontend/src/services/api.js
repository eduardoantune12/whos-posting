import axios from 'axios';

const api = axios.create({
    baseURL: 'http://whos-posting-api.onrender.com/api/',
});

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;