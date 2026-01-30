import { theme } from 'antd'

import type { ThemeMode } from '../hooks/useAppTheme'

import type { AppTheme } from './types'

export const buildTheme = (mode: ThemeMode, overrides?: AppTheme): AppTheme => {
  return {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    components: {
      ...overrides?.components,
    },
    custom: {
      ...overrides?.custom,
    },
    token: {
      ...overrides?.token,
    },
  }
}
