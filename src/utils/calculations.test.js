import { describe, it, expect } from 'vitest'
import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getExpensesByCategory,
  getBalanceOverTime,
  getHighestSpendingCategory,
  getMonthlyExpenseComparison,
  getAverageExpense,
  getTotalTransactions,
  formatCurrency,
  formatDate,
} from './calculations'

// ─── Test Data ───────────────────────────────────────────────

const mockTransactions = [
  { id: '1', date: '2026-01-02', description: 'Salary', amount: 5000, type: 'income', category: 'Salary' },
  { id: '2', date: '2026-01-05', description: 'Groceries', amount: 150, type: 'expense', category: 'Food' },
  { id: '3', date: '2026-01-10', description: 'Bus Pass', amount: 80, type: 'expense', category: 'Transport' },
  { id: '4', date: '2026-02-01', description: 'Salary', amount: 5000, type: 'income', category: 'Salary' },
  { id: '5', date: '2026-02-08', description: 'Dinner', amount: 120, type: 'expense', category: 'Food' },
  { id: '6', date: '2026-02-15', description: 'Freelance', amount: 800, type: 'income', category: 'Freelance' },
]

const emptyTransactions = []

// ─── getTotalIncome ──────────────────────────────────────────

describe('getTotalIncome', () => {
  it('sums all income transactions', () => {
    expect(getTotalIncome(mockTransactions)).toBe(10800)
  })

  it('returns 0 for empty array', () => {
    expect(getTotalIncome(emptyTransactions)).toBe(0)
  })

  it('returns 0 when no income transactions exist', () => {
    const expenses = mockTransactions.filter((t) => t.type === 'expense')
    expect(getTotalIncome(expenses)).toBe(0)
  })
})

// ─── getTotalExpenses ────────────────────────────────────────

describe('getTotalExpenses', () => {
  it('sums all expense transactions', () => {
    expect(getTotalExpenses(mockTransactions)).toBe(350)
  })

  it('returns 0 for empty array', () => {
    expect(getTotalExpenses(emptyTransactions)).toBe(0)
  })
})

// ─── getBalance ──────────────────────────────────────────────

describe('getBalance', () => {
  it('calculates net balance (income - expenses)', () => {
    expect(getBalance(mockTransactions)).toBe(10450)
  })

  it('returns 0 for empty array', () => {
    expect(getBalance(emptyTransactions)).toBe(0)
  })

  it('returns negative when expenses exceed income', () => {
    const onlyExpenses = [
      { id: '1', date: '2026-01-01', description: 'Test', amount: 500, type: 'expense', category: 'Food' },
    ]
    expect(getBalance(onlyExpenses)).toBe(-500)
  })
})

// ─── getExpensesByCategory ───────────────────────────────────

describe('getExpensesByCategory', () => {
  it('groups and sorts expenses by category (highest first)', () => {
    const result = getExpensesByCategory(mockTransactions)
    expect(result).toHaveLength(2)
    expect(result[0].category).toBe('Food')
    expect(result[0].total).toBe(270)
    expect(result[1].category).toBe('Transport')
    expect(result[1].total).toBe(80)
  })

  it('returns empty array when no expenses exist', () => {
    const incomeOnly = mockTransactions.filter((t) => t.type === 'income')
    expect(getExpensesByCategory(incomeOnly)).toEqual([])
  })
})

// ─── getBalanceOverTime ──────────────────────────────────────

describe('getBalanceOverTime', () => {
  it('returns running balance sorted by date', () => {
    const result = getBalanceOverTime(mockTransactions)
    expect(result).toHaveLength(6)
    // First entry: +5000 income
    expect(result[0].balance).toBe(5000)
    // Second entry: -150 expense → 4850
    expect(result[1].balance).toBe(4850)
    // Last entry should be the net balance
    expect(result[result.length - 1].balance).toBe(10450)
  })

  it('returns dates in chronological order', () => {
    const result = getBalanceOverTime(mockTransactions)
    for (let i = 1; i < result.length; i++) {
      expect(new Date(result[i].date).getTime()).toBeGreaterThanOrEqual(
        new Date(result[i - 1].date).getTime()
      )
    }
  })
})

// ─── getHighestSpendingCategory ──────────────────────────────

describe('getHighestSpendingCategory', () => {
  it('returns the category with the highest total expense', () => {
    const result = getHighestSpendingCategory(mockTransactions)
    expect(result).not.toBeNull()
    expect(result.category).toBe('Food')
    expect(result.total).toBe(270)
  })

  it('returns null when no expenses exist', () => {
    expect(getHighestSpendingCategory(emptyTransactions)).toBeNull()
  })
})

// ─── getMonthlyExpenseComparison ─────────────────────────────

describe('getMonthlyExpenseComparison', () => {
  it('groups expenses by month chronologically', () => {
    const result = getMonthlyExpenseComparison(mockTransactions)
    expect(result).toHaveLength(2) // Jan + Feb
    expect(result[0].month).toBe('2026-01')
    expect(result[0].total).toBe(230) // 150 + 80
    expect(result[1].month).toBe('2026-02')
    expect(result[1].total).toBe(120)
  })

  it('returns empty array for no expenses', () => {
    expect(getMonthlyExpenseComparison(emptyTransactions)).toEqual([])
  })
})

// ─── getAverageExpense ───────────────────────────────────────

describe('getAverageExpense', () => {
  it('calculates average expense per transaction', () => {
    // 3 expenses: 150 + 80 + 120 = 350, avg = 116.67
    expect(getAverageExpense(mockTransactions)).toBeCloseTo(116.67, 1)
  })

  it('returns 0 when there are no expenses', () => {
    expect(getAverageExpense(emptyTransactions)).toBe(0)
  })
})

// ─── getTotalTransactions ────────────────────────────────────

describe('getTotalTransactions', () => {
  it('returns the total count of transactions', () => {
    expect(getTotalTransactions(mockTransactions)).toBe(6)
  })

  it('returns 0 for empty array', () => {
    expect(getTotalTransactions(emptyTransactions)).toBe(0)
  })
})

// ─── formatCurrency ──────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats number as USD currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats large numbers with commas', () => {
    expect(formatCurrency(35828.28)).toBe('$35,828.28')
  })

  it('rounds to 2 decimal places', () => {
    expect(formatCurrency(99.999)).toBe('$100.00')
  })
})

// ─── formatDate ──────────────────────────────────────────────

describe('formatDate', () => {
  it('formats date string to human-readable format', () => {
    const result = formatDate('2026-01-15')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2026')
  })
})
