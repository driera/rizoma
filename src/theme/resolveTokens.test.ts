import { describe, it, expect } from 'vitest';
import { resolveTokens } from './resolveTokens';
import { palettes } from './palettes';

describe('resolveTokens', () => {
  it('returns expected custom properties for solid variant with primary palette', () => {
    const result = resolveTokens({ variant: 'solid', color: 'primary' });
    expect(result['--button-bg']).toBe(palettes.primary[600]);
    expect(result['--button-color']).toBe('white');
    expect(result['--button-border-color']).toBe(palettes.primary[600]);
  });

  it('returns expected custom properties for outline variant', () => {
    const result = resolveTokens({ variant: 'outline', color: 'primary' });
    expect(result['--button-bg']).toBe('transparent');
    expect(result['--button-color']).toBe(palettes.primary[600]);
    expect(result['--button-border-color']).toBe(palettes.primary[600]);
  });

  it('returns expected custom properties for ghost variant', () => {
    const result = resolveTokens({ variant: 'ghost', color: 'primary' });
    expect(result['--button-bg']).toBe(palettes.primary[50]);
    expect(result['--button-color']).toBe(palettes.primary[600]);
    expect(result['--button-border-color']).toBe('transparent');
  });

  it('instance overrides replace component defaults', () => {
    const result = resolveTokens({
      variant: 'solid',
      color: 'primary',
      overrides: { '--button-bg': 'red' },
    });
    expect(result['--button-bg']).toBe('red');
  });

  it('properties from all layers are present when they do not conflict', () => {
    const result = resolveTokens({
      variant: 'solid',
      color: 'primary',
      overrides: { '--custom-prop': '42px' },
    });
    expect(result['--button-bg']).toBe(palettes.primary[600]);
    expect(result['--custom-prop']).toBe('42px');
  });

  it('unknown palette key triggers fallback to primary', () => {
    const result = resolveTokens({ variant: 'solid', color: 'unknown' });
    expect(result['--button-bg']).toBe(palettes.primary[600]);
  });
});
