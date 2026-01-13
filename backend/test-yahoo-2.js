const YahooFinance = require('yahoo-finance2').default;

async function test() {
    try {
        const yahooFinance = new YahooFinance();
        console.log('Instantiated YahooFinance');
        console.log('Testing quoteSummary...');
        // Note: instance methods might be different from static
        const res = await yahooFinance.quoteSummary('AAPL', { modules: ['price'] });
        console.log('Success quoteSummary:', res.price.regularMarketPrice);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
