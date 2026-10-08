import { describe, expect, it } from 'vitest';
import { formatKcal, formatMinutes, formatRank, formatPoints } from './format';

describe('Formatting Utilities', () => {
  it('formats kcal numbers', () => {
    expect(formatKcal(2500)).toBe('2,500 kcal');
  });

  it('formats minutes', () => {
    expect(formatMinutes(45)).toBe('45 min');
    expect(formatMinutes(1200)).toBe('1,200 min');
  });

  it('formats rank', () => {
    expect(formatRank(1)).toBe('#1');
    expect(formatRank(undefined)).toBe('Unranked');
  });

  it('formats points', () => {
    expect(formatPoints(1290)).toBe('1,290 pts');
  });
});
