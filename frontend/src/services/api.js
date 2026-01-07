import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Market Data
export const getStockQuote = async (symbol) => {
  const response = await api.get(`/market/quote/${symbol}`);
  return response.data;
};

export const getStockHistory = async (symbol, period = '1mo') => {
  const response = await api.get(`/market/history/${symbol}?period=${period}`);
  return response.data;
};

// User Data
export const getUserData = async (userId) => {
  const response = await api.get(`/user/${userId}`);
  return response.data;
};

export const createUser = async (email, name) => {
  const response = await api.post('/user/create', { email, name });
  return response.data;
};

// Trading
export const buyStock = async (userId, symbol, quantity) => {
  const response = await api.post('/trade/buy', {
    userId,
    symbol,
    quantity
  });
  return response.data;
};

export const sellStock = async (userId, symbol, quantity) => {
  const response = await api.post('/trade/sell', {
    userId,
    symbol,
    quantity
  });
  return response.data;
};

export default api;