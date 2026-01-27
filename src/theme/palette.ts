const PALETTE = {
  blue: '#11B2E2',
  darkBlue: '#05629A',
  gray: '#a0a0a0',
  green: '#00D690',
  orange: '#FFAA00',
  red: '#F84C4C',
  violet: '#722ed1',
} as const

type PaletteColor = keyof typeof PALETTE

export const getColorCode = (colorName: string | undefined) => {
  if (colorName && colorName in PALETTE) {
    return PALETTE[colorName as PaletteColor]
  }

  return PALETTE.gray
}

const VARIABLES = {
  background: '#f5f5f5',
  border: '#E1E3E8',
  gray: '#a0a0a0',
  // colorWhite
  light: '#FFFFFF',
  lightgray: '#F0F0F0',
  menubgend: '#002f46',
  menubgstart: '#005d8b',
  menuitem: '#ffffff80',
  menuitembg: '#11b2e266',
  // colorBgBase
  panelbg: '#FBFBFB',
  // colorPrimary
  primary: '#05629A',
} as const

export const cssVariables = () => {
  const root = document.documentElement
  Object.entries(VARIABLES).forEach(([key, value]) => {
    root.style.setProperty(`--${key}-color`, value)
  })
}

export default VARIABLES
