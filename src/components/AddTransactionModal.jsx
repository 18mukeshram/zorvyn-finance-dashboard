import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import { CATEGORIES, ALL_CATEGORIES } from '../data/mockData'

/**
 * Modal for adding or editing a transaction.
 * Only rendered when role === 'admin'.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Close callback
 * @param {Object|null} props.editTransaction - Transaction to edit (null = add mode)
 */
export default function AddTransactionModal({ isOpen, onClose, editTransaction = null }) {
  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const editTransactionAction = useFinanceStore((s) => s.editTransaction)

  const isEditing = !!editTransaction

  const [form, setForm] = useState({
    date: '',
    description: '',
    amount: '',
    category: '',
    type: 'expense',
  })

  const [errors, setErrors] = useState({})

  // Populate form when editing
  useEffect(() => {
    if (editTransaction) {
      setForm({
        date: editTransaction.date,
        description: editTransaction.description,
        amount: String(editTransaction.amount),
        category: editTransaction.category,
        type: editTransaction.type,
      })
    } else {
      setForm({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        category: '',
        type: 'expense',
      })
    }
    setErrors({})
  }, [editTransaction, isOpen])

  // Get categories based on selected type
  const availableCategories = form.type === 'income' ? CATEGORIES.income : CATEGORIES.expense

  const validate = () => {
    const newErrors = {}
    if (!form.date) newErrors.date = 'Date is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      newErrors.amount = 'Enter a valid amount'
    if (!form.category) newErrors.category = 'Select a category'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const transactionData = {
      date: form.date,
      description: form.description.trim(),
      amount: parseFloat(Number(form.amount).toFixed(2)),
      category: form.category,
      type: form.type,
    }

    if (isEditing) {
      editTransactionAction(editTransaction.id, transactionData)
    } else {
      addTransaction(transactionData)
    }

    onClose()
  }

  const updateField = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // Reset category if type changes
      if (field === 'type') {
        next.category = ''
      }
      return next
    })
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-xl
                   border border-surface-100 dark:border-surface-800
                   animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800">
          <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 
                       text-surface-400 hover:text-surface-600 dark:hover:text-surface-300
                       transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type toggle */}
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Type
            </label>
            <div className="flex gap-2">
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateField('type', t)}
                  className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all duration-200
                    ${form.type === t
                      ? t === 'income'
                        ? 'bg-income-50 dark:bg-income-700/20 border-income-200 dark:border-income-700 text-income-700 dark:text-income-400'
                        : 'bg-expense-50 dark:bg-expense-700/20 border-expense-200 dark:border-expense-700 text-expense-700 dark:text-expense-400'
                      : 'border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                    }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="txn-date" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Date
            </label>
            <input
              id="txn-date"
              type="date"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="input"
            />
            {errors.date && (
              <p className="text-xs text-expense-500 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="txn-description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Description
            </label>
            <input
              id="txn-description"
              type="text"
              placeholder="e.g., Grocery shopping"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="input"
            />
            {errors.description && (
              <p className="text-xs text-expense-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="txn-amount" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Amount ($)
            </label>
            <input
              id="txn-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => updateField('amount', e.target.value)}
              className="input"
            />
            {errors.amount && (
              <p className="text-xs text-expense-500 mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="txn-category" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Category
            </label>
            <select
              id="txn-category"
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="input cursor-pointer"
            >
              <option value="">Select category</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-expense-500 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
