import { theme as antdTheme } from 'antd'

import type { ThemeMode } from '../hooks/useAppTheme'

import type { AppTheme } from './types'

export const buildTheme = (mode: ThemeMode, theme?: AppTheme): AppTheme => {
  return {
    algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    custom: {
      ...theme?.custom,
    },
    token: {
      ...theme?.token,
    },
  }
}
