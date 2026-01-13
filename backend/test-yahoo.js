const yf = require('yahoo-finance2');
console.log('Type of yf:', typeof yf);
console.log('Keys of yf:', Object.keys(yf));
if (yf.default) {
    console.log('Type of yf.default:', typeof yf.default);
    console.log('Keys of yf.default:', Object.keys(yf.default));
}

async function test() {
    try {
        const yahooFinance = yf.default || yf;
        console.log('Testing quoteSummary...');
        if (typeof yahooFinance.quoteSummary === 'function') {
            const res = await yahooFinance.quoteSummary('AAPL', { modules: ['price'] });
            console.log('Success quoteSummary:', res.price.regularMarketPrice);
        } else {
            console.log('yahooFinance.quoteSummary is NOT a function');
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
