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
