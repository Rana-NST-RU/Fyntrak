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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Portfolio</h2>
        <p className="text-text-secondary">Manage your stock holdings and track performance</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Total Invested</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Briefcase className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Current Value</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalCurrentValue)}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Total P&L</p>
              <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatCurrency(totalProfitLoss)}
              </p>
              <p className={`text-sm mt-1 font-medium ${totalProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalProfitLossPercent.toFixed(2)}%
              </p>
            </div>
            <div className={`p-3 rounded-xl ${totalProfitLoss >= 0 ? 'bg-profit/10' : 'bg-loss/10'}`}>
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
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
          <div className="px-6 py-5 border-b border-white/5 bg-white/5">
            <h3 className="text-xl font-bold text-white">Your Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-bg/50 border-b border-white/5">
                  <th className="text-left py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Symbol</th>
                  <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Quantity</th>
                  <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Avg Buy Price</th>
                  <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Current Price</th>
                  <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Current Value</th>
                  <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">P&L</th>
                  <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">P&L %</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((portfolio, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white tracking-wide">{portfolio.symbol}</div>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-300 font-mono">{portfolio.quantity}</td>
                    <td className="py-4 px-6 text-right text-gray-300 font-mono">{formatCurrency(portfolio.averageBuyPrice)}</td>
                    <td className="py-4 px-6 text-right text-white font-medium font-mono">{formatCurrency(portfolio.currentPrice || 0)}</td>
                    <td className="py-4 px-6 text-right text-white font-bold font-mono">{formatCurrency(portfolio.currentValue || 0)}</td>
                    <td className={`py-4 px-6 text-right font-medium font-mono ${(portfolio.profitLoss || 0) >= 0 ? 'text-profit' : 'text-loss'
                      }`}>
                      {formatCurrency(portfolio.profitLoss || 0)}
                    </td>
                    <td className={`py-4 px-6 text-right font-medium font-mono ${(portfolio.profitLossPercent || 0) >= 0 ? 'text-profit' : 'text-loss'
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
        <div className="glass-panel rounded-2xl p-16 text-center border border-white/5">
          <div className="h-20 w-20 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg">
            <Briefcase className="h-10 w-10 text-text-secondary" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Holdings</h3>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">You haven't made any trades yet. Start trading to build your portfolio and track your wealth.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
          >
            Refresh Portfolio
          </button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;