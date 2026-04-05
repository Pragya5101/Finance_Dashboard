import React from 'react';
import SummaryCards from './SummaryCards';
import BalanceChart from './BalanceChart';
import SpendingChart from './SpendingChart';

export default function DashboardView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Financial Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, here is your financial summary.</p>
      </div>
      
      <SummaryCards />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <BalanceChart />
        <SpendingChart />
      </div>
    </div>
  );
}
