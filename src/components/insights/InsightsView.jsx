import React, { useMemo, useState } from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { Target, TrendingDown, TrendingUp, AlertCircle, Edit2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function InsightsView() {
  const { transactions, budgetTarget, setBudgetTarget } = useFinanceStore();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budgetTarget);

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

  const handleBudgetSave = () => {
    if (tempBudget > 0) {
      setBudgetTarget(Number(tempBudget));
      setIsEditingBudget(false);
    }
  };

  const budgetProgress = Math.min((insights.totalExpense / budgetTarget) * 100, 100);
  const isOverBudget = insights.totalExpense > budgetTarget;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Financial Insights</h2>
        <p className="text-zinc-500 dark:text-zinc-400">AI-driven patterns and observations from your data.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Budget Target Card */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5 transition-colors xl:col-span-3">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-2xl shrink-0 transition-colors", isOverBudget ? "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" : "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400")}>
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Monthly Budget Target</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Track your expenses against your goal.</p>
              </div>
            </div>
            
            {isEditingBudget ? (
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="w-24 px-2 py-1 text-sm border border-zinc-200 dark:border-zinc-600 rounded-md dark:bg-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  autoFocus
                />
                <button onClick={handleBudgetSave} className="p-1.5 bg-teal-100 text-teal-600 rounded-md hover:bg-teal-200 transition-colors"><Check size={16} /></button>
                <button onClick={() => {setIsEditingBudget(false); setTempBudget(budgetTarget)}} className="p-1.5 bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-200 transition-colors"><X size={16} /></button>
              </div>
            ) : (
              <button onClick={() => setIsEditingBudget(true)} className="p-2 text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors">
                <Edit2 size={18} />
              </button>
            )}
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-500 dark:text-zinc-400">Spent: <span className="font-semibold text-zinc-800 dark:text-zinc-200">${insights.totalExpense.toLocaleString()}</span></span>
              <span className="text-zinc-500 dark:text-zinc-400">Target: <span className="font-semibold text-zinc-800 dark:text-zinc-200">${budgetTarget.toLocaleString()}</span></span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-3 mb-2 overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500", isOverBudget ? "bg-orange-500" : "bg-gradient-to-r from-violet-600 to-cyan-500")}
                style={{ width: `${budgetProgress}%` }}
              ></div>
            </div>
            
            {isOverBudget ? (
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <AlertCircle size={14} /> 
                You have exceeded your budget by ${(insights.totalExpense - budgetTarget).toLocaleString()}
              </p>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                You have ${(budgetTarget - insights.totalExpense).toLocaleString()} left to spend this month.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Insight 1 */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5 flex items-start gap-4 transition-colors">
          <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-3 rounded-2xl shrink-0">
            <TrendingDown size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1">Top Spending Area</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-3">
              Your highest expense category is <span className="font-semibold text-zinc-700 dark:text-zinc-300">{insights.highestCategory}</span>, 
              amounting to <span className="font-semibold text-zinc-700 dark:text-zinc-300">${insights.highestAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>.
            </p>
            {insights.totalExpense > 0 && (
              <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-2 mb-1">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min((insights.highestAmount / insights.totalExpense) * 100, 100)}%` }}></div>
              </div>
            )}
            <p className="text-xs text-zinc-400">
              {insights.totalExpense > 0 ? ((insights.highestAmount / insights.totalExpense) * 100).toFixed(0) : 0}% of total expenses
            </p>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5 flex items-start gap-4 transition-colors">
          <div className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 p-3 rounded-2xl shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1">Savings Rate</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-3">
              You are currently saving <span className="font-semibold text-zinc-700 dark:text-zinc-300">{insights.savingsRate}%</span> of your income based on recorded transactions.
            </p>
            <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
              <TrendingUp size={16} />
              Looking good! Aim for 20%
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-6 rounded-[2rem] shadow-md shadow-black/5 text-white col-span-1 md:col-span-2 flex flex-col sm:flex-row items-center sm:justify-between gap-6 overflow-hidden relative transition-colors">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle size={20} className="text-violet-200" />
              <h3 className="text-lg font-bold">Monthly Observation</h3>
            </div>
            <p className="text-violet-100 max-w-xl">
              Based on your pattern, your expenses tend to spike around the weekend. 
              Consider reviewing your entertainment and dining budget to optimize your savings rate further.
            </p>
          </div>
          
          <button onClick={() => { setIsEditingBudget(true); window.scrollTo({top:0, behavior:'smooth'}) }} className="relative z-10 whitespace-nowrap bg-white text-violet-600 hover:bg-violet-50 px-5 py-2.5 rounded-2xl font-medium transition-colors shadow-md shadow-black/5">
            Review Budget Target
          </button>
        </div>

      </div>
    </motion.div>
  );
}
