import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import Trade from './components/Trade';
import Transactions from './components/Transactions';
import Login from './components/Login';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, refreshUser } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Header user={user} />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <Dashboard user={user} refreshUserData={refreshUser} />
          )}
          {activeTab === 'portfolio' && (
            <Portfolio user={user} refreshUserData={refreshUser} />
          )}
          {activeTab === 'trade' && (
            <Trade user={user} refreshUserData={refreshUser} />
          )}
          {activeTab === 'transactions' && (
            <Transactions />
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;