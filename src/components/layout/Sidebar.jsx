import React from 'react';
import { LayoutDashboard, Receipt, LineChart, Leaf, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'insights', label: 'Insights', icon: LineChart },
];

export default function Sidebar({ currentView, setCurrentView, isOpen, setIsOpen }) {
  return (
    <aside className={cn(
      "w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-screen flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:tranzinc-x-0 group",
      isOpen ? "tranzinc-x-0" : "-tranzinc-x-full"
    )}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30 p-2 rounded-2xl text-white transform group-hover:scale-105 transition-all duration-300">
            <Leaf size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">EcoDesk</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 -mr-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
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
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-sm",
                isActive 
                  ? "bg-violet-50 text-violet-700 shadow-md shadow-black/5" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-violet-600" : "text-zinc-400")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 text-sm text-zinc-500 dark:text-zinc-400">
          <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Need help?</p>
          <p>Reach out to our contact support.</p>
        </div>
      </div>
    </aside>
  );
}
