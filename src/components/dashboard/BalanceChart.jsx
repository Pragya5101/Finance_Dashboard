import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useFinanceStore from '../../store/useFinanceStore';
import { format, subDays } from 'date-fns';

export default function BalanceChart() {
  const { transactions } = useFinanceStore();

  const data = useMemo(() => {
    // Basic logic to generate a trend for the last 7 days based on transactions.
    // In a real app we'd need history. Here we simulate a starting balance and calculate.
    let currentBalance = 5000; 
    const result = [];
    
    // Reverse logic just to generate a nice chart looking forward
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayTransactions = transactions.filter(t => t.date === dateStr);
      let dailyIncome = 0;
      let dailyExpense = 0;
      
      dayTransactions.forEach(t => {
        if (t.type === 'income') dailyIncome += t.amount;
        if (t.type === 'expense') dailyExpense += t.amount;
      });

      currentBalance += (dailyIncome - dailyExpense);
      
      result.push({
        date: format(date, 'MMM dd'),
        balance: currentBalance
      });
    }
    
    return result;
  }, [transactions]);

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5 flex-1 transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Balance Trend</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Your total balance history over the last 7 days</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              formatter={(value) => [`$${value}`, 'Balance']}
            />
            <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
