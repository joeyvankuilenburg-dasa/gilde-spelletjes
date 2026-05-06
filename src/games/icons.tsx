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

export function TheaterIcon({ className }: IconProps) {
  return (
    <span className={cn('material-symbols-rounded', className)} aria-hidden="true">
      theater_comedy
    </span>
  );
}

export function HubIcon({ className }: IconProps) {
  return (
    <span className={cn('material-symbols-rounded', className)} aria-hidden="true">
      hub
    </span>
  );
}

export function PsychologyIcon({ className }: IconProps) {
  return (
    <span className={cn('material-symbols-rounded', className)} aria-hidden="true">
      psychology
    </span>
  );
}

export function QuoteIcon({ className }: IconProps) {
  return (
    <span className={cn('material-symbols-rounded', className)} aria-hidden="true">
      format_quote
    </span>
  );
}
