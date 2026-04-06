import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import useFinanceStore from '../../store/useFinanceStore'
import { formatCurrency } from '../../utils/calculations'

/**
 * Custom tooltip for the monthly comparison chart.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card-lg border border-surface-100 dark:border-surface-700 px-4 py-3">
      <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2">
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-surface-500 dark:text-surface-400">
            {entry.name}:
          </span>
          <span className="text-xs font-semibold text-surface-800 dark:text-surface-200">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Custom legend for the bar chart.
 */
function CustomLegend({ payload }) {
  return (
    <div className="flex justify-center gap-6 mt-2">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-sm"
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
 * Grouped bar chart comparing monthly income vs expenses.
 */
export default function MonthlyComparisonChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const darkMode = useFinanceStore((s) => s.darkMode)

  // Group by month
  const monthlyData = (() => {
    const map = {}

    transactions.forEach((t) => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!map[key]) {
        map[key] = {
          month: key,
          label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          income: 0,
          expense: 0,
        }
      }
      if (t.type === 'income') {
        map[key].income += t.amount
      } else {
        map[key].expense += t.amount
      }
    })

    return Object.values(map)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((d) => ({
        ...d,
        income: Math.round(d.income * 100) / 100,
        expense: Math.round(d.expense * 100) / 100,
      }))
  })()

  if (monthlyData.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">
          Income vs Expenses
        </h3>
        <div className="flex items-center justify-center h-[260px] text-surface-400 text-sm">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">
        Income vs Expenses
      </h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? '#334155' : '#e2e8f0'}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? '#1e293b' : '#f1f5f9', radius: 4 }} />
            <Legend content={<CustomLegend />} />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
