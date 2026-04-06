import { TrendingUp, BarChart3, Hash, Calculator } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import {
  getHighestSpendingCategory,
  getMonthlyExpenseComparison,
  getTotalTransactions,
  getAverageExpense,
  formatCurrency,
} from '../utils/calculations'

/**
 * Individual insight card.
 */
function InsightCard({ icon: Icon, label, value, detail, color }) {
  const colorMap = {
    rose: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 ring-rose-100 dark:ring-rose-800/30',
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-blue-100 dark:ring-blue-800/30',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-amber-100 dark:ring-amber-800/30',
    violet: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20 ring-violet-100 dark:ring-violet-800/30',
  }

  return (
    <div className="card p-5 group hover:-translate-y-0.5 transition-all duration-300 cursor-default">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl ring-1 ${colorMap[color]} 
                          group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-0.5">
            {label}
          </p>
          <p className="text-lg font-bold text-surface-800 dark:text-surface-100 truncate">
            {value}
          </p>
          {detail && (
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
              {detail}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Insights section — displays 4 financial insight cards.
 */
export default function Insights() {
  const transactions = useFinanceStore((s) => s.transactions)

  const highestCategory = getHighestSpendingCategory(transactions)
  const monthlyComparison = getMonthlyExpenseComparison(transactions)
  const totalCount = getTotalTransactions(transactions)
  const avgExpense = getAverageExpense(transactions)

  // Monthly comparison detail: compare last two months
  const getMonthlyDetail = () => {
    if (monthlyComparison.length < 2) return null
    const current = monthlyComparison[monthlyComparison.length - 1]
    const previous = monthlyComparison[monthlyComparison.length - 2]
    const diff = current.total - previous.total
    const pct = previous.total > 0 ? ((diff / previous.total) * 100).toFixed(1) : 0
    const direction = diff > 0 ? 'more' : 'less'
    return `${Math.abs(pct)}% ${direction} than ${previous.label}`
  }

  const latestMonth =
    monthlyComparison.length > 0
      ? monthlyComparison[monthlyComparison.length - 1]
      : null

  return (
    <div className="animate-fade-in">
      <h2 className="text-base font-semibold text-surface-800 dark:text-surface-100 mb-4">
        Financial Insights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          icon={TrendingUp}
          label="Highest Spending"
          value={highestCategory ? highestCategory.category : '—'}
          detail={highestCategory ? formatCurrency(highestCategory.total) : 'No expenses'}
          color="rose"
        />
        <InsightCard
          icon={BarChart3}
          label="Monthly Expenses"
          value={latestMonth ? formatCurrency(latestMonth.total) : '—'}
          detail={getMonthlyDetail() || (latestMonth ? latestMonth.label : 'No data')}
          color="blue"
        />
        <InsightCard
          icon={Hash}
          label="Total Transactions"
          value={totalCount}
          detail={`${transactions.filter((t) => t.type === 'income').length} income, ${
            transactions.filter((t) => t.type === 'expense').length
          } expense`}
          color="amber"
        />
        <InsightCard
          icon={Calculator}
          label="Avg. Expense"
          value={formatCurrency(avgExpense)}
          detail="Per expense transaction"
          color="violet"
        />
      </div>
    </div>
  )
}
