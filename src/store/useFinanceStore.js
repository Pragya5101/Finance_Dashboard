import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

const useFinanceStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'light' | 'dark'
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      role: 'user', // 'user' | 'admin'
      setRole: (role) => set({ role }),
      
      budgetTarget: 2000,
      setBudgetTarget: (target) => set({ budgetTarget: target }),
      
      transactions: dummyTransactions,
      
      isLoading: false,
      error: null,
      
      addTransaction: async (transaction) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 600)); // Mock API delay
          set((state) => ({
            transactions: [{ ...transaction, id: Date.now().toString() }, ...state.transactions],
            isLoading: false
          }));
        } catch (err) {
          set({ error: 'Failed to add transaction', isLoading: false });
        }
      },
      
      updateTransaction: async (id, updatedTransaction) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          set((state) => ({
            transactions: state.transactions.map(t => t.id === id ? { ...t, ...updatedTransaction } : t),
            isLoading: false
          }));
        } catch (err) {
          set({ error: 'Failed to update transaction', isLoading: false });
        }
      },
      
      deleteTransaction: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          set((state) => ({
            transactions: state.transactions.filter(t => t.id !== id),
            isLoading: false
          }));
        } catch (err) {
          set({ error: 'Failed to delete transaction', isLoading: false });
        }
      },
    }),
    {
      name: 'finance-dashboard-storage',
      partialize: (state) => ({
        theme: state.theme,
        transactions: state.transactions,
        role: state.role,
        budgetTarget: state.budgetTarget
      }), // Save to local storage
    }
  )
);

export default useFinanceStore;
