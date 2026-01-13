import React from 'react';
import { BarChart3, Briefcase, TrendingUp, History } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: History }
  ];

  return (
    <aside className="w-64 p-6 hidden md:flex flex-col h-[calc(100vh-80px)] sticky top-[80px]">
      <nav className="space-y-3 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                : 'text-text-secondary hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
                }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-white'}`} />
              </div>
              <span className="font-medium tracking-wide">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#3B82F6]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="relative mt-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur-lg opacity-20" />
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10" />

          <h3 className="text-white font-semibold mb-1 relative z-10">Pro Plan</h3>
          <p className="text-xs text-text-secondary mb-3 relative z-10">Unlock real-time data & advanced charts</p>

          <button className="w-full py-2 bg-primary hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all transform group-hover:translate-y-[-2px]">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;