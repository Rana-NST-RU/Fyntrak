// Convert Yahoo Finance symbol format to TradingView format
export const convertToTradingViewSymbol = (symbol) => {
    if (!symbol) return 'NSE:NIFTY';

    const upperSymbol = symbol.toUpperCase();

    // Indian stocks (NSE) - convert from TCS.NS to NSE:TCS
    if (upperSymbol.endsWith('.NS')) {
        const baseSymbol = upperSymbol.replace('.NS', '');
        return `NSE:${baseSymbol}`;
    }

    // Indian stocks (BSE) - convert from TCS.BO to BSE:TCS
    if (upperSymbol.endsWith('.BO')) {
        const baseSymbol = upperSymbol.replace('.BO', '');
        return `BSE:${baseSymbol}`;
    }

    // US stocks - convert to NASDAQ or NYSE prefix
    // Common tech stocks default to NASDAQ
    const nasdaqStocks = ['AAPL', 'GOOGL', 'GOOG', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA'];
    if (nasdaqStocks.includes(upperSymbol)) {
        return `NASDAQ:${upperSymbol}`;
    }

    // Default to NASDAQ for other US stocks (can be refined)
    if (!upperSymbol.includes(':')) {
        return `NASDAQ:${upperSymbol}`;
    }

    // Already formatted (e.g., NSE:TCS)
    return upperSymbol;
};

// Get common Indian stock symbols for suggestions
export const getPopularIndianStocks = () => [
    { symbol: 'TCS.NS', display: 'TCS', tvSymbol: 'NSE:TCS' },
    { symbol: 'INFY.NS', display: 'Infosys', tvSymbol: 'NSE:INFY' },
    { symbol: 'RELIANCE.NS', display: 'Reliance', tvSymbol: 'NSE:RELIANCE' },
    { symbol: 'HDFCBANK.NS', display: 'HDFC Bank', tvSymbol: 'NSE:HDFCBANK' },
    { symbol: 'ICICIBANK.NS', display: 'ICICI Bank', tvSymbol: 'NSE:ICICIBANK' },
    { symbol: 'SBIN.NS', display: 'SBI', tvSymbol: 'NSE:SBIN' },
];
