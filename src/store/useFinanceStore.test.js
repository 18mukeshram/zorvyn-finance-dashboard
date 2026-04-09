import { describe, it, expect } from 'vitest'
import { getFilteredTransactions } from './useFinanceStore'

// ─── Test Data ───────────────────────────────────────────────

const mockTransactions = [
  { id: '1', date: '2026-01-02', description: 'Monthly Salary', amount: 5000, type: 'income', category: 'Salary' },
  { id: '2', date: '2026-01-05', description: 'Groceries', amount: 150, type: 'expense', category: 'Food' },
  { id: '3', date: '2026-01-10', description: 'Metro Pass', amount: 80, type: 'expense', category: 'Transport' },
  { id: '4', date: '2026-02-01', description: 'Monthly Salary', amount: 5000, type: 'income', category: 'Salary' },
  { id: '5', date: '2026-02-08', description: 'Valentine Dinner', amount: 120, type: 'expense', category: 'Food' },
  { id: '6', date: '2026-03-01', description: 'Freelance Work', amount: 800, type: 'income', category: 'Freelance' },
]

// ─── Type Filtering ──────────────────────────────────────────

describe('getFilteredTransactions — type filter', () => {
  it('returns all transactions when filterType is "all"', () => {
    const result = getFilteredTransactions(mockTransactions, '', 'all', 'date', 'desc')
    expect(result).toHaveLength(6)
  })

  it('filters only income transactions', () => {
    const result = getFilteredTransactions(mockTransactions, '', 'income', 'date', 'desc')
    expect(result).toHaveLength(3)
    result.forEach((t) => expect(t.type).toBe('income'))
  })

  it('filters only expense transactions', () => {
    const result = getFilteredTransactions(mockTransactions, '', 'expense', 'date', 'desc')
    expect(result).toHaveLength(3)
    result.forEach((t) => expect(t.type).toBe('expense'))
  })
})

// ─── Search ──────────────────────────────────────────────────

describe('getFilteredTransactions — search', () => {
  it('searches by description (case-insensitive)', () => {
    const result = getFilteredTransactions(mockTransactions, 'salary', 'all', 'date', 'desc')
    expect(result).toHaveLength(2)
  })

  it('searches by category', () => {
    const result = getFilteredTransactions(mockTransactions, 'food', 'all', 'date', 'desc')
    expect(result).toHaveLength(2)
  })

  it('returns empty array when nothing matches', () => {
    const result = getFilteredTransactions(mockTransactions, 'xyz123nonexistent', 'all', 'date', 'desc')
    expect(result).toHaveLength(0)
  })

  it('ignores whitespace in search', () => {
    const result = getFilteredTransactions(mockTransactions, '  salary  ', 'all', 'date', 'desc')
    expect(result).toHaveLength(2)
  })
})

// ─── Sorting ─────────────────────────────────────────────────

describe('getFilteredTransactions — sorting', () => {
  it('sorts by date descending (newest first)', () => {
    const result = getFilteredTransactions(mockTransactions, '', 'all', 'date', 'desc')
    expect(result[0].date).toBe('2026-03-01')
    expect(result[result.length - 1].date).toBe('2026-01-02')
  })

  it('sorts by date ascending (oldest first)', () => {
    const result = getFilteredTransactions(mockTransactions, '', 'all', 'date', 'asc')
    expect(result[0].date).toBe('2026-01-02')
    expect(result[result.length - 1].date).toBe('2026-03-01')
  })

  it('sorts by amount descending (highest first)', () => {
    const result = getFilteredTransactions(mockTransactions, '', 'all', 'amount', 'desc')
    expect(result[0].amount).toBe(5000)
    expect(result[result.length - 1].amount).toBe(80)
  })

  it('sorts by amount ascending (lowest first)', () => {
    const result = getFilteredTransactions(mockTransactions, '', 'all', 'amount', 'asc')
    expect(result[0].amount).toBe(80)
  })
})

// ─── Category Filter ─────────────────────────────────────────

describe('getFilteredTransactions — category filter', () => {
  it('filters by specific category', () => {
    const result = getFilteredTransactions(mockTransactions, '', 'all', 'date', 'desc', 'Food')
    expect(result).toHaveLength(2)
    result.forEach((t) => expect(t.category).toBe('Food'))
  })

  it('returns all when category is "all"', () => {
    const result = getFilteredTransactions(mockTransactions, '', 'all', 'date', 'desc', 'all')
    expect(result).toHaveLength(6)
  })
})

// ─── Date Range Filter ───────────────────────────────────────

describe('getFilteredTransactions — date range', () => {
  it('filters by from date', () => {
    const result = getFilteredTransactions(
      mockTransactions, '', 'all', 'date', 'desc', 'all', { from: '2026-02-01', to: '' }
    )
    expect(result.every((t) => t.date >= '2026-02-01')).toBe(true)
  })

  it('filters by to date', () => {
    const result = getFilteredTransactions(
      mockTransactions, '', 'all', 'date', 'desc', 'all', { from: '', to: '2026-01-31' }
    )
    expect(result.every((t) => t.date <= '2026-01-31')).toBe(true)
  })

  it('filters by both from and to date', () => {
    const result = getFilteredTransactions(
      mockTransactions, '', 'all', 'date', 'desc', 'all', { from: '2026-01-05', to: '2026-02-01' }
    )
    expect(result.every((t) => t.date >= '2026-01-05' && t.date <= '2026-02-01')).toBe(true)
  })
})

// ─── Combined Filters ────────────────────────────────────────

describe('getFilteredTransactions — combined filters', () => {
  it('applies type + search simultaneously', () => {
    const result = getFilteredTransactions(mockTransactions, 'salary', 'income', 'date', 'desc')
    expect(result).toHaveLength(2)
    result.forEach((t) => {
      expect(t.type).toBe('income')
      expect(t.description.toLowerCase()).toContain('salary')
    })
  })

  it('applies category + type + date range', () => {
    const result = getFilteredTransactions(
      mockTransactions, '', 'expense', 'date', 'desc', 'Food', { from: '2026-02-01', to: '' }
    )
    expect(result).toHaveLength(1)
    expect(result[0].description).toBe('Valentine Dinner')
  })
})
