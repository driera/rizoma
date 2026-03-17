import { getPalette } from './palettes';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';

interface ResolveTokensOptions {
  variant: ButtonVariant;
  color: string;
  overrides?: Record<string, string>;
}

type TokenRecord = Record<string, string>;

function variantTokens(variant: ButtonVariant, color: string): TokenRecord {
  const palette = getPalette(color);

  switch (variant) {
    case 'solid':
      return {
        '--button-bg': palette[600],
        '--button-color': 'white',
        '--button-border-color': palette[600],
      };
    case 'outline':
      return {
        '--button-bg': 'transparent',
        '--button-color': palette[600],
        '--button-border-color': palette[600],
      };
    case 'ghost':
      return {
        '--button-bg': palette[50],
        '--button-color': palette[600],
        '--button-border-color': 'transparent',
      };
  }
}

export function resolveTokens({
  variant,
  color,
  overrides,
}: ResolveTokensOptions): TokenRecord {
  const tokens = variantTokens(variant, color);
  if (overrides) {
    Object.assign(tokens, overrides);
  }
  return tokens;
}
