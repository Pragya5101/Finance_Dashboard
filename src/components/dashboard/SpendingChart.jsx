import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import useFinanceStore from '../../store/useFinanceStore';
import { cn } from '../../lib/utils';

// Neon premium colors
const COLORS = ['#06b6d4', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

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

  const totalExpense = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  if (data.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5 w-full lg:w-96 flex flex-col items-center justify-center min-h-[400px] transition-colors relative overflow-hidden group">
        <p className="text-zinc-500 dark:text-slate-400">No spending data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5 w-full lg:w-[400px] flex flex-col transition-colors relative overflow-hidden group">
      
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="mb-4 relative z-10">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Category Split</h3>
        <p className="text-sm text-zinc-500 dark:text-slate-400">Detailed view of your expenditures</p>
      </div>
      
      <div className="relative h-[240px] w-full flex items-center justify-center z-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity duration-300 outline-none" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                backdropFilter: 'blur(8px)',
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                color: '#fff',
                fontWeight: 500
              }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Central KPI */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-slate-400 font-semibold mb-1">Total</span>
          <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">${totalExpense.toLocaleString()}</span>
        </div>
      </div>

      {/* Custom Data Legend */}
      <div className="mt-4 flex flex-col gap-3 relative z-10 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
        {data.map((item, idx) => {
          const color = COLORS[idx % COLORS.length];
          const percentage = ((item.value / totalExpense) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex flex-col gap-1.5 p-2 rounded-xl hover:bg-zinc-100/50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }}></span>
                  <span className="font-medium text-zinc-700 dark:text-slate-200">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-zinc-900 dark:text-white">${item.value.toLocaleString()}</span>
                  <span className="text-zinc-400 dark:text-slate-500 text-xs w-10 text-right">{percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
