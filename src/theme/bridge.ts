import type { GlobalToken } from 'antd'

export const antdToCssVariables = (token: GlobalToken) => {
  const root = document.documentElement

  // COLORS
  root.style.setProperty('--gray-color', '#f5f5f5')

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
