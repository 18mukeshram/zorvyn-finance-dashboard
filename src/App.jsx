import { useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import useFinanceStore from './store/useFinanceStore'

function App() {
  const initDarkMode = useFinanceStore((state) => state.initDarkMode)

  // Hydrate dark mode class on mount (from persisted state)
  useEffect(() => {
    initDarkMode()
  }, [initDarkMode])

  return <Dashboard />
}

export default App
