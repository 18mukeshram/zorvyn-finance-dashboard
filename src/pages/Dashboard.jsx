import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import { getTotalIncome, getTotalExpenses, getBalance } from '../utils/calculations'
import DarkModeToggle from '../components/DarkModeToggle'
import RoleToggle from '../components/RoleToggle'
import SummaryCard from '../components/SummaryCard'
import BalanceLineChart from '../components/charts/BalanceLineChart'
import ExpensePieChart from '../components/charts/ExpensePieChart'
import MonthlyComparisonChart from '../components/charts/MonthlyComparisonChart'
import Insights from '../components/Insights'
import TransactionTable from '../components/TransactionTable'
import DashboardSkeleton from '../components/Skeleton'
import ToastContainer from '../components/Toast'

/**
 * Main dashboard page — assembles all sections.
 */
export default function Dashboard() {
  const transactions = useFinanceStore((s) => s.transactions)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial loading state for hydration
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const totalIncome = getTotalIncome(transactions)
  const totalExpenses = getTotalExpenses(transactions)
  const balance = getBalance(transactions)

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      {/* ─── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-100 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-600">
                <Activity size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-surface-900 dark:text-surface-50 leading-none">
                  Zorvyn
                </h1>
                <p className="text-[10px] font-medium text-surface-400 dark:text-surface-500 uppercase tracking-widest leading-none mt-0.5">
                  Finance
                </p>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              <RoleToggle />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Loading Skeleton ───────────────────────────── */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* ─── Main Content ───────────────────────────────── */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
            {/* Summary Cards */}
            <section id="summary-cards" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <SummaryCard
                label="Total Balance"
                value={balance}
                icon={Wallet}
                variant="brand"
                subtitle="Net income minus expenses"
              />
              <SummaryCard
                label="Total Income"
                value={totalIncome}
                icon={TrendingUp}
                variant="income"
                subtitle="All incoming transactions"
              />
              <SummaryCard
                label="Total Expenses"
                value={totalExpenses}
                icon={TrendingDown}
                variant="expense"
                subtitle="All outgoing transactions"
              />
            </section>

            {/* Charts Row 1: Balance + Pie */}
            <section id="charts" className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="lg:col-span-3">
                <BalanceLineChart />
              </div>
              <div className="lg:col-span-2">
                <ExpensePieChart />
              </div>
            </section>

            {/* Charts Row 2: Monthly Comparison (full width) */}
            <section id="monthly-chart">
              <MonthlyComparisonChart />
            </section>

            {/* Insights */}
            <section id="insights">
              <Insights />
            </section>

            {/* Transactions */}
            <section id="transactions">
              <TransactionTable />
            </section>
          </main>

          {/* ─── Footer ─────────────────────────────────────── */}
          <footer className="border-t border-surface-100 dark:border-surface-800 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-xs text-center text-surface-400 dark:text-surface-500">
                Zorvyn Finance Dashboard · Built with React, Tailwind CSS, Recharts & Zustand
              </p>
            </div>
          </footer>
        </>
      )}

      {/* ─── Toast Notifications ────────────────────────── */}
      <ToastContainer />
    </div>
  )
}
