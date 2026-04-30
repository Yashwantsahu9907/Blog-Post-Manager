let baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (baseURL && !baseURL.endsWith('/api')) {
  baseURL = `${baseURL}/api`;
}
const API_BASE_URL = baseURL;

export default API_BASE_URL;
