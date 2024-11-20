import axios from 'axios';

const api = axios.create({
    baseURL: 'https://desirable-transformation-production.up.railway.app/api',
});

export default api;
