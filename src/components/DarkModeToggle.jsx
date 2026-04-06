import { Sun, Moon } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'

/**
 * Dark mode toggle button with sun/moon icon animation.
 */
export default function DarkModeToggle() {
  const darkMode = useFinanceStore((s) => s.darkMode)
  const toggleDarkMode = useFinanceStore((s) => s.toggleDarkMode)

  return (
    <button
      id="dark-mode-toggle"
      onClick={toggleDarkMode}
      className="relative p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 
                 hover:bg-surface-200 dark:hover:bg-surface-700 
                 border border-surface-200 dark:border-surface-700
                 transition-all duration-300 ease-out
                 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                 dark:focus:ring-offset-surface-900
                 group"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Light mode' : 'Dark mode'}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <Sun
          size={20}
          className={`absolute inset-0 text-amber-500 transition-all duration-300
            ${darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
        />
        {/* Moon icon */}
        <Moon
          size={20}
          className={`absolute inset-0 text-brand-400 transition-all duration-300
            ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
        />
      </div>
    </button>
  )
}
