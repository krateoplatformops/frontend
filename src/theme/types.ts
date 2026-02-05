import type { ThemeConfig } from 'antd'

import type { Theme } from '../widgets/Theme/Theme.type'

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
  mode: Theme['spec']['widgetData']['mode']
}
