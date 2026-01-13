import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { getStockPrice, buyStock, sellStock } from '../services/api';
import StockChart from './StockChart';

const Trade = ({ user, refreshUserData }) => {
  const [searchSymbol, setSearchSymbol] = useState('TCS.NS');
  const [currentSymbol, setCurrentSymbol] = useState('TCS.NS');
  const [priceData, setPriceData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tradeLoading, setTradeLoading] = useState(false);
  // Add state for order type (buy/sell)
  const [orderType, setOrderType] = useState('BUY');

  useEffect(() => {
    handleSearch(true);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleSearch = async (isInitial = false) => {
    const symbolToSearch = isInitial ? 'TCS.NS' : searchSymbol;
    if (!symbolToSearch.trim()) return;

    setLoading(true);
    try {
      const data = await getStockPrice(symbolToSearch);
      setPriceData(data);
      setCurrentSymbol(data.symbol || symbolToSearch);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setCurrentSymbol(symbolToSearch);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTrade = async () => {
    if (!currentSymbol || quantity <= 0) return;

    setTradeLoading(true);
    try {
      if (orderType === 'BUY') {
        await buyStock(currentSymbol, quantity);
        // Ideally show a toast notification here
      } else {
        // Perform check before sell
        const portfolio = user.portfolios?.find(p => p.symbol === currentSymbol);
        if (!portfolio || portfolio.quantity < quantity) {
          alert('Insufficient stock quantity for this trade');
          setTradeLoading(false);
          return;
        }
        await sellStock(currentSymbol, quantity);
      }

      alert(`Successfully ${orderType === 'BUY' ? 'bought' : 'sold'} ${quantity} shares of ${currentSymbol}`);
      refreshUserData();
      setQuantity(1);
    } catch (error) {
      console.error(`Error executing ${orderType} order:`, error);
      alert(`Error executing ${orderType} order`);
    } finally {
      setTradeLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Trade</h2>
        <p className="text-text-secondary">Execute trades with real-time market data</p>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-2 rounded-2xl flex items-center space-x-4 max-w-2xl">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-5 w-5 group-hover:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search symbol (e.g., RELIANCE.NS, INFY.NS)"
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 pl-12 pr-4 py-3 text-lg font-medium uppercase"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={() => handleSearch()}
          className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-2xl p-6 h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{currentSymbol}</h3>
                {priceData && (
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-3xl font-bold text-white">{formatCurrency(priceData.price)}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">LIVE</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 bg-dark-bg/20 rounded-xl overflow-hidden border border-white/5">
              <StockChart symbol={currentSymbol} />
            </div>
          </div>
        </div>

        {/* Order Form Section */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Place Order</h3>

            {/* Order Type Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-dark-bg/50 rounded-xl mb-6">
              <button
                onClick={() => setOrderType('BUY')}
                className={`py-3 rounded-lg font-bold text-sm transition-all ${orderType === 'BUY'
                    ? 'bg-profit text-white shadow-lg shadow-green-500/20'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderType('SELL')}
                className={`py-3 rounded-lg font-bold text-sm transition-all ${orderType === 'SELL'
                    ? 'bg-loss text-white shadow-lg shadow-red-500/20'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
              >
                Sell
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-text-secondary font-medium mb-2">Quantity</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-right font-mono text-lg"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm">Qty</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Price</span>
                  <span className="text-white font-medium">{priceData ? formatCurrency(priceData.price) : '---'}</span>
                </div>
                <div className="border-t border-white/5 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-medium">Estimated Total</span>
                  <span className="text-xl font-bold text-white">
                    {priceData ? formatCurrency(priceData.price * quantity) : '---'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-text-secondary px-1">
                <span>Available Cash</span>
                <span className="text-white font-medium">{formatCurrency(user.balance)}</span>
              </div>

              <button
                onClick={handleExecuteTrade}
                disabled={tradeLoading || !priceData}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg text-white flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] ${orderType === 'BUY'
                    ? 'bg-profit hover:bg-green-600 shadow-green-500/20'
                    : 'bg-loss hover:bg-red-600 shadow-red-500/20'
                  }`}
              >
                {tradeLoading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    {orderType === 'BUY' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    <span>{orderType === 'BUY' ? 'Buy ' : 'Sell '} {currentSymbol}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;