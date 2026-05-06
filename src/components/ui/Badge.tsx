import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Badge({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary',
        className,
      )}
      {...rest}
    />
  );
}
