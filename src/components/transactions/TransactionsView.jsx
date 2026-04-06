import React, { useState, useMemo } from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { Search, Filter, Plus, FileDown, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionsView() {
  const { transactions, role, isLoading } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const txDate = parseISO(t.date);
        matchesDate = isWithinInterval(txDate, {
          start: startOfDay(new Date(dateRange.start)),
          end: endOfDay(new Date(dateRange.end))
        });
      }

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });
  }, [transactions, searchTerm, filterType, filterCategory, dateRange]);

  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Amount', 'Category', 'Type'];
    const rows = filteredTransactions.map(t => 
      [t.id, t.date, `"${t.description}"`, t.amount, `"${t.category}"`, t.type]
    );
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    setShowExportMenu(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Transactions</h2>
          <p className="text-zinc-500 dark:text-zinc-400">View and manage all your financial activities.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto relative">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2.5 rounded-2xl font-medium transition-colors w-full sm:w-auto shadow-md shadow-black/5"
            >
              <FileDown size={18} />
              Export
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-700 overflow-hidden z-10"
                >
                  <button onClick={exportToCSV} className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-200 transition-colors">Export as CSV</button>
                  <button onClick={exportToJSON} className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-200 transition-colors border-t border-zinc-100 dark:border-zinc-700">Export as JSON</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:bg-violet-700 text-white px-4 py-2.5 rounded-2xl font-medium transition-colors w-full sm:w-auto shadow-md shadow-black/5 shadow-violet-200 dark:shadow-none"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5 overflow-hidden transition-colors">
        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-700 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Search by description or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-50/50 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-1 border border-zinc-200 dark:border-zinc-700">
                <input 
                  type="date" 
                  value={dateRange.start}
                  onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-transparent text-sm text-zinc-700 dark:text-zinc-300 px-2 py-1 focus:outline-none dark:[color-scheme:dark]" 
                />
                <span className="text-zinc-400 text-sm">to</span>
                <input 
                  type="date" 
                  value={dateRange.end}
                  onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="bg-transparent text-sm text-zinc-700 dark:text-zinc-300 px-2 py-1 focus:outline-none dark:[color-scheme:dark]" 
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-violet-600 mb-2" size={24} />
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Syncing changes...</span>
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-700">
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Description</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Amount</th>
                {role === 'admin' && <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <AnimatePresence mode='popLayout'>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 5 : 4} className="py-12 text-center text-zinc-500">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={tx.id} 
                    className="border-b border-zinc-50 dark:border-zinc-700/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-700/30 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-zinc-500 dark:text-zinc-400">
                      {format(parseISO(tx.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{tx.description}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={cn(
                        "text-sm font-bold",
                        tx.type === 'income' ? "text-teal-600 dark:text-teal-400" : "text-orange-600 dark:text-orange-400"
                      )}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    {role === 'admin' && (
                      <td className="py-4 px-6 text-right">
                        <button className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 font-medium">Edit</button>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
            </AnimatePresence>
          </table>
        </div>
      </div>

      <AnimatePresence>
      {showAddForm && (
        <TransactionModal onClose={() => setShowAddForm(false)} />
      )}
      </AnimatePresence>
    </motion.div>
  );
}

function TransactionModal({ onClose }) {
  const { addTransaction, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) return;

    await addTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] w-full max-w-md shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Add New Transaction</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
            <input required type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-zinc-900 dark:text-zinc-100" placeholder="e.g. Weekly Groceries" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Amount</label>
              <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-zinc-900 dark:text-zinc-100" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Type</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-zinc-900 dark:text-zinc-100 dark:[color-scheme:dark]">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
              <input required type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-zinc-900 dark:text-zinc-100" placeholder="e.g. Groceries" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date</label>
              <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-zinc-900 dark:text-zinc-100 dark:[color-scheme:dark]" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 font-medium text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:bg-violet-700 rounded-lg transition-colors shadow-md shadow-black/5 shadow-violet-200 disabled:opacity-70">
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              Save Transaction
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
