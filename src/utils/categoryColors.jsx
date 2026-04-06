/**
 * Category color mapping for visual identification.
 * Each category gets a consistent color used across the table and charts.
 */

const CATEGORY_COLORS = {
  // Expense categories
  Food: { bg: 'bg-rose-100 dark:bg-rose-900/30', dot: 'bg-rose-500' },
  Transport: { bg: 'bg-violet-100 dark:bg-violet-900/30', dot: 'bg-violet-500' },
  Shopping: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', dot: 'bg-emerald-500' },
  Bills: { bg: 'bg-blue-100 dark:bg-blue-900/30', dot: 'bg-blue-500' },
  Entertainment: { bg: 'bg-purple-100 dark:bg-purple-900/30', dot: 'bg-purple-500' },
  Health: { bg: 'bg-pink-100 dark:bg-pink-900/30', dot: 'bg-pink-500' },
  Education: { bg: 'bg-amber-100 dark:bg-amber-900/30', dot: 'bg-amber-500' },

  // Income categories
  Salary: { bg: 'bg-green-100 dark:bg-green-900/30', dot: 'bg-green-500' },
  Freelance: { bg: 'bg-teal-100 dark:bg-teal-900/30', dot: 'bg-teal-500' },
  Investment: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', dot: 'bg-indigo-500' },
  Refund: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', dot: 'bg-cyan-500' },
}

const DEFAULT_COLOR = { bg: 'bg-surface-100 dark:bg-surface-800', dot: 'bg-surface-400' }

/**
 * Get color config for a category.
 * @param {string} category
 * @returns {{ bg: string, dot: string }}
 */
export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || DEFAULT_COLOR
}

/**
 * CategoryDot — small colored dot for visual identification.
 */
export function CategoryDot({ category, size = 'sm' }) {
  const { dot } = getCategoryColor(category)
  const sizeClasses = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'

  return <span className={`inline-block ${sizeClasses} rounded-full ${dot} shrink-0`} />
}

/**
 * CategoryBadge — category name with colored dot.
 */
export function CategoryBadge({ category }) {
  return (
    <div className="flex items-center gap-1.5">
      <CategoryDot category={category} />
      <span>{category}</span>
    </div>
  )
}
