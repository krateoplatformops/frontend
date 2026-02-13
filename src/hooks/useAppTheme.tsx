import { LoadingOutlined } from '@ant-design/icons'
import type { GlobalToken } from 'antd'
import { theme as antdTheme, ConfigProvider, Spin } from 'antd'
import { createContext, useContext, useEffect, useMemo } from 'react'

import styles from '../App.module.css'
import fallbackLogo from '../assets/images/logo_big.svg'
import { useConfigContext } from '../context/ConfigContext'
import type { AppBranding, AppTheme } from '../theme/types'
import { safeGetAccessToken } from '../utils/getAccessToken'
import type { Theme } from '../widgets/Theme/Theme.type'

import { useWidgetQuery } from './useWidgetQuery'

type ThemeProviderType = {
  children: React.ReactNode
}

type ThemeContextType = {
  branding: AppBranding
  theme: AppTheme
}

const DEFAULT_THEME: AppTheme = {
  algorithm: antdTheme.defaultAlgorithm,
  custom: {
    menu: {
      itemColor: '#ffffff80',
      itemHoverColor: '#f5f5f5',
      itemSelectedBg: '#11b2e266',
      itemSelectedColor: '#f5f5f5',
    },
    sidebar: {
      bgGradientEnd: '#002f46',
      bgGradientStart: '#005d8b',
    },
  },
  mode: 'light',
  token: {
    colorBgContainer: '#FBFBFB',
    colorBgLayout: '#f5f5f5',
    colorBorder: '#E1E3E8',
    colorPrimary: '#05629A',
    fontFamily: 'Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif',
  },
}
const DEFAULT_BRANDING: AppBranding = {
  logoUrl: fallbackLogo,
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const buildTheme = (themeWidget: Theme): AppTheme => {
  const { spec: { widgetData: { custom, mode, token } } } = themeWidget
  const { darkAlgorithm, defaultAlgorithm } = antdTheme

  return ({
    algorithm: mode === 'dark' ? darkAlgorithm : defaultAlgorithm,
    custom,
    mode,
    token,
  })
}

const buildBranding = (themeWidget?: Theme): AppBranding => {
  const logo = themeWidget?.spec.widgetData.logo

  return {
    logoSvg: logo?.svg,
    logoUrl: logo?.url || DEFAULT_BRANDING.logoUrl,
  }
}

// Maps theme variables to CSS variables
const antdToCssVariables = (token: GlobalToken, theme: AppTheme) => {
  const root = document.documentElement
  const { custom } = theme

  // COLORS
  root.style.setProperty('--gray-color', '#f5f5f5')
  root.style.setProperty('--dark-gray-color', '#ccc')

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
  root.style.setProperty('--background-color', theme.token?.colorBgLayout || token.colorBgLayout)
  // Color of every border in the application
  root.style.setProperty('--border-color', theme.token?.colorBorder || token.colorBorder)
  // Color of the header background
  root.style.setProperty('--container-color', theme.token?.colorBgContainer || token.colorBgContainer)
  // Color of every primary element
  root.style.setProperty('--primary-color', theme.token?.colorPrimary || token.colorPrimary)
  // Text color
  root.style.setProperty('--text-color', theme.token?.colorText || token.colorText)
  root.style.setProperty('--text-secondary-color', theme.token?.colorTextSecondary || token.colorTextSecondary)
}

export const getCssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const isThemeWidget = (value: unknown): value is Theme => {
  const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

  if (!isObject(value)) { return false }

  if (value.kind !== 'Theme') { return false }

  if (!isObject(value.spec)) { return false }
  if (!isObject(value.spec.widgetData)) { return false }
  if (!value.spec.widgetData.mode) { return false }

  return true
}

// Fetches Theme resource from config
export const useThemeResource = () => {
  const { config } = useConfigContext()
  const hasToken = Boolean(safeGetAccessToken())
  const themeEndpoint = config?.api?.THEME

  const shouldFetch = Boolean(themeEndpoint && hasToken)

  const { queryResult } = useWidgetQuery(themeEndpoint ?? '', {
    enabled: shouldFetch,
  })

  if (!shouldFetch) {
    return {
      data: undefined,
      error: undefined,
      isLoading: false,
    }
  }

  const { data, error, isLoading } = queryResult
  const theme = isThemeWidget(data) ? data : undefined

  return {
    data: theme,
    error: !theme ? error : undefined,
    isLoading,
  }
}

const ThemeCssBridge = ({ theme }: { theme: AppTheme }) => {
  const { token } = antdTheme.useToken()

  useEffect(() => {
    antdToCssVariables(token, theme)
  }, [token, theme])

  return null
}

export const ThemeProvider: React.FC<ThemeProviderType> = ({ children }) => {
  const { data, error, isLoading } = useThemeResource()

  if (error) {
    console.error(`Error while loading theme in useAppTheme: ${error}`)
  }

  // Sets theme from fetched resource or default Ant Design theme
  const theme = useMemo<AppTheme>(() =>
    (data ? buildTheme(data) : DEFAULT_THEME),
  [data])

  const branding = useMemo<AppBranding>(() =>
    (data ? buildBranding(data) : DEFAULT_BRANDING),
  [data],)

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin indicator={<LoadingOutlined />} size='large' />
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ branding, theme }}>
      <ConfigProvider theme={theme}>
        <ThemeCssBridge theme={theme} />
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export const useAppBranding = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useAppBranding must be used inside ThemeProvider')
  }

  return context.branding
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useAppTheme must be used inside ThemeProvider')
  }

  return context
}
