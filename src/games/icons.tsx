import { cn } from '../lib/cn';

interface IconProps {
  className?: string;
}

export function ChatIcon({ className }: IconProps) {
  return (
    <span className={cn('material-symbols-rounded', className)} aria-hidden="true">
      forum
    </span>
  );
}

export function BalanceIcon({ className }: IconProps) {
  return (
    <span className={cn('material-symbols-rounded', className)} aria-hidden="true">
      balance
    </span>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <span className={cn('material-symbols-rounded', className)} aria-hidden="true">
      image
    </span>
  );
}

export function DiceIcon({ className }: IconProps) {
  return (
    <span className={cn('material-symbols-rounded', className)} aria-hidden="true">
      casino
    </span>
  );
}
