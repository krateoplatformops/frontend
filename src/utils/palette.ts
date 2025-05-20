const palette = {
  blue: '#11B2E2',
  darkBlue: '#05629A',
  gray: '#323B40',
  green: '#00D690',
  orange: '#FFAA00',
  red: '#F84C4C',
} as const

type PaletteColor = keyof typeof palette

export const getColorCode = (colorName: string | undefined) => {
  if (colorName && colorName in palette) {
    return palette[colorName as PaletteColor]
  }

  return '#000000'
}
