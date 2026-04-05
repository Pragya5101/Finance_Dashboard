import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useFinanceStore from '../../store/useFinanceStore';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

export default function SpendingChart() {
  const { transactions } = useFinanceStore();

  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm w-full lg:w-96 flex flex-col items-center justify-center min-h-[300px] transition-colors">
        <p className="text-slate-500 dark:text-slate-400">No spending data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm w-full lg:w-96 flex flex-col transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Spending by Category</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Where your money goes</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '13px', color: '#64748b' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
