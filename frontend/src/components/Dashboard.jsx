import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';

const Dashboard = ({ user, refreshUserData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const totalNetWorth = user?.totalNetWorth || 0;
  const totalPortfolioValue = user?.totalPortfolioValue || 0;
  const totalProfitLoss = user?.portfolios?.reduce((sum, portfolio) => sum + (portfolio.profitLoss || 0), 0) || 0;
  const totalProfitLossPercent = totalPortfolioValue > 0 ? (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100 : 0;

  const stats = [
    {
      title: 'Total Net Worth',
      value: formatCurrency(totalNetWorth),
      icon: DollarSign,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Available Cash',
      value: formatCurrency(user?.balance || 0),
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Portfolio Value',
      value: formatCurrency(totalPortfolioValue),
      icon: Briefcase,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Total P&L',
      value: formatCurrency(totalProfitLoss),
      icon: totalProfitLoss >= 0 ? TrendingUp : TrendingDown,
      color: totalProfitLoss >= 0 ? 'text-profit' : 'text-loss',
      bgColor: totalProfitLoss >= 0 ? 'bg-profit/10' : 'bg-loss/10',
      subtitle: `${totalProfitLossPercent.toFixed(2)}%`
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-text-secondary">Overview of your trading portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card rounded-2xl p-6 transition-all duration-300 hover:transform hover:translate-y-[-4px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold text-white`}>{stat.value}</p>
                  {stat.subtitle && (
                    <p className={`text-sm mt-1 font-medium ${stat.color}`}>{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Holdings */}
      {user?.portfolios && user.portfolios.length > 0 && (
        <div className="glass-panel rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Your Holdings</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-4 px-4 text-text-secondary text-sm font-medium uppercase tracking-wider">Symbol</th>
                  <th className="text-right py-4 px-4 text-text-secondary text-sm font-medium uppercase tracking-wider">Quantity</th>
                  <th className="text-right py-4 px-4 text-text-secondary text-sm font-medium uppercase tracking-wider">Avg Price</th>
                  <th className="text-right py-4 px-4 text-text-secondary text-sm font-medium uppercase tracking-wider">Current Price</th>
                  <th className="text-right py-4 px-4 text-text-secondary text-sm font-medium uppercase tracking-wider">P&L</th>
                </tr>
              </thead>
              <tbody>
                {user.portfolios.slice(0, 5).map((portfolio, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-4 text-white font-semibold">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-dark-bg flex items-center justify-center text-xs font-bold text-text-secondary border border-white/5">
                          {portfolio.symbol.substring(0, 2)}
                        </div>
                        <span>{portfolio.symbol}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-300">{portfolio.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-300">{formatCurrency(portfolio.averageBuyPrice)}</td>
                    <td className="py-4 px-4 text-right text-white font-medium">{formatCurrency(portfolio.currentPrice || 0)}</td>
                    <td className={`py-4 px-4 text-right font-bold ${(portfolio.profitLoss || 0) >= 0 ? 'text-profit' : 'text-loss'
                      }`}>
                      <div className="flex items-center justify-end space-x-1">
                        {(portfolio.profitLoss || 0) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span>{formatCurrency(portfolio.profitLoss || 0)}</span>
                      </div>
                      <span className={`text-xs block mt-0.5 opacity-80`}>
                        {(portfolio.profitLossPercent || 0).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(!user?.portfolios || user.portfolios.length === 0) && (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="h-16 w-16 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
            <Briefcase className="h-8 w-8 text-text-secondary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Holdings Yet</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">Your portfolio is empty. Search for stocks and start trading to build your wealth.</p>
          <button className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20">
            Start Trading
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;