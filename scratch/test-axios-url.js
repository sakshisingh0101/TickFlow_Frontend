import axios from 'axios';

console.log('Testing Axios URL resolution:');

const api1 = axios.create({ baseURL: 'http://localhost:3000/api/v1' });
console.log('baseURL: /api/v1, url: /auth/login ->', api1.getUri({ url: '/auth/login' }));
console.log('baseURL: /api/v1, url: auth/login ->', api1.getUri({ url: 'auth/login' }));

const api2 = axios.create({ baseURL: 'http://localhost:3000/api/v1/' });
console.log('baseURL: /api/v1/, url: /auth/login ->', api2.getUri({ url: '/auth/login' }));
console.log('baseURL: /api/v1/, url: auth/login ->', api2.getUri({ url: 'auth/login' }));
