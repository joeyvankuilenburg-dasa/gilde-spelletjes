import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent';
type Size = 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-primary-fg hover:bg-primary/95 chunky-btn',
  accent: 'bg-accent text-accent-fg hover:bg-accent/95 chunky-btn chunky-btn--accent',
  secondary:
    'bg-surface text-ink border border-border hover:border-accent/60 hover:bg-accent/5 hover:text-accent',
  ghost: 'bg-transparent text-ink hover:bg-primary/6 hover:text-primary',
};

const sizeClasses: Record<Size, string> = {
  md: 'min-h-tap px-5 text-base',
  lg: 'min-h-[60px] px-8 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-2xl font-extrabold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
});
