import { Inbox } from 'lucide-react'

/**
 * Empty state component shown when no transactions match filters or when data is empty.
 *
 * @param {Object} props
 * @param {string} [props.title] - Heading text
 * @param {string} [props.message] - Description text
 * @param {React.ReactNode} [props.action] - Optional action button/element
 */
export default function EmptyState({
  title = 'No transactions found',
  message = 'Try adjusting your search or filters to find what you\'re looking for.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      <div className="p-4 rounded-2xl bg-surface-100 dark:bg-surface-800 mb-4">
        <Inbox
          size={40}
          className="text-surface-400 dark:text-surface-500"
          strokeWidth={1.5}
        />
      </div>
      <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-1">
        {title}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 text-center max-w-sm">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
