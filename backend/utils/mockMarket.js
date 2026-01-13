// Simple mock market data service to replace Yahoo Finance
// This is for "dummy" trading purposes as requested

const STOCKS = {
    'TCS.NS': { price: 3500.00, name: 'Tata Consultancy Services' },
    'INFY.NS': { price: 1450.00, name: 'Infosys' },
    'RELIANCE.NS': { price: 2400.00, name: 'Reliance Industries' },
    'HDFCBANK.NS': { price: 1600.00, name: 'HDFC Bank' },
    'ICICIBANK.NS': { price: 950.00, name: 'ICICI Bank' },
    'SBIN.NS': { price: 580.00, name: 'State Bank of India' },
    'AAPL': { price: 180.00, name: 'Apple Inc.' }, // USD, but we'll treat as simple units
    'GOOGL': { price: 140.00, name: 'Alphabet Inc.' },
};

const getMockPrice = (symbol) => {
    const stock = STOCKS[symbol.toUpperCase()];
    if (!stock) {
        // Generate a consistent pseudo-random price for unknown stocks based on symbol char codes
        let hash = 0;
        for (let i = 0; i < symbol.length; i++) {
            hash = ((hash << 5) - hash) + symbol.charCodeAt(i);
            hash |= 0;
        }
        const basePrice = Math.abs(hash % 1000) + 100;
        return applyRandomFluctuation(basePrice);
    }

    return applyRandomFluctuation(stock.price);
};

const applyRandomFluctuation = (basePrice) => {
    // Fluctuate by +/- 1%
    const fluctuation = (Math.random() - 0.5) * 0.02;
    return basePrice * (1 + fluctuation);
};

module.exports = {
    getMockPrice
};
