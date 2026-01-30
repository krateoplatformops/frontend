import { createContext, useContext, useEffect, useState } from 'react'

import { defaultTheme } from '../theme/defaultTheme'
import type { AppTheme } from '../theme/types'

type ThemeContextType = {
  theme: AppTheme
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<AppTheme>(defaultTheme)
  const [isLoading] = useState(false)

  useEffect(() => {
    // ⏳ FUTURO: fetch tema da API
    // setIsLoading(true)
    // fetchTheme().then(setTheme).finally(() => setIsLoading(false))
  }, [])

  return (
    <ThemeContext.Provider value={{ isLoading, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useAppTheme must be used inside ThemeProvider')
  }

  return context
}
