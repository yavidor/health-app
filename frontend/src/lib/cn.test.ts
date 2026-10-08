import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('joins multiple string class names', () => {
    expect(cn('btn', 'btn-primary', 'active')).toBe('btn btn-primary active');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('filters out falsy values like false, null, undefined, and empty string', () => {
    expect(cn('btn', false, null, undefined, '', 'active')).toBe('btn active');
  });

  it('includes numeric values including zero', () => {
    expect(cn('col', 0, 12)).toBe('col 0 12');
  });

  it('handles nested arrays recursively', () => {
    expect(cn('base', ['nested-1', ['nested-2', false, 'nested-3']], 'extra')).toBe(
      'base nested-1 nested-2 nested-3 extra'
    );
  });

  it('handles conditional expressions cleanly', () => {
    const isPrimary = true;
    const isDisabled = false;
    expect(cn('btn', isPrimary && 'btn-primary', isDisabled && 'btn-disabled')).toBe(
      'btn btn-primary'
    );
  });
});
