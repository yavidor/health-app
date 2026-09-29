/**
 * Shared accent palettes. Every component that takes an `accent` prop accepts
 * these keys so colours stay consistent across the app.
 */
export type Accent = 'forest' | 'sea' | 'leaf' | 'pinkish';

export const ACCENT_TEXT: Record<Accent, string> = {
  forest: 'text-forest-text',
  sea: 'text-sea-text',
  leaf: 'text-leaf-dark',
  pinkish: 'text-pinkish-text',
};

export const ACCENT_TINT: Record<Accent, string> = {
  forest: 'bg-forest-text/10',
  sea: 'bg-sea-text/10',
  leaf: 'bg-leaf-text/10',
  pinkish: 'bg-pinkish-text/10',
};

export const ACCENT_BORDER: Record<Accent, string> = {
  forest: 'border-l-forest-text',
  sea: 'border-l-sea-text',
  leaf: 'border-l-leaf-text',
  pinkish: 'border-l-pinkish-text',
};

export const ACCENT_SOLID: Record<Accent, string> = {
  forest: 'bg-forest-text',
  sea: 'bg-sea-text',
  leaf: 'bg-leaf-text',
  pinkish: 'bg-pinkish-text',
};
