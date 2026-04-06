import { Shield, Eye } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'

/**
 * Role toggle dropdown — switches between Viewer and Admin roles.
 * Controls conditional rendering of add/edit/delete UI throughout the app.
 */
export default function RoleToggle() {
  const role = useFinanceStore((s) => s.role)
  const setRole = useFinanceStore((s) => s.setRole)

  const isAdmin = role === 'admin'

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium
          ${isAdmin
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
            : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
          }
          transition-colors duration-200`}
      >
        {isAdmin ? <Shield size={12} /> : <Eye size={12} />}
        <span>{isAdmin ? 'Admin' : 'Viewer'}</span>
      </div>
      <select
        id="role-toggle"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="px-3 py-2 text-sm rounded-xl border border-surface-200 dark:border-surface-700
                   bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200
                   focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
                   transition-all duration-200 cursor-pointer
                   appearance-none"
        aria-label="Select user role"
      >
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  )
}
