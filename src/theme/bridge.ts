import type { GlobalToken } from 'antd'

export const antdToCssVariables = (token: GlobalToken) => {
  const root = document.documentElement

  root.style.setProperty('--background-color', token.colorBgLayout)
  root.style.setProperty('--border-color', token.colorBorder)
  root.style.setProperty('--gray-color', token.colorTextSecondary)
  root.style.setProperty('--light-color', token.colorWhite)
  root.style.setProperty('--lightgray-color', token.colorFillSecondary)
  root.style.setProperty('--panelbg-color', token.colorBgContainer)
  root.style.setProperty('--primary-color', token.colorPrimary)
}
