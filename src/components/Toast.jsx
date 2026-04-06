import { CheckCircle, XCircle, Info, Undo2, X } from 'lucide-react'
import useToastStore from '../store/useToastStore'

const iconMap = {
  success: { icon: CheckCircle, color: 'text-income-500' },
  error: { icon: XCircle, color: 'text-expense-500' },
  info: { icon: Info, color: 'text-brand-500' },
  undo: { icon: Undo2, color: 'text-amber-500' },
}

const bgMap = {
  success: 'border-income-200 dark:border-income-800/40',
  error: 'border-expense-200 dark:border-expense-800/40',
  info: 'border-brand-200 dark:border-brand-800/40',
  undo: 'border-amber-200 dark:border-amber-800/40',
}

/**
 * Single toast item.
 */
function ToastItem({ toast }) {
  const removeToast = useToastStore((s) => s.removeToast)
  const { icon: Icon, color } = iconMap[toast.type] || iconMap.info

  const handleUndo = () => {
    if (toast.onUndo) toast.onUndo()
    removeToast(toast.id)
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-card-lg
                  bg-white dark:bg-surface-800 
                  ${bgMap[toast.type] || bgMap.info}
                  animate-slide-up`}
    >
      <Icon size={18} className={`shrink-0 ${color}`} />
      <p className="text-sm text-surface-700 dark:text-surface-200 flex-1">
        {toast.message}
      </p>
      {toast.type === 'undo' && toast.onUndo && (
        <button
          onClick={handleUndo}
          className="px-2.5 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 
                     bg-brand-50 dark:bg-brand-900/30 rounded-lg
                     hover:bg-brand-100 dark:hover:bg-brand-900/50
                     transition-colors duration-200"
        >
          Undo
        </button>
      )}
      <button
        onClick={() => removeToast(toast.id)}
        className="p-0.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 
                   transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

/**
 * Toast container — renders all active toasts.
 * Place this once in your app (e.g., in App.jsx or Dashboard).
 */
export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 sm:w-96">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
