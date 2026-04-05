import React from 'react';
import { LayoutDashboard, Receipt, LineChart, Wallet, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'insights', label: 'Insights', icon: LineChart },
];

export default function Sidebar({ currentView, setCurrentView, isOpen, setIsOpen }) {
  return (
    <aside className={cn(
      "w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-xl text-white">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">FinBoard</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 -mr-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if(setIsOpen) setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
                isActive 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-indigo-600" : "text-slate-400")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-slate-500 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Need help?</p>
          <p>Check out our docs or contact support.</p>
        </div>
      </div>
    </aside>
  );
}
