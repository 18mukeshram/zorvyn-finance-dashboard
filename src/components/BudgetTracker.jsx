import { useState, useMemo } from 'react'
import { Target, Plus, Pencil, Trash2 } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import useToastStore from '../store/useToastStore'
import { formatCurrency } from '../utils/calculations'
import { getCategoryColor } from '../utils/categoryColors'
import { CATEGORIES } from '../data/mockData'

/**
 * Default budget limits per category.
 */
const DEFAULT_BUDGETS = {
  Food: 500,
  Transport: 300,
  Shopping: 400,
  Bills: 250,
  Entertainment: 200,
  Health: 150,
  Education: 300,
}

/**
 * Progress bar component for budget visualization.
 */
function BudgetBar({ category, spent, limit }) {
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
  const isOver = spent > limit
  const { dot } = getCategoryColor(category)

  const barColor = isOver
    ? 'bg-expense-500'
    : percentage > 75
      ? 'bg-amber-500'
      : 'bg-income-500'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
            {category}
          </span>
        </div>
        <div className="text-xs text-surface-500 dark:text-surface-400">
          <span className={isOver ? 'text-expense-600 dark:text-expense-400 font-semibold' : ''}>
            {formatCurrency(spent)}
          </span>
          <span className="mx-1">/</span>
          <span>{formatCurrency(limit)}</span>
        </div>
      </div>
      <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isOver && (
        <p className="text-xs text-expense-500 dark:text-expense-400 font-medium">
          Over budget by {formatCurrency(spent - limit)}
        </p>
      )}
    </div>
  )
}

/**
 * Budget tracker section — shows spending progress per expense category.
 */
export default function BudgetTracker() {
  const transactions = useFinanceStore((s) => s.transactions)
  const role = useFinanceStore((s) => s.role)
  const addToast = useToastStore((s) => s.addToast)

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('zorvyn-budgets')
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS
  })

  const [editingCategory, setEditingCategory] = useState(null)
  const [editValue, setEditValue] = useState('')

  const isAdmin = role === 'admin'

  // Calculate spending per expense category
  const spending = useMemo(() => {
    const map = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount
      })
    return map
  }, [transactions])

  const handleEdit = (category) => {
    setEditingCategory(category)
    setEditValue(String(budgets[category] || 0))
  }

  const handleSave = () => {
    if (!editingCategory) return
    const val = parseFloat(editValue)
    if (isNaN(val) || val <= 0) return

    const updated = { ...budgets, [editingCategory]: val }
    setBudgets(updated)
    localStorage.setItem('zorvyn-budgets', JSON.stringify(updated))
    addToast('success', `Budget for ${editingCategory} set to ${formatCurrency(val)}`)
    setEditingCategory(null)
  }

  const expenseCategories = CATEGORIES.expense

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-brand-500" />
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300">
            Budget Tracker
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {expenseCategories.map((category) => {
          const spent = Math.round((spending[category] || 0) * 100) / 100
          const limit = budgets[category] || 0

          return (
            <div key={category} className="group">
              {editingCategory === category ? (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-surface-600 dark:text-surface-400">{category}:</span>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="input w-28 text-sm py-1.5"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    className="px-2 py-1 text-xs font-medium text-income-600 bg-income-50 dark:bg-income-700/20 
                               dark:text-income-400 rounded-lg hover:bg-income-100 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="px-2 py-1 text-xs font-medium text-surface-500 hover:text-surface-700 
                               dark:hover:text-surface-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <BudgetBar category={category} spent={spent} limit={limit} />
                  {isAdmin && (
                    <button
                      onClick={() => handleEdit(category)}
                      className="absolute top-0 right-0 p-1 rounded-md opacity-0 group-hover:opacity-100
                                 text-surface-400 hover:text-brand-500 transition-all duration-200"
                      title="Edit budget"
                    >
                      <Pencil size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
