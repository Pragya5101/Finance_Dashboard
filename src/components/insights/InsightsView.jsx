import React, { useMemo } from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { Target, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

export default function InsightsView() {
  const { transactions } = useFinanceStore();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    // Highest spending category
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    let highestCategory = 'N/A';
    let highestAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > highestAmount) {
        highestAmount = amount;
        highestCategory = cat;
      }
    });

    const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
    const totalIncome = income.reduce((a, b) => a + b.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return {
      highestCategory,
      highestAmount,
      savingsRate: savingsRate.toFixed(1),
      totalExpense,
      totalIncome
    };
  }, [transactions]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Financial Insights</h2>
        <p className="text-slate-500 dark:text-slate-400">AI-driven patterns and observations from your data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Insight 1 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4 transition-colors">
          <div className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 p-3 rounded-xl shrink-0">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Top Spending Area</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
              Your highest expense category is <span className="font-semibold text-slate-700 dark:text-slate-300">{insights.highestCategory}</span>, 
              amounting to <span className="font-semibold text-slate-700 dark:text-slate-300">${insights.highestAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>.
            </p>
            {insights.totalExpense > 0 && (
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-1">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${Math.min((insights.highestAmount / insights.totalExpense) * 100, 100)}%` }}></div>
              </div>
            )}
            <p className="text-xs text-slate-400">
              {insights.totalExpense > 0 ? ((insights.highestAmount / insights.totalExpense) * 100).toFixed(0) : 0}% of total expenses
            </p>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4 transition-colors">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Savings Rate</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
              You are currently saving <span className="font-semibold text-slate-700 dark:text-slate-300">{insights.savingsRate}%</span> of your income based on recorded transactions.
            </p>
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <TrendingUp size={16} />
              Looking good! Aim for 20%
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-indigo-600 p-6 rounded-2xl shadow-sm text-white col-span-1 md:col-span-2 flex flex-col sm:flex-row items-center sm:justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle size={20} className="text-indigo-200" />
              <h3 className="text-lg font-bold">Monthly Observation</h3>
            </div>
            <p className="text-indigo-100 max-w-xl">
              Based on your pattern, your expenses tend to spike around the weekend. 
              Consider reviewing your entertainment and dining budget to optimize your savings rate further.
            </p>
          </div>
          
          <button className="relative z-10 whitespace-nowrap bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
            Review Budget Target
          </button>
        </div>

      </div>
    </div>
  );
}
