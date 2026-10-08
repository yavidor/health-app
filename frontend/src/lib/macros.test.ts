import { describe, expect, it } from 'vitest';
import { macroSegments, statsMacroSegments, mealSubtitle } from './macros';

describe('Macro Calculation Utilities', () => {
  it('formats macro segments for MacroDonut with correct accents', () => {
    const totals = { protein: 150, carbs: 200, fat: 50 };
    const segments = macroSegments(totals);

    expect(segments).toHaveLength(3);
    expect(segments[0]).toEqual({
      key: 'protein',
      label: 'Protein',
      value: 150,
      accent: 'forest',
      detail: '150 g',
    });
    expect(segments[1]).toEqual({
      key: 'carbs',
      label: 'Carbs',
      value: 200,
      accent: 'sea',
      detail: '200 g',
    });
    expect(segments[2]).toEqual({
      key: 'fats',
      label: 'Fats',
      value: 50,
      accent: 'pinkish',
      detail: '50 g',
    });
  });

  it('formats stats macro segments with percentages', () => {
    const totals = { protein: 100, carbs: 100, fat: 0 };
    const segments = statsMacroSegments(totals);

    expect(segments[0].detail).toBe('100g (50%)');
    expect(segments[1].detail).toBe('100g (50%)');
    expect(segments[2].detail).toBe('0g (0%)');
  });

  it('formats meal subtitle correctly', () => {
    const meal = { kcal: 500, protein: 40, carbs: 50, fat: 15 };
    expect(mealSubtitle(meal)).toBe('500 kcal • 40g protein • 50g carbs • 15g fat');
  });
});
