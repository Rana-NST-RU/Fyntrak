const axios = require('axios');

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Convert Yahoo Finance format to Finnhub format
const convertSymbolToFinnhub = (symbol) => {
    const upperSymbol = symbol.toUpperCase();

    // Indian NSE stocks: TCS.NS -> TCS (Finnhub uses direct symbol for NSE)
    if (upperSymbol.endsWith('.NS')) {
        return upperSymbol.replace('.NS', '') + '.NSE';
    }

    // Indian BSE stocks: TCS.BO -> TCS (Finnhub format)
    if (upperSymbol.endsWith('.BO')) {
        return upperSymbol.replace('.BO', '') + '.BSE';
    }

    // US stocks - use as is
    return upperSymbol;
};

// Get current stock quote
const getStockQuote = async (symbol) => {
    try {
        const finnhubSymbol = convertSymbolToFinnhub(symbol);
        const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
            params: {
                symbol: finnhubSymbol,
                token: FINNHUB_API_KEY
            }
        });

        const data = response.data;

        // Check if we got valid data
        if (!data || data.c === 0) {
            throw new Error('Invalid symbol or no data available');
        }

        return {
            symbol: symbol.toUpperCase(),
            price: data.c, // Current price
            change: data.d, // Change
            changePercent: data.dp, // Change percent
            high: data.h, // High price of the day
            low: data.l, // Low price of the day
            open: data.o, // Open price of the day
            previousClose: data.pc // Previous close price
        };
    } catch (error) {
        console.error('Error fetching Finnhub quote:', error.message);
        throw error;
    }
};

// Get historical candle data
const getStockCandles = async (symbol, days = 30) => {
    try {
        const finnhubSymbol = convertSymbolToFinnhub(symbol);
        const to = Math.floor(Date.now() / 1000); // Current timestamp
        const from = to - (days * 24 * 60 * 60); // Days ago

        const response = await axios.get(`${FINNHUB_BASE_URL}/stock/candle`, {
            params: {
                symbol: finnhubSymbol,
                resolution: 'D', // Daily resolution
                from: from,
                to: to,
                token: FINNHUB_API_KEY
            }
        });

        const data = response.data;

        // Check if we got valid data
        if (!data || data.s !== 'ok') {
            throw new Error('No historical data available');
        }

        // Format data for frontend
        const candles = [];
        for (let i = 0; i < data.t.length; i++) {
            candles.push({
                time: data.t[i],
                open: data.o[i],
                high: data.h[i],
                low: data.l[i],
                close: data.c[i],
                volume: data.v[i]
            });
        }

        return candles;
    } catch (error) {
        console.error('Error fetching Finnhub candles:', error.message);
        throw error;
    }
};

module.exports = {
    getStockQuote,
    getStockCandles
};
