/**
 * Financial calculation utilities.
 * Pure functions — no side effects, easily testable.
 */

/**
 * Sum all income transactions.
 */
export function getTotalIncome(transactions) {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Sum all expense transactions.
 */
export function getTotalExpenses(transactions) {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Calculate net balance (income - expenses).
 */
export function getBalance(transactions) {
  return getTotalIncome(transactions) - getTotalExpenses(transactions)
}

/**
 * Group expenses by category with totals.
 * Returns sorted array: [{ category, total }, ...]
 */
export function getExpensesByCategory(transactions) {
  const map = {}

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })

  return Object.entries(map)
    .map(([category, total]) => ({ category, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total)
}

/**
 * Calculate running balance over time for line chart.
 * Returns array sorted by date: [{ date, balance }, ...]
 */
export function getBalanceOverTime(transactions) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  let runningBalance = 0
  return sorted.map((t) => {
    runningBalance += t.type === 'income' ? t.amount : -t.amount
    return {
      date: t.date,
      balance: Math.round(runningBalance * 100) / 100,
      description: t.description,
    }
  })
}

/**
 * Find the highest spending category.
 * Returns { category, total } or null if no expenses.
 */
export function getHighestSpendingCategory(transactions) {
  const byCategory = getExpensesByCategory(transactions)
  return byCategory.length > 0 ? byCategory[0] : null
}

/**
 * Compare monthly expenses.
 * Returns array: [{ month, total }, ...] sorted chronologically.
 */
export function getMonthlyExpenseComparison(transactions) {
  const map = {}

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      map[key] = (map[key] || 0) + t.amount
    })

  return Object.entries(map)
    .map(([month, total]) => ({
      month,
      label: new Date(month + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      total: Math.round(total * 100) / 100,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

/**
 * Calculate the average expense per transaction.
 */
export function getAverageExpense(transactions) {
  const expenses = transactions.filter((t) => t.type === 'expense')
  if (expenses.length === 0) return 0
  const total = expenses.reduce((sum, t) => sum + t.amount, 0)
  return Math.round((total / expenses.length) * 100) / 100
}

/**
 * Get total number of transactions.
 */
export function getTotalTransactions(transactions) {
  return transactions.length
}

/**
 * Format a number as USD currency string.
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
