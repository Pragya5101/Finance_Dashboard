import { create } from 'zustand';
import { format, subDays } from 'date-fns';

// Generate some dummy data
const today = new Date();
const dummyTransactions = [
  { id: '1', date: format(today, 'yyyy-MM-dd'), amount: 3500, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: format(subDays(today, 1), 'yyyy-MM-dd'), amount: 120, category: 'Groceries', type: 'expense', description: 'Whole Foods' },
  { id: '3', date: format(subDays(today, 2), 'yyyy-MM-dd'), amount: 45, category: 'Entertainment', type: 'expense', description: 'Netflix Subscription' },
  { id: '4', date: format(subDays(today, 3), 'yyyy-MM-dd'), amount: 60, category: 'Transportation', type: 'expense', description: 'Uber' },
  { id: '5', date: format(subDays(today, 4), 'yyyy-MM-dd'), amount: 800, category: 'Housing', type: 'expense', description: 'Rent' },
  { id: '6', date: format(subDays(today, 5), 'yyyy-MM-dd'), amount: 150, category: 'Utilities', type: 'expense', description: 'Electricity Bill' },
  { id: '7', date: format(subDays(today, 6), 'yyyy-MM-dd'), amount: 300, category: 'Freelance', type: 'income', description: 'Web Design Project' },
  { id: '8', date: format(subDays(today, 8), 'yyyy-MM-dd'), amount: 55, category: 'Dining', type: 'expense', description: 'Dinner with friends' },
];

const useFinanceStore = create((set) => ({
  theme: 'light', // 'light' | 'dark'
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  
  role: 'viewer', // 'viewer' | 'admin'
  setRole: (role) => set({ role }),
  
  transactions: dummyTransactions,
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [{ ...transaction, id: Date.now().toString() }, ...state.transactions]
  })),
  
  updateTransaction: (id, updatedTransaction) => set((state) => ({
    transactions: state.transactions.map(t => t.id === id ? { ...t, ...updatedTransaction } : t)
  })),
  
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== id)
  })),
}));

export default useFinanceStore;
