import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../internal/contrast';
import { brand, editions } from './palette';

// Contrast gates for every edition. These pairs are the ones the handoff
// calls out (section 12) plus the surfaces each ink actually lands on.
// AA normal text = 4.5:1; large text / non-text boundaries = 3:1.
const TEXT = 4.5;
const LARGE = 3;

const textGates: Array<[string, string, number]> = [
  ['text', 'bg', 7],
  ['text', 'surface-3', TEXT],
  ['text-strong', 'surface-3', 7],
  ['text-muted', 'surface-3', TEXT],
  ['text-faint', 'surface-1', TEXT],
  ['structure-text', 'surface-2', TEXT],
  ['accent', 'bg', TEXT],
  ['accent-ink', 'accent', TEXT],
  ['action', 'bg', TEXT],
  ['action-ink', 'action', TEXT],
  ['action-ink', 'action-hover', TEXT],
  ['warning', 'surface-1', TEXT],
  ['error', 'surface-1', TEXT],
  ['success', 'surface-1', TEXT],
  ['text', 'selected', TEXT],
  ['text-muted', 'selected', TEXT]
];
const boundaryGates: Array<[string, string, number]> = [
  ['border-strong', 'bg', LARGE],
  ['border-strong', 'surface-2', LARGE],
  ['action', 'surface-3', LARGE],
  ['accent', 'surface-3', LARGE],
  ['error', 'surface-3', LARGE]
];

describe('brand anchors', () => {
  it('match identity board B2 verbatim', () => {
    expect(brand).toEqual({ teal: '#3CA0A0', slate: '#5F7E8F', rust: '#D0602B', charcoal: '#0F1416' });
  });
});

for (const [name, palette] of Object.entries(editions)) {
  describe(`edition ${name}`, () => {
    it.each(textGates)('%s on %s ≥ %s (text)', (fg, bg, min) => {
      expect(contrastRatio(palette[fg as keyof typeof palette], palette[bg as keyof typeof palette])).toBeGreaterThanOrEqual(min);
    });
    it.each(boundaryGates)('%s against %s ≥ %s (boundary)', (fg, bg, min) => {
      expect(contrastRatio(palette[fg as keyof typeof palette], palette[bg as keyof typeof palette])).toBeGreaterThanOrEqual(min);
    });
    it('warning is not rust (a notice must not read as an action)', () => {
      expect(palette.warning.toUpperCase()).not.toBe(palette.action.toUpperCase());
    });
  });
}
