import React from 'react';
import { TrendingUp, TrendingDown, Briefcase } from 'lucide-react';

const Portfolio = ({ user, refreshUserData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const portfolios = user?.portfolios || [];
  const totalInvested = portfolios.reduce((sum, p) => sum + (p.quantity * p.averageBuyPrice), 0);
  const totalCurrentValue = portfolios.reduce((sum, p) => sum + (p.currentValue || 0), 0);
  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Portfolio</h2>
        <p className="text-gray-400">Manage your stock holdings</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Invested</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/10">
              <Briefcase className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Current Value</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalCurrentValue)}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/10">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total P&L</p>
              <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatCurrency(totalProfitLoss)}
              </p>
              <p className={`text-sm ${totalProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalProfitLossPercent.toFixed(2)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${totalProfitLoss >= 0 ? 'bg-profit/10' : 'bg-loss/10'}`}>
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="h-6 w-6 text-profit" />
              ) : (
                <TrendingDown className="h-6 w-6 text-loss" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      {portfolios.length > 0 ? (
        <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-border">
            <h3 className="text-xl font-semibold text-white">Your Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Symbol</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Quantity</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Avg Buy Price</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Current Price</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Current Value</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">P&L</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">P&L %</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((portfolio, index) => (
                  <tr key={index} className="border-b border-dark-border/50 hover:bg-gray-800/30">
                    <td className="py-4 px-6">
                      <div className="font-medium text-white">{portfolio.symbol}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{portfolio.quantity}</td>
                    <td className="py-4 px-6 text-gray-300">{formatCurrency(portfolio.averageBuyPrice)}</td>
                    <td className="py-4 px-6 text-gray-300">{formatCurrency(portfolio.currentPrice || 0)}</td>
                    <td className="py-4 px-6 text-gray-300">{formatCurrency(portfolio.currentValue || 0)}</td>
                    <td className={`py-4 px-6 font-medium ${
                      (portfolio.profitLoss || 0) >= 0 ? 'text-profit' : 'text-loss'
                    }`}>
                      {formatCurrency(portfolio.profitLoss || 0)}
                    </td>
                    <td className={`py-4 px-6 font-medium ${
                      (portfolio.profitLossPercent || 0) >= 0 ? 'text-profit' : 'text-loss'
                    }`}>
                      {(portfolio.profitLossPercent || 0).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-dark-card rounded-lg p-12 border border-dark-border text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">No Holdings</h3>
          <p className="text-gray-400 mb-6">You haven't made any trades yet. Start trading to build your portfolio.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Refresh Portfolio
          </button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;