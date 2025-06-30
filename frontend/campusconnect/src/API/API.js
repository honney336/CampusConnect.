import axios from 'axios';
const ApiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },                                                                         
});






export const createuser = (data) => Api.post('/api/auth/register', data);

export  const login = (data) => Api.post('/api/user/login', data);


