export const API_BASE_URL = 'http://localhost:3000/api';

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};

export const commonHeaders = {
  'Content-Type': 'application/json',
};