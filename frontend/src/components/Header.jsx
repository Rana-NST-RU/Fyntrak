import React from 'react';
import { TrendingUp, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <header className="sticky top-0 z-50 px-6 py-4">
      <div className="glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative bg-gradient-to-br from-primary to-blue-600 p-2.5 rounded-xl shadow-lg border border-white/10">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
              Fyntrak
            </h1>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-8">
            <div className="hidden md:block text-right group cursor-default">
              <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest mb-0.5">Available Cash</p>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-2xl font-bold text-white tracking-tight group-hover:text-profit transition-colors">
                  {formatCurrency(user.balance)}
                </span>
                <span className="flex h-2 w-2 rounded-full bg-profit animate-pulse" />
              </div>
            </div>

            <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block"></div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 pl-4 pr-2 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{user.name}</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-lg">
                  <div className="h-full w-full rounded-full bg-dark-bg flex items-center justify-center">
                    {user.name ? (
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <UserIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2.5 text-text-secondary hover:text-loss hover:bg-loss/10 rounded-xl border border-transparent hover:border-loss/20 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;