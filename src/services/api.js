import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7154/api', // adjust to your backend address
});

export default api;
