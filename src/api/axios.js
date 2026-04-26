import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true, // For sending cookies with cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
