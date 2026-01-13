const YahooFinance = require('yahoo-finance2').default;

async function test() {
    try {
        console.log('Type of default export:', typeof YahooFinance);
        console.log('Is it a class?', YahooFinance.prototype ? 'Yes' : 'No');

        // Try the user's way
        try {
            const yfInstance = new YahooFinance();
            console.log('Successfully instantiated with new YahooFinance()');

            console.log('Testing quoteSummary...');
            const quote = await yfInstance.quoteSummary('TCS.NS', { modules: ['price'] });
            console.log('Quote result:', quote ? 'Found' : 'Null');

            console.log('Testing chart...');
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);

            const chart = await yfInstance.chart('TCS.NS', {
                period1: startDate,
                period2: endDate,
                interval: '1d'
            });
            console.log('Chart result:', (chart && chart.quotes && chart.quotes.length > 0) ? `Found ${chart.quotes.length} candles` : 'Empty');

        } catch (e) {
            console.log('Failed to instantiate or use new YahooFinance():', e.message);
            console.error(e);
        }

        // Try the standard way (assuming default is the instance)
        try {
            const result = await YahooFinance.quoteSummary('TCS.NS', { modules: ['price'] });
            console.log('Direct usage quote result:', result ? 'Found' : 'Null');
        } catch (e) {
            console.log('Failed direct usage:', e.message);
        }

    } catch (e) {
        console.error('Fatal error:', e);
    }
}

test();
