import { useEffect } from 'react'
import useFinanceStore from '../store/useFinanceStore'
import useToastStore from '../store/useToastStore'

/**
 * Global keyboard shortcuts for power users.
 *
 * Shortcuts:
 *   N        → Open "Add Transaction" modal (admin only)
 *   D        → Toggle dark mode
 *   /        → Focus search input
 *   Escape   → Clear search / close modals
 *   1        → Filter: All
 *   2        → Filter: Income
 *   3        → Filter: Expense
 *
 * Only active when no input/textarea/select is focused.
 */
export default function useKeyboardShortcuts({ onAddTransaction }) {
  const toggleDarkMode = useFinanceStore((s) => s.toggleDarkMode)
  const setFilterType = useFinanceStore((s) => s.setFilterType)
  const setSearchQuery = useFinanceStore((s) => s.setSearchQuery)
  const role = useFinanceStore((s) => s.role)
  const addToast = useToastStore((s) => s.addToast)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      const tag = document.activeElement?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        // Escape still works to blur the input
        if (e.key === 'Escape') {
          document.activeElement.blur()
          setSearchQuery('')
        }
        return
      }

      // Don't trigger with modifier keys (Ctrl, Alt, Meta)
      if (e.ctrlKey || e.altKey || e.metaKey) return

      switch (e.key.toLowerCase()) {
        case 'n':
          if (role === 'admin' && onAddTransaction) {
            e.preventDefault()
            onAddTransaction()
          }
          break

        case 'd':
          e.preventDefault()
          toggleDarkMode()
          break

        case '/':
          e.preventDefault()
          document.getElementById('search-transactions')?.focus()
          break

        case '1':
          setFilterType('all')
          addToast('info', 'Filter: All transactions')
          break

        case '2':
          setFilterType('income')
          addToast('info', 'Filter: Income only')
          break

        case '3':
          setFilterType('expense')
          addToast('info', 'Filter: Expenses only')
          break

        case 'escape':
          setSearchQuery('')
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleDarkMode, setFilterType, setSearchQuery, role, onAddTransaction, addToast])
}
