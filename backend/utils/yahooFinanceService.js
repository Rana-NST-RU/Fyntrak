const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Get current stock quote
const getStockQuote = async (symbol) => {
    try {
        const result = await yahooFinance.quoteSummary(symbol, { modules: ['price'] });
        const price = result.price;

        return {
            symbol: symbol.toUpperCase(),
            price: price.regularMarketPrice,
            change: price.regularMarketChange,
            changePercent: price.regularMarketChangePercent,
            high: price.regularMarketDayHigh,
            low: price.regularMarketDayLow,
            open: price.regularMarketOpen,
            previousClose: price.regularMarketPreviousClose,
            volume: price.regularMarketVolume
        };
    } catch (error) {
        console.error('Error fetching Yahoo Finance quote:', error.message);
        throw error;
    }
};

// Get historical candle data
const getStockCandles = async (symbol, days = 30) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const result = await yahooFinance.chart(symbol, {
            period1: startDate,
            period2: endDate,
            interval: '1d'
        });

        if (!result || !result.quotes || result.quotes.length === 0) {
            throw new Error('No data available for this symbol');
        }

        // Format data for frontend
        const candles = result.quotes.map(item => ({
            time: Math.floor(item.date.getTime() / 1000),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume
        }));

        return candles;
    } catch (error) {
        console.error('Error fetching Yahoo Finance history:', error.message);
        throw error;
    }
};

module.exports = {
    getStockQuote,
    getStockCandles
};
