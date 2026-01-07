import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StockChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <p>No chart data available</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{formatDate(label)}</p>
          <div className="space-y-1 mt-2">
            <p className="text-white">
              <span className="text-gray-400">Close: </span>
              <span className="font-medium">{formatCurrency(data.close)}</span>
            </p>
            <p className="text-white">
              <span className="text-gray-400">High: </span>
              <span className="font-medium">{formatCurrency(data.high)}</span>
            </p>
            <p className="text-white">
              <span className="text-gray-400">Low: </span>
              <span className="font-medium">{formatCurrency(data.low)}</span>
            </p>
            <p className="text-white">
              <span className="text-gray-400">Volume: </span>
              <span className="font-medium">{data.volume?.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Determine if the stock is up or down overall
  const firstPrice = data[0]?.close || 0;
  const lastPrice = data[data.length - 1]?.close || 0;
  const isUp = lastPrice >= firstPrice;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke={isUp ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: isUp ? "#10b981" : "#ef4444" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;