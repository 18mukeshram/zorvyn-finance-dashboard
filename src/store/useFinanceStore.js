import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockTransactions } from '../data/mockData'

/**
 * Zustand finance store with LocalStorage persistence.
 *
 * Manages: transactions, filters, search, sorting, role, dark mode.
 * Derived values (totals, insights) are computed via selectors to avoid stale state.
 */

const useFinanceStore = create(
  persist(
    (set, get) => ({
      // ─── Core Data ───────────────────────────────────────
      transactions: mockTransactions,

      // ─── Filters & Search ────────────────────────────────
      searchQuery: '',
      filterType: 'all',       // 'all' | 'income' | 'expense'
      filterCategory: 'all',   // 'all' | category name
      dateRange: { from: '', to: '' }, // date range filter
      sortBy: 'date',          // 'date' | 'amount'
      sortOrder: 'desc',       // 'asc' | 'desc'

      // ─── UI State ───────────────────────────────────────
      role: 'admin',   // 'viewer' | 'admin'
      darkMode: false,

      // ─── Transaction Actions ─────────────────────────────
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: transaction.id || crypto.randomUUID(),
            },
            ...state.transactions,
          ],
        })),

      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // ─── Filter & Search Actions ─────────────────────────
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setDateRange: (range) => set({ dateRange: range }),

      setSortBy: (field) =>
        set((state) => ({
          sortBy: field,
          // Toggle order if clicking the same field, otherwise default desc
          sortOrder:
            state.sortBy === field
              ? state.sortOrder === 'desc'
                ? 'asc'
                : 'desc'
              : 'desc',
        })),

      // ─── UI Actions ──────────────────────────────────────
      setRole: (role) => set({ role }),

      toggleDarkMode: () =>
        set((state) => {
          const next = !state.darkMode
          // Apply dark class to <html> for Tailwind dark: variants
          if (next) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { darkMode: next }
        }),

      // ─── Initialize dark mode on hydration ───────────────
      initDarkMode: () => {
        const { darkMode } = get()
        if (darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
    }),
    {
      name: 'zorvyn-finance-storage',
      // Only persist these fields (skip derived/ephemeral state)
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
      }),
    }
  )
)

// ─── Utility: compute filtered transactions ─────────────────
// This is a pure function, NOT a Zustand selector (which would return
// a new array reference every call, causing infinite loops in Zustand v5).
// Use inside components with useMemo for stable references.

/**
 * Compute filtered, searched, and sorted transactions.
 * Call from components with useMemo, NOT as a Zustand selector.
 */
export function getFilteredTransactions(transactions, searchQuery, filterType, sortBy, sortOrder, filterCategory = 'all', dateRange = { from: '', to: '' }) {
  let results = [...transactions]

  // Filter by type
  if (filterType !== 'all') {
    results = results.filter((t) => t.type === filterType)
  }

  // Search by description or category
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim()
    results = results.filter(
      (t) =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (filterCategory !== 'all') {
    results = results.filter((t) => t.category === filterCategory)
  }

  // Filter by date range
  if (dateRange.from) {
    results = results.filter((t) => t.date >= dateRange.from)
  }
  if (dateRange.to) {
    results = results.filter((t) => t.date <= dateRange.to)
  }

  // Sort
  results.sort((a, b) => {
    let comparison = 0
    if (sortBy === 'date') {
      comparison = new Date(a.date) - new Date(b.date)
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  return results
}

export default useFinanceStore
