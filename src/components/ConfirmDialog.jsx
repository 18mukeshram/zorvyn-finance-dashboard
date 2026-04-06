import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

/**
 * Confirmation dialog for destructive actions (e.g., delete transaction).
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is visible
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onConfirm - Confirm callback
 * @param {string} [props.title] - Dialog title
 * @param {string} [props.message] - Dialog message
 * @param {string} [props.confirmLabel] - Confirm button text
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Transaction',
  message = 'Are you sure you want to delete this transaction? This action cannot be undone.',
  confirmLabel = 'Delete',
}) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-sm bg-white dark:bg-surface-900 rounded-2xl shadow-xl
                   border border-surface-100 dark:border-surface-800
                   animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Icon + Content */}
          <div className="flex gap-4">
            <div className="p-3 rounded-xl bg-expense-50 dark:bg-expense-700/20 ring-1 ring-expense-100 dark:ring-expense-800/30 shrink-0 h-fit">
              <AlertTriangle size={20} className="text-expense-600 dark:text-expense-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100 mb-1">
                {title}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="btn-secondary flex-1 text-sm">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 
                         bg-expense-600 text-white font-medium text-sm rounded-xl
                         hover:bg-expense-700 active:bg-expense-800
                         transition-all duration-200 ease-out
                         focus:outline-none focus:ring-2 focus:ring-expense-500 focus:ring-offset-2
                         dark:focus:ring-offset-surface-900"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
