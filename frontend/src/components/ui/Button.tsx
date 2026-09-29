import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { Accent } from './accents';

type Variant = 'solid' | 'soft' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

export type { Accent };

const ACCENTS: Record<Accent, string> = {
  forest: 'bg-forest-text text-white hover:bg-forest-dark',
  sea: 'bg-sea-text text-white hover:bg-sea-dark',
  leaf: 'bg-leaf-bright text-forest-dark hover:bg-leaf-text hover:text-white',
  pinkish: 'bg-pinkish-bright text-forest-dark hover:bg-pinkish-text hover:text-white',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  accent?: Accent;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
}

export function Button({
  variant = 'solid',
  size = 'md',
  accent = 'forest',
  fullWidth,
  leadingIcon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-tile inline-flex items-center justify-center gap-2 font-medium',
        'transition-colors active:scale-[0.98]',
        'focus-visible:ring-forest-text focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        SIZES[size],
        variant === 'solid' && ACCENTS[accent],
        variant === 'soft' && 'bg-mist text-forest-dark hover:bg-leaf-bright',
        variant === 'outline' && 'border-forest-dark/15 text-forest-dark hover:bg-mist border',
        variant === 'ghost' && 'text-forest-bright hover:bg-mist',
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {leadingIcon}
      {children}
    </button>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: Size;
  accent?: Accent;
}

const ICON_SIZES: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function IconButton({
  label,
  size = 'md',
  accent = 'forest',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full text-white transition-colors active:scale-95',
        'focus-visible:ring-forest-text focus-visible:ring-2 focus-visible:ring-offset-2',
        ICON_SIZES[size],
        ACCENTS[accent],
        className
      )}
      {...rest}
    />
  );
}
