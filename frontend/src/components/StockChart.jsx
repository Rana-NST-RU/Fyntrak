import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStockHistory } from '../services/api';

const StockChart = ({ symbol = "TCS.NS" }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!symbol) return;

      setLoading(true);
      setError(null);

      try {
        const candles = await getStockHistory(symbol, 30);

        // Format data for Recharts
        const formattedData = candles.map(candle => {
          const date = new Date(candle.time * 1000);
          return {
            date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            price: candle.close,
            open: candle.open,
            high: candle.high,
            low: candle.low,
          };
        });

        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [symbol]);

  const formatCurrency = (value) => {
    return `₹${value.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="w-full border border-dark-border rounded-lg overflow-hidden bg-dark-bg p-4 flex items-center justify-center" style={{ height: 500 }}>
        <div className="text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (error || chartData.length === 0) {
    return (
      <div className="w-full border border-dark-border rounded-lg overflow-hidden bg-dark-bg p-4 flex flex-col items-center justify-center" style={{ height: 500 }}>
        <div className="text-gray-400 text-center">
          <div className="text-xl mb-2">📊</div>
          <div>{error || 'No chart data available for this symbol'}</div>
          <div className="text-sm mt-2 text-gray-500">
            Try valid symbols like: TCS.NS, INFY.NS, AAPL, GOOGL
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="absolute top-2 left-2 z-10 glass-panel px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 border border-white/5">
        {symbol} - Real Market Data
      </div>
      <div className="w-full h-full overflow-hidden bg-transparent">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#9CA3AF"
              tickFormatter={formatCurrency}
              style={{ fontSize: '12px' }}
              domain={['dataMin - 50', 'dataMax + 50']}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(21, 27, 43, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#F3F4F6',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
              formatter={(value) => [formatCurrency(value), 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#1e293b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;