import { LoadingOutlined } from '@ant-design/icons'
import type { GlobalToken } from 'antd'
import { theme as antdTheme, ConfigProvider, Spin } from 'antd'
import { createContext, useContext, useEffect, useMemo } from 'react'

import styles from '../App.module.css'
import { useConfigContext } from '../context/ConfigContext'
import type { AppTheme } from '../theme/types'
import type { Theme } from '../widgets/Theme/Theme.type'

import { useWidgetQuery } from './useWidgetQuery'

type ThemeProviderType = {
  children: React.ReactNode
}

type ThemeContextType = {
  theme: AppTheme
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const buildTheme = (themeWidget: Theme): AppTheme => {
  const { spec: { widgetData: { custom, mode, token } } } = themeWidget
  const { darkAlgorithm, defaultAlgorithm } = antdTheme

  return ({
    algorithm: mode === 'dark' ? darkAlgorithm : defaultAlgorithm,
    custom,
    token,
  })
}

// Maps theme variables to CSS variables
const antdToCssVariables = (token: GlobalToken, theme: AppTheme) => {
  const root = document.documentElement
  const { custom } = theme

  // COLORS
  root.style.setProperty('--gray-color', '#f5f5f5')

  // MENU
  root.style.setProperty('--menu-item-color', custom?.menu?.itemColor || '#ffffff80')
  root.style.setProperty('--menu-item-hover-color', custom?.menu?.itemHoverColor || '#f5f5f5')
  root.style.setProperty('--menu-item-selected-bg', custom?.menu?.itemSelectedBg || '#11b2e266')
  root.style.setProperty('--menu-item-selected-color', custom?.menu?.itemSelectedColor || '#f5f5f5')

  // SIDEBAR
  root.style.setProperty('--sidebar-bg-color-gradient-start', custom?.sidebar?.bgGradientStart || '#005d8b')
  root.style.setProperty('--sidebar-bg-color-gradient-end', custom?.sidebar?.bgGradientEnd || '#002f46')

  // THEME ELEMENTS
  // Color of the application background
  root.style.setProperty('--background-color', token.colorBgLayout)
  // Color of every border in the application
  root.style.setProperty('--border-color', token.colorBorder)
  // Color of the header background
  root.style.setProperty('--header-color', token.colorBgContainer)
  // Color of every primary element
  root.style.setProperty('--primary-color', token.colorPrimary)
}

// Fetches Theme resource from config
export const useThemeResource = () => {
  const { config } = useConfigContext()

  const themeEndpoint = config!.api.THEME

  const { queryResult } = useWidgetQuery(themeEndpoint)

  const { data, error, isLoading } = queryResult

  return {
    data: data as Theme | undefined,
    error,
    isLoading,
  }
}

export const ThemeProvider: React.FC<ThemeProviderType> = ({ children }) => {
  const { token } = antdTheme.useToken()
  const { data, error, isLoading } = useThemeResource()

  if (error) {
    console.error(`Error while loading theme in useAppTheme: ${error}`)
  }

  // Sets theme from fetched resource or default Ant Design theme
  const theme = useMemo<AppTheme>(() => (data ? buildTheme(data) : ({ algorithm: antdTheme.defaultAlgorithm })), [data])

  useEffect(() => {
    antdToCssVariables(token, theme)
  }, [token, theme])

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin indicator={<LoadingOutlined />} size='large' />
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme }}>
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
