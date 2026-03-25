import { describe, it, expect } from 'vitest';
import { palettes, getPalette } from './palettes';
import type { PaletteKey, PaletteStep } from './palettes';

// Converts an OKLCH string to WCAG relative luminance using the OKLab matrices.
// Out-of-sRGB-gamut components are clamped to 0 (matches browser sRGB clipping).
function oklchLuminance(oklch: string): number {
  const parts = oklch.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/);
  if (!parts) throw new Error(`Invalid OKLCH: ${oklch}`);
  const L = parseFloat(parts[1]);
  const C = parseFloat(parts[2]);
  const H = parseFloat(parts[3]) * (Math.PI / 180);

  const a = C * Math.cos(H);
  const b = C * Math.sin(H);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const lms_l = l_ ** 3;
  const lms_m = m_ ** 3;
  const lms_s = s_ ** 3;

  const R = Math.max(0,  4.0767416621 * lms_l - 3.3077115913 * lms_m + 0.2309699292 * lms_s);
  const G = Math.max(0, -1.2684380046 * lms_l + 2.6097574011 * lms_m - 0.3413193965 * lms_s);
  const B = Math.max(0, -0.0041960863 * lms_l - 0.7034186147 * lms_m + 1.7076147010 * lms_s);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function wcagContrast(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

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

  it('step 600 matches the accessible anchor color', () => {
    expect(palettes.primary[600]).toBe('oklch(0.40 0.14 220)');
  });

  it('step 600 achieves ≥ 7:1 contrast ratio against white (WCAG AAA)', () => {
    const lum600 = oklchLuminance(palettes.primary[600]);
    const ratio = wcagContrast(1.0, lum600);
    expect(ratio).toBeGreaterThanOrEqual(7);
  });

  it('requesting a nonexistent palette key returns the primary palette', () => {
    expect(getPalette('nonexistent' as PaletteKey)).toBe(palettes.primary);
  });

  it('requesting "primary" returns the primary palette', () => {
    expect(getPalette('primary')).toBe(palettes.primary);
  });
});
