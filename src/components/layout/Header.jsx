import React from 'react';
import { Bell, Search, User, Moon, Sun, Menu } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

export default function Header({ setIsMobileMenuOpen }) {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-20 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 transition-colors">
      <div className="flex-1 flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 hidden sm:inline-block">Role:</span>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 text-sm font-medium px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button 
          onClick={toggleTheme}
          className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Pragya Kumari</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
