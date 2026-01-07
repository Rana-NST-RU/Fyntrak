import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import Trade from './components/Trade';
import { getUserData } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For demo purposes, using user ID 1
  const userId = 1;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await getUserData(userId);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = () => {
    fetchUserData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Header user={user} />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <Dashboard user={user} refreshUserData={refreshUserData} />
          )}
          {activeTab === 'portfolio' && (
            <Portfolio user={user} refreshUserData={refreshUserData} />
          )}
          {activeTab === 'trade' && (
            <Trade user={user} refreshUserData={refreshUserData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;