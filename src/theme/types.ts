import type { ThemeConfig } from 'antd'

export type AppCustomTheme = {
  sidebar?: {
    bgGradientStart?: string
    bgGradientEnd?: string
  }
  menu?: {
    itemColor?: string
    itemHoverColor?: string
    itemSelectedBg?: string
    itemSelectedColor?: string
  }
}

export type AppTheme = ThemeConfig & {
  custom?: AppCustomTheme
}
