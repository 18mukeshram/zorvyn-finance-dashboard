import { useMemo } from 'react'
import { Search, Download, X } from 'lucide-react'
import useFinanceStore, { getFilteredTransactions } from '../store/useFinanceStore'
import { exportToCSV } from '../utils/csv'

/**
 * Filters bar — search input, type filter pills, and CSV export.
 */
export default function Filters() {
  const searchQuery = useFinanceStore((s) => s.searchQuery)
  const setSearchQuery = useFinanceStore((s) => s.setSearchQuery)
  const filterType = useFinanceStore((s) => s.filterType)
  const setFilterType = useFinanceStore((s) => s.setFilterType)
  const transactions = useFinanceStore((s) => s.transactions)
  const sortBy = useFinanceStore((s) => s.sortBy)
  const sortOrder = useFinanceStore((s) => s.sortOrder)

  const filteredTransactions = useMemo(
    () => getFilteredTransactions(transactions, searchQuery, filterType, sortBy, sortOrder),
    [transactions, searchQuery, filterType, sortBy, sortOrder]
  )

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ]

  const handleExport = () => {
    exportToCSV(filteredTransactions)
  }

  return (
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
  )
}
