import type { GlobalToken } from 'antd'

import type { AppCustomTheme } from './defaultTheme'

export const antdToCssVariables = (token: GlobalToken, custom?: AppCustomTheme) => {
  const root = document.documentElement

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
