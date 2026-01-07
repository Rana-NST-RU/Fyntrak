import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { getStockQuote, getStockHistory, buyStock, sellStock } from '../services/api';
import StockChart from './StockChart';

const Trade = ({ user, refreshUserData }) => {
  const [searchSymbol, setSearchSymbol] = useState('TCS.NS');
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockHistory, setStockHistory] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tradeLoading, setTradeLoading] = useState(false);

  useEffect(() => {
    if (searchSymbol) {
      handleSearch();
    }
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleSearch = async () => {
    if (!searchSymbol.trim()) return;
    
    setLoading(true);
    try {
      const [quote, history] = await Promise.all([
        getStockQuote(searchSymbol),
        getStockHistory(searchSymbol, '1mo')
      ]);
      
      setSelectedStock(quote);
      setStockHistory(history);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert('Error fetching stock data. Please check the symbol and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!selectedStock || quantity <= 0) return;
    
    const totalCost = selectedStock.price * quantity;
    if (totalCost > user.balance) {
      alert('Insufficient balance for this trade');
      return;
    }

    setTradeLoading(true);
    try {
      await buyStock(user.id, selectedStock.symbol, quantity);
      alert(`Successfully bought ${quantity} shares of ${selectedStock.symbol}`);
      refreshUserData();
      setQuantity(1);
    } catch (error) {
      console.error('Error buying stock:', error);
      alert('Error executing buy order');
    } finally {
      setTradeLoading(false);
    }
  };

  const handleSell = async () => {
    if (!selectedStock || quantity <= 0) return;
    
    const portfolio = user.portfolios?.find(p => p.symbol === selectedStock.symbol);
    if (!portfolio || portfolio.quantity < quantity) {
      alert('Insufficient stock quantity for this trade');
      return;
    }

    setTradeLoading(true);
    try {
      await sellStock(user.id, selectedStock.symbol, quantity);
      alert(`Successfully sold ${quantity} shares of ${selectedStock.symbol}`);
      refreshUserData();
      setQuantity(1);
    } catch (error) {
      console.error('Error selling stock:', error);
      alert('Error executing sell order');
    } finally {
      setTradeLoading(false);
    }
  };

  const totalCost = selectedStock ? selectedStock.price * quantity : 0;
  const ownedQuantity = user.portfolios?.find(p => p.symbol === selectedStock?.symbol)?.quantity || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Trade</h2>
        <p className="text-gray-400">Buy and sell Indian stocks with virtual money</p>
      </div>

      {/* Search Bar */}
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., TCS.NS, INFY.NS, RELIANCE.NS)"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {selectedStock && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock Info & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stock Info */}
            <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{selectedStock.symbol}</h3>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{formatCurrency(selectedStock.price)}</p>
                  <div className={`flex items-center space-x-1 ${
                    selectedStock.change >= 0 ? 'text-profit' : 'text-loss'
                  }`}>
                    {selectedStock.change >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {formatCurrency(selectedStock.change)} ({selectedStock.changePercent?.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Previous Close</p>
                  <p className="text-white font-medium">{formatCurrency(selectedStock.previousClose)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Volume</p>
                  <p className="text-white font-medium">{selectedStock.volume?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-white font-medium">
                    {selectedStock.marketCap ? `₹${(selectedStock.marketCap / 10000000).toFixed(2)}Cr` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">You Own</p>
                  <p className="text-white font-medium">{ownedQuantity} shares</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
              <h4 className="text-lg font-semibold text-white mb-4">Price Chart (1 Month)</h4>
              <StockChart data={stockHistory} />
            </div>
          </div>

          {/* Trading Panel */}
          <div className="bg-dark-card rounded-lg p-6 border border-dark-border h-fit">
            <h4 className="text-xl font-semibold text-white mb-6">Trade {selectedStock.symbol}</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Price per share:</span>
                  <span className="text-white font-medium">{formatCurrency(selectedStock.price)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Quantity:</span>
                  <span className="text-white font-medium">{quantity}</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total Cost:</span>
                    <span className="text-white font-bold text-lg">{formatCurrency(totalCost)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBuy}
                  disabled={tradeLoading || totalCost > user.balance}
                  className="w-full bg-profit hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {tradeLoading ? 'Processing...' : `Buy ${quantity} shares`}
                </button>
                
                <button
                  onClick={handleSell}
                  disabled={tradeLoading || ownedQuantity < quantity}
                  className="w-full bg-loss hover:bg-red-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {tradeLoading ? 'Processing...' : `Sell ${quantity} shares`}
                </button>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <p>Available Balance: {formatCurrency(user.balance)}</p>
                <p>Owned Shares: {ownedQuantity}</p>
                {totalCost > user.balance && (
                  <p className="text-loss">Insufficient balance for this trade</p>
                )}
                {ownedQuantity < quantity && (
                  <p className="text-loss">Insufficient shares to sell</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedStock && !loading && (
        <div className="bg-dark-card rounded-lg p-12 border border-dark-border text-center">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">Search for Stocks</h3>
          <p className="text-gray-400 mb-6">Enter a stock symbol to start trading</p>
          <div className="text-sm text-gray-400">
            <p>Popular Indian stocks:</p>
            <p className="mt-2">TCS.NS, INFY.NS, RELIANCE.NS, HDFCBANK.NS, ICICIBANK.NS</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trade;