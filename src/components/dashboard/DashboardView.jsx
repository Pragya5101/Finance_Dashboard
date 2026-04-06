import React from 'react';
import { motion } from 'framer-motion';
import SummaryCards from './SummaryCards';
import BalanceChart from './BalanceChart';
import SpendingChart from './SpendingChart';

export default function DashboardView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div>
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Financial Overview</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Welcome back, here is your financial summary.</p>
      </div>
      
      <SummaryCards />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <BalanceChart />
        <SpendingChart />
      </div>
    </motion.div>
  );
}
