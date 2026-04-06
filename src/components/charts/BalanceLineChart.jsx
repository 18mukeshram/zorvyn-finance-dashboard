import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { getBalanceOverTime, formatCurrency } from '../../utils/calculations'
import useFinanceStore from '../../store/useFinanceStore'

/**
 * Custom tooltip for the balance line chart.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card-lg border border-surface-100 dark:border-surface-700 px-4 py-3">
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">
        {new Date(label).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
        {formatCurrency(payload[0].value)}
      </p>
      {payload[0].payload.description && (
        <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
          {payload[0].payload.description}
        </p>
      )}
    </div>
  )
}

/**
 * Area chart showing running balance over time.
 * Uses gradient fill for a premium visual effect.
 */
export default function BalanceLineChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const darkMode = useFinanceStore((s) => s.darkMode)
  const data = getBalanceOverTime(transactions)

  if (data.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">
          Balance Over Time
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
        Balance Over Time
      </h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? '#334155' : '#e2e8f0'}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', { month: 'short' })
              }
            />
            <YAxis
              tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#6366f1',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
