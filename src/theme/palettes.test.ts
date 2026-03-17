import { describe, it, expect } from 'vitest';
import { palettes, getPalette } from './palettes';
import type { PaletteKey, PaletteStep } from './palettes';

describe('palettes', () => {
  const expectedSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  it('primary palette has steps 50–900', () => {
    const steps = Object.keys(palettes.primary).map(Number);
    expect(steps).toEqual(expectedSteps);
  });

  it('each step is a valid OKLCH string', () => {
    for (const step of expectedSteps) {
      expect(palettes.primary[step as PaletteStep]).toMatch(/^oklch\(.+\)$/);
    }
  });

  it('step 600 matches the base color', () => {
    expect(palettes.primary[600]).toBe('oklch(0.59 0.14 220)');
  });

  it('requesting a nonexistent palette key returns the primary palette', () => {
    expect(getPalette('nonexistent' as PaletteKey)).toBe(palettes.primary);
  });

  it('requesting "primary" returns the primary palette', () => {
    expect(getPalette('primary')).toBe(palettes.primary);
  });
});
