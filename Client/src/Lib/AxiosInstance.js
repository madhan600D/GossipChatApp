// AxiosInstance.js
import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/' : 'https://gossipchatapp.onrender.com' ,  
    withCredentials: true,
});

export default AxiosInstance;
