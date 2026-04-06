import React from 'react';
import { Bell, Search, User, Moon, Sun, Menu } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

export default function Header({ setIsMobileMenuOpen }) {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 h-20 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 transition-colors">
      <div className="flex-1 flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500 hidden sm:inline-block">Role:</span>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-violet-50 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 text-sm font-medium px-3 py-1.5 rounded-lg border border-violet-100 dark:border-violet-800/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button 
          onClick={toggleTheme}
          className="relative p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="relative p-2 text-zinc-400 hover:text-zinc-600 transition-colors hidden sm:block">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-zinc-200 pl-4 sm:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Pragya Kumari</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{role}</p>
          </div>
          <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-700">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
