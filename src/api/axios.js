import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tickflow-backend.onrender.com/api/v1',
  withCredentials: true, // For sending cookies with cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
