import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { getExpensesByCategory, formatCurrency } from '../../utils/calculations'
import useFinanceStore from '../../store/useFinanceStore'

/** Curated color palette for pie chart segments */
const COLORS = [
  '#6366f1', // indigo
  '#f43f5e', // rose
  '#10b981', // emerald
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#ef4444', // red
  '#06b6d4', // cyan
]

/**
 * Custom tooltip for the expense pie chart.
 */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const { category, total, percent } = payload[0].payload

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card-lg border border-surface-100 dark:border-surface-700 px-4 py-3">
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">{category}</p>
      <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
        {formatCurrency(total)}
      </p>
      <p className="text-xs text-surface-400 dark:text-surface-500">
        {percent}% of expenses
      </p>
    </div>
  )
}

/**
 * Custom legend rendered below the chart.
 */
function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-surface-600 dark:text-surface-400">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Pie chart showing expense distribution by category.
 */
export default function ExpensePieChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const data = getExpensesByCategory(transactions)

  // Add percentage to each segment
  const totalExpenses = data.reduce((sum, d) => sum + d.total, 0)
  const chartData = data.map((d) => ({
    ...d,
    percent: totalExpenses > 0 ? ((d.total / totalExpenses) * 100).toFixed(1) : 0,
  }))

  if (chartData.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">
          Expenses by Category
        </h3>
        <div className="flex items-center justify-center h-[260px] text-surface-400 text-sm">
          No expense data
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">
        Expenses by Category
      </h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="45%"
              outerRadius={85}
              innerRadius={50}
              paddingAngle={3}
              strokeWidth={0}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-opacity duration-200 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
