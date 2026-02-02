import { theme as antdTheme, ConfigProvider } from 'antd'
import { createContext, useContext, useEffect, useMemo } from 'react'

import { antdToCssVariables } from '../theme/bridge'
import { buildTheme } from '../theme/buildTheme'
import { defaultTheme } from '../theme/defaultTheme'
import type { AppTheme } from '../theme/types'

type ThemeProviderType = {
  children: React.ReactNode
  mode: ThemeMode
  baseTheme?: AppTheme
}

type ThemeContextType = {
  theme: AppTheme
  isLoading: boolean
}

export type ThemeMode = 'light' | 'dark'

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider: React.FC<ThemeProviderType> = ({ baseTheme = defaultTheme, children, mode }) => {
  const { token } = antdTheme.useToken()

  const theme = useMemo(() => buildTheme(mode, baseTheme), [mode, baseTheme])

  useEffect(() => {
    antdToCssVariables(token, theme)
  }, [token, theme])

  return (
    <ThemeContext.Provider value={{ isLoading: false, theme }}>
      <ConfigProvider theme={theme}>
        {children}
      </ConfigProvider>
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
