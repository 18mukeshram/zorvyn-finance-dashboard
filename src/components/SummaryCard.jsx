import { formatCurrency } from '../utils/calculations'

/**
 * Reusable summary metric card.
 * Displays a financial metric with icon, label, value, and color accent.
 *
 * @param {Object} props
 * @param {string} props.label - Card title (e.g., "Total Balance")
 * @param {number} props.value - Numeric value to display
 * @param {React.Component} props.icon - Lucide icon component
 * @param {'brand' | 'income' | 'expense'} props.variant - Color variant
 * @param {string} [props.subtitle] - Optional subtitle text
 */
export default function SummaryCard({ label, value, icon: Icon, variant = 'brand', subtitle }) {
  const colorMap = {
    brand: {
      bg: 'bg-brand-50 dark:bg-brand-900/20',
      icon: 'text-brand-600 dark:text-brand-400',
      value: 'text-brand-700 dark:text-brand-300',
      ring: 'ring-brand-100 dark:ring-brand-800/30',
    },
    income: {
      bg: 'bg-income-50 dark:bg-income-700/10',
      icon: 'text-income-600 dark:text-income-400',
      value: 'text-income-700 dark:text-income-300',
      ring: 'ring-income-100 dark:ring-income-800/30',
    },
    expense: {
      bg: 'bg-expense-50 dark:bg-expense-700/10',
      icon: 'text-expense-600 dark:text-expense-400',
      value: 'text-expense-700 dark:text-expense-300',
      ring: 'ring-expense-100 dark:ring-expense-800/30',
    },
  }

  const colors = colorMap[variant]

  return (
    <div
      className="card p-5 sm:p-6 group hover:-translate-y-0.5 
                 transition-all duration-300 cursor-default animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Label & Value */}
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
            {label}
          </p>
          <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight ${colors.value}`}>
            {formatCurrency(value)}
          </p>
          {subtitle && (
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${colors.bg} ring-1 ${colors.ring}
                      group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={20} className={colors.icon} />
        </div>
      </div>
    </div>
  )
}
