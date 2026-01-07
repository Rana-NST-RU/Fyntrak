import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header = ({ user }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <header className="bg-dark-card border-b border-dark-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-8 w-8 text-green-500" />
          <h1 className="text-2xl font-bold text-white">Fyntrak</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-400">Welcome back,</p>
              <p className="text-lg font-semibold text-white">{user.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Available Cash</p>
              <p className="text-xl font-bold text-green-500">
                {formatCurrency(user.balance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Portfolio Value</p>
              <p className="text-xl font-bold text-blue-500">
                {formatCurrency(user.totalPortfolioValue || 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;