import { useQuery } from '@tanstack/react-query'
import { theme as antdTheme, ConfigProvider } from 'antd'
import { createContext, useContext, useEffect, useMemo } from 'react'

import { useConfigContext } from '../context/ConfigContext'
import { antdToCssVariables } from '../theme/bridge'
import type { AppTheme } from '../theme/types'
import type { Theme } from '../widgets/Theme/Theme.type'

type ThemeProviderType = {
  children: React.ReactNode
}

type ThemeContextType = {
  theme: AppTheme
  isLoading: boolean
}

export type ThemeMode = 'light' | 'dark'

const ThemeContext = createContext<ThemeContextType | null>(null)

export const buildTheme = (themeWidget: Theme): AppTheme => {
  const { spec: { widgetData: { custom, mode, token } } } = themeWidget
  const { darkAlgorithm, defaultAlgorithm } = antdTheme

  return ({
    algorithm: mode === 'dark' ? darkAlgorithm : defaultAlgorithm,
    custom,
    token,
  })
}

export const useThemeResource = () => {
  const { config } = useConfigContext()

  const themeUrl = config!.api.THEME

  return useQuery({
    queryFn: async () => {
      const res = await fetch(themeUrl)
      return await res.json() as Theme
    },
    queryKey: ['theme', config!.api.THEME, themeUrl],
    retry: false,
    staleTime: Infinity,
  })
}

// TODO: handle error
export const ThemeProvider: React.FC<ThemeProviderType> = ({ children }) => {
  const { token } = antdTheme.useToken()
  const { data, isLoading } = useThemeResource()

  console.log(data)

  const theme = useMemo<AppTheme>(() => (
    data ? buildTheme(data) : { algorithm: antdTheme.defaultAlgorithm }
  ), [data])

  useEffect(() => {
    antdToCssVariables(token, theme)
  }, [token, theme])

  return (
    <ThemeContext.Provider value={{ isLoading, theme }}>
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
