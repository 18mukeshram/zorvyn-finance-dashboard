import { useState, useEffect, useCallback } from 'react'
import { Wallet, TrendingUp, TrendingDown, Activity, Keyboard } from 'lucide-react'
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
import BudgetTracker from '../components/BudgetTracker'
import DashboardSkeleton from '../components/Skeleton'
import ToastContainer from '../components/Toast'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'

/**
 * Main dashboard page — assembles all sections.
 */
export default function Dashboard() {
  const transactions = useFinanceStore((s) => s.transactions)
  const [isLoading, setIsLoading] = useState(true)
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Callback for keyboard shortcut to open add modal
  // TransactionTable manages its own modal, so we scroll to it and click the button
  const handleAddViaShortcut = useCallback(() => {
    const btn = document.getElementById('add-transaction-btn')
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => btn.click(), 300)
    }
  }, [])

  // Register keyboard shortcuts
  useKeyboardShortcuts({ onAddTransaction: handleAddViaShortcut })

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
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Keyboard shortcuts hint */}
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300
                           hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-200
                           hidden sm:flex items-center"
                title="Keyboard shortcuts"
              >
                <Keyboard size={18} />
              </button>
              <RoleToggle />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Keyboard Shortcuts Panel ───────────────────── */}
      {showShortcuts && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 animate-fade-in">
          <div className="card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300">
                ⌨️ Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
              >
                Hide
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {[
                { key: 'N', desc: 'Add Transaction' },
                { key: 'D', desc: 'Toggle Dark Mode' },
                { key: '/', desc: 'Focus Search' },
                { key: '1', desc: 'All Transactions' },
                { key: '2', desc: 'Income Only' },
                { key: '3', desc: 'Expenses Only' },
              ].map(({ key, desc }) => (
                <div key={key} className="flex items-center gap-2">
                  <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-surface-100 dark:bg-surface-800 
                                  text-surface-600 dark:text-surface-300 rounded-md border border-surface-200 
                                  dark:border-surface-700 min-w-[28px] text-center">
                    {key}
                  </kbd>
                  <span className="text-xs text-surface-500 dark:text-surface-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

            {/* Charts Row 2: Monthly Comparison + Budget Tracker */}
            <section id="monthly-budget" className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="lg:col-span-3">
                <MonthlyComparisonChart />
              </div>
              <div className="lg:col-span-2">
                <BudgetTracker />
              </div>
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
