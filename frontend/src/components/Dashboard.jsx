import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';

const Dashboard = ({ user }) => {
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
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400">Overview of your trading portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-dark-card rounded-lg p-6 border border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  {stat.subtitle && (
                    <p className={`text-sm ${stat.color}`}>{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Holdings */}
      {user?.portfolios && user.portfolios.length > 0 && (
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <h3 className="text-xl font-semibold text-white mb-4">Your Holdings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Symbol</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Quantity</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Avg Price</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Current Price</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody>
                {user.portfolios.slice(0, 5).map((portfolio, index) => (
                  <tr key={index} className="border-b border-dark-border/50">
                    <td className="py-3 px-4 text-white font-medium">{portfolio.symbol}</td>
                    <td className="py-3 px-4 text-gray-300">{portfolio.quantity}</td>
                    <td className="py-3 px-4 text-gray-300">{formatCurrency(portfolio.averageBuyPrice)}</td>
                    <td className="py-3 px-4 text-gray-300">{formatCurrency(portfolio.currentPrice || 0)}</td>
                    <td className={`py-3 px-4 font-medium ${
                      (portfolio.profitLoss || 0) >= 0 ? 'text-profit' : 'text-loss'
                    }`}>
                      {formatCurrency(portfolio.profitLoss || 0)}
                      <span className="text-sm ml-1">
                        ({(portfolio.profitLossPercent || 0).toFixed(2)}%)
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
        <div className="bg-dark-card rounded-lg p-8 border border-dark-border text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Holdings Yet</h3>
          <p className="text-gray-400 mb-4">Start trading to build your portfolio</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Start Trading
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;