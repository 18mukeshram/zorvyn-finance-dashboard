import { useMemo } from 'react'
import { Search, Download, X, Calendar, Tag } from 'lucide-react'
import useFinanceStore, { getFilteredTransactions } from '../store/useFinanceStore'
import { ALL_CATEGORIES } from '../data/mockData'
import { exportToCSV } from '../utils/csv'

/**
 * Filters bar — search, type pills, category dropdown, date range, CSV export.
 */
export default function Filters() {
  const searchQuery = useFinanceStore((s) => s.searchQuery)
  const setSearchQuery = useFinanceStore((s) => s.setSearchQuery)
  const filterType = useFinanceStore((s) => s.filterType)
  const setFilterType = useFinanceStore((s) => s.setFilterType)
  const filterCategory = useFinanceStore((s) => s.filterCategory)
  const setFilterCategory = useFinanceStore((s) => s.setFilterCategory)
  const dateRange = useFinanceStore((s) => s.dateRange)
  const setDateRange = useFinanceStore((s) => s.setDateRange)
  const transactions = useFinanceStore((s) => s.transactions)
  const sortBy = useFinanceStore((s) => s.sortBy)
  const sortOrder = useFinanceStore((s) => s.sortOrder)

  const filteredTransactions = useMemo(
    () => getFilteredTransactions(transactions, searchQuery, filterType, sortBy, sortOrder, filterCategory, dateRange),
    [transactions, searchQuery, filterType, sortBy, sortOrder, filterCategory, dateRange]
  )

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ]

  const hasActiveFilters = filterCategory !== 'all' || dateRange.from || dateRange.to

  const clearAllFilters = () => {
    setSearchQuery('')
    setFilterType('all')
    setFilterCategory('all')
    setDateRange({ from: '', to: '' })
  }

  const handleExport = () => {
    exportToCSV(filteredTransactions)
  }

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Type pills + Export */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Left side: Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
            />
            <input
              id="search-transactions"
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 pr-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 
                           hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                id={`filter-${opt.value}`}
                onClick={() => setFilterType(opt.value)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${filterType === opt.value
                    ? 'bg-white dark:bg-surface-700 text-surface-800 dark:text-surface-100 shadow-sm'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Export */}
        <button
          id="export-csv"
          onClick={handleExport}
          className="btn-secondary text-sm"
          title="Export filtered transactions as CSV"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Row 2: Category filter + Date range */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        {/* Category filter */}
        <div className="relative">
          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
          <select
            id="filter-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input pl-8 pr-8 py-2 text-sm cursor-pointer min-w-[140px] appearance-none"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-surface-400 shrink-0" />
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="input py-2 text-sm w-[140px]"
            placeholder="From"
          />
          <span className="text-surface-400 text-xs">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="input py-2 text-sm w-[140px]"
            placeholder="To"
          />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 
                       dark:hover:text-brand-300 font-medium transition-colors whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
