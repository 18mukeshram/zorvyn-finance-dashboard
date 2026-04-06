import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2, Plus } from 'lucide-react'
import useFinanceStore, { getFilteredTransactions } from '../store/useFinanceStore'
import { formatCurrency, formatDate } from '../utils/calculations'
import Filters from './Filters'
import EmptyState from './EmptyState'
import AddTransactionModal from './AddTransactionModal'
import ConfirmDialog from './ConfirmDialog'

/**
 * Transactions table with search, filter, sort, and role-based actions.
 */
export default function TransactionTable() {
  const transactions = useFinanceStore((s) => s.transactions)
  const searchQuery = useFinanceStore((s) => s.searchQuery)
  const filterType = useFinanceStore((s) => s.filterType)
  const sortBy = useFinanceStore((s) => s.sortBy)
  const sortOrder = useFinanceStore((s) => s.sortOrder)
  const setSortBy = useFinanceStore((s) => s.setSortBy)
  const role = useFinanceStore((s) => s.role)
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction)

  const filteredTransactions = useMemo(
    () => getFilteredTransactions(transactions, searchQuery, filterType, sortBy, sortOrder),
    [transactions, searchQuery, filterType, sortBy, sortOrder]
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const isAdmin = role === 'admin'

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setEditingTransaction(null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTransaction(null)
  }

  /**
   * Render sort icon for a column header.
   */
  const SortIcon = ({ field }) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={14} className="text-surface-400" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="text-brand-500" />
    ) : (
      <ArrowDown size={14} className="text-brand-500" />
    )
  }

  return (
    <div className="card animate-fade-in">
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-surface-800 dark:text-surface-100">
            Transactions
          </h2>
          {isAdmin && (
            <button
              id="add-transaction-btn"
              onClick={handleAdd}
              className="btn-primary text-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          )}
        </div>
        <Filters />
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          message="Try adjusting your search or filters, or add a new transaction."
          action={
            isAdmin ? (
              <button onClick={handleAdd} className="btn-primary text-sm">
                <Plus size={16} />
                Add Transaction
              </button>
            ) : null
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-b border-surface-100 dark:border-surface-800">
                <th
                  className="px-5 sm:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 
                             uppercase tracking-wider cursor-pointer hover:text-surface-700 dark:hover:text-surface-300
                             transition-colors duration-200 select-none"
                  onClick={() => setSortBy('date')}
                >
                  <div className="flex items-center gap-1.5">
                    Date
                    <SortIcon field="date" />
                  </div>
                </th>
                <th className="px-5 sm:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-5 sm:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="px-5 sm:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">
                  Type
                </th>
                <th
                  className="px-5 sm:px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 
                             uppercase tracking-wider cursor-pointer hover:text-surface-700 dark:hover:text-surface-300
                             transition-colors duration-200 select-none"
                  onClick={() => setSortBy('amount')}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    Amount
                    <SortIcon field="amount" />
                  </div>
                </th>
                {isAdmin && (
                  <th className="px-5 sm:px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800/50">
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-surface-50 dark:hover:bg-surface-800/50 
                             transition-colors duration-150 group"
                >
                  <td className="px-5 sm:px-6 py-3.5 text-sm text-surface-600 dark:text-surface-400 whitespace-nowrap">
                    {formatDate(txn.date)}
                  </td>
                  <td className="px-5 sm:px-6 py-3.5">
                    <div className="text-sm font-medium text-surface-800 dark:text-surface-200">
                      {txn.description}
                    </div>
                    {/* Show category on mobile under description */}
                    <div className="text-xs text-surface-400 dark:text-surface-500 sm:hidden mt-0.5">
                      {txn.category}
                    </div>
                  </td>
                  <td className="px-5 sm:px-6 py-3.5 text-sm text-surface-600 dark:text-surface-400 hidden sm:table-cell">
                    {txn.category}
                  </td>
                  <td className="px-5 sm:px-6 py-3.5 hidden md:table-cell">
                    <span
                      className={`badge ${
                        txn.type === 'income' ? 'badge-income' : 'badge-expense'
                      }`}
                    >
                      {txn.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td
                    className={`px-5 sm:px-6 py-3.5 text-sm font-semibold text-right whitespace-nowrap
                      ${txn.type === 'income'
                        ? 'text-income-600 dark:text-income-400'
                        : 'text-expense-600 dark:text-expense-400'
                      }`}
                  >
                    {txn.type === 'income' ? '+' : '-'}
                    {formatCurrency(txn.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-5 sm:px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEdit(txn)}
                          className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800
                                     text-surface-400 hover:text-brand-600 dark:hover:text-brand-400
                                     transition-colors duration-200"
                          aria-label={`Edit ${txn.description}`}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(txn)}
                          className="p-1.5 rounded-lg hover:bg-expense-50 dark:hover:bg-expense-700/20
                                     text-surface-400 hover:text-expense-600 dark:hover:text-expense-400
                                     transition-colors duration-200"
                          aria-label={`Delete ${txn.description}`}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transaction count */}
      {filteredTransactions.length > 0 && (
        <div className="px-5 sm:px-6 py-3 border-t border-surface-100 dark:border-surface-800">
          <p className="text-xs text-surface-400 dark:text-surface-500">
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Modal */}
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editTransaction={editingTransaction}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTransaction(deleteTarget?.id)}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deleteTarget?.description}"? This action cannot be undone.`}
      />
    </div>
  )
}
