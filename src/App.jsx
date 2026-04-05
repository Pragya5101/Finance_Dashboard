import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import TransactionsView from './components/transactions/TransactionsView';
import InsightsView from './components/insights/InsightsView';
import useFinanceStore from './store/useFinanceStore';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useFinanceStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'transactions':
        return <TransactionsView />;
      case 'insights':
        return <InsightsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-screen w-full">
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="animate-in fade-in duration-300">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
    </div>
  );
}

export default App;