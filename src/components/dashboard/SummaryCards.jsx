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
          <div key={index} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "p-3 rounded-2xl",
                card.color === 'indigo' && "bg-violet-50 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400",
                card.color === 'emerald' && "bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400",
                card.color === 'rose' && "bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
              )}>
                <Icon size={24} />
              </div>
              <span className={cn(
                "text-sm font-medium flex items-center px-2 py-1 rounded-full",
                card.isPositive ? "bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400" : "bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400"
              )}>
                {card.trend}
              </span>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
                ${card.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
