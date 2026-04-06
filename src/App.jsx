import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import TransactionsView from './components/transactions/TransactionsView';
import InsightsView from './components/insights/InsightsView';
import useFinanceStore from './store/useFinanceStore';
import { AnimatePresence } from 'framer-motion';

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
        return <DashboardView key="dashboard" />;
      case 'transactions':
        return <TransactionsView key="transactions" />;
      case 'insights':
        return <InsightsView key="insights" />;
      default:
        return <DashboardView key="default" />;
    }
  };

  return (
    <div className="h-screen w-full relative">
      {/* Global Background Layer */}
      <div className="fixed inset-0 bg-zinc-50 dark:bg-[#020510] z-0 transition-colors duration-500">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none hidden dark:block"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none hidden dark:block"></div>
      </div>

      <div className="flex h-screen font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden relative z-10">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
        />
        
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-md z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
          <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {renderView()}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;