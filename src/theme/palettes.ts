export type PaletteStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type Palette = Record<PaletteStep, string>;

export type PaletteKey = 'primary';

export const palettes: Record<PaletteKey, Palette> = {
  primary: {
    50: 'oklch(0.97 0.02 220)',
    100: 'oklch(0.93 0.04 220)',
    200: 'oklch(0.87 0.06 220)',
    300: 'oklch(0.80 0.08 220)',
    400: 'oklch(0.73 0.10 220)',
    500: 'oklch(0.66 0.12 220)',
    600: 'oklch(0.59 0.14 220)',
    700: 'oklch(0.50 0.12 220)',
    800: 'oklch(0.42 0.10 220)',
    900: 'oklch(0.34 0.08 220)',
  },
};

export function getPalette(key: string): Palette {
  return palettes[key as PaletteKey] ?? palettes.primary;
}
