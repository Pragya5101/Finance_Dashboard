import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { cn } from '../../lib/utils';

export default function SummaryCards() {
  const { transactions } = useFinanceStore();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      icon: DollarSign,
      trend: '+2.5%',
      isPositive: true,
      color: 'indigo'
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: ArrowUpRight,
      trend: '+12.5%',
      isPositive: true,
      color: 'emerald'
    },
    {
      title: 'Total Expenses',
      amount: totalExpense,
      icon: ArrowDownRight,
      trend: '-4.1%',
      isPositive: false,
      color: 'rose'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "p-3 rounded-xl",
                card.color === 'indigo' && "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
                card.color === 'emerald' && "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
                card.color === 'rose' && "bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
              )}>
                <Icon size={24} />
              </div>
              <span className={cn(
                "text-sm font-medium flex items-center px-2 py-1 rounded-full",
                card.isPositive ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"
              )}>
                {card.trend}
              </span>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                ${card.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
