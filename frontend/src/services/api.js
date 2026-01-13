import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Market Data - Now using Trade Mock Price for form data
export const getStockPrice = async (symbol) => {
  const response = await api.get(`/trade/price/${symbol}`);
  return response.data;
};

// Legacy mapping
export const getStockQuote = async (symbol) => {
  return getStockPrice(symbol);
};

export const getStockHistory = async (symbol, days = 30) => {
  const response = await api.get(`/trade/history/${symbol}?days=${days}`);
  return response.data;
};

// Trading
export const buyStock = async (symbol, quantity) => {
  const response = await api.post('/trade/buy', {
    symbol,
    quantity
  });
  return response.data;
};

export const sellStock = async (symbol, quantity) => {
  const response = await api.post('/trade/sell', {
    symbol,
    quantity
  });
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get('/trade/history');
  return response.data;
};

export default api;