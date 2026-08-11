'use client';

import { cn } from '@shared/lib';
import { Icon } from '@shared/components/ui';

export interface StepperProps {
  value: number;
  min: number;
  max?: number;
  step: number;
  onChange: (value: number) => void;
  /** Pre-formatted display value — the caller owns locale digits and grouping. */
  displayValue: string;
  decrementLabel: string;
  incrementLabel: string;
  suffix?: string;
  className?: string;
}

/**
 * Stepper — the bid-increment control: minus, value, plus on a fill pill. Clamping lives here so
 * a caller can't put an out-of-range amount on screen, but the *meaning* of the bounds (minimum
 * next bid, wallet ceiling) stays with the caller.
 */
export function Stepper({
  value,
  min,
  max = Number.MAX_SAFE_INTEGER,
  step,
  onChange,
  displayValue,
  decrementLabel,
  incrementLabel,
  suffix,
  className,
}: StepperProps) {
  const set = (next: number) => onChange(Math.min(max, Math.max(min, next)));

  return (
    <div className={cn('inline-flex items-center gap-0.5 rounded-full bg-fill p-[3px]', className)}>
      <StepButton
        icon="minus"
        label={decrementLabel}
        onClick={() => set(value - step)}
        isDisabled={value <= min}
      />
      <span className="min-w-13 text-center text-callout font-semibold text-foreground tabular-nums">
        {displayValue}
        {suffix ? (
          <span className="ms-[3px] text-caption font-medium text-muted-foreground">{suffix}</span>
        ) : null}
      </span>
      <StepButton
        icon="plus"
        label={incrementLabel}
        onClick={() => set(value + step)}
        isDisabled={value >= max}
      />
    </div>
  );
}

function StepButton({
  icon,
  label,
  onClick,
  isDisabled,
}: {
  icon: 'minus' | 'plus';
  label: string;
  onClick: () => void;
  isDisabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex size-[38px] items-center justify-center rounded-full bg-surface text-foreground shadow-card',
        'transition-colors duration-fast ease-ios active:bg-surface-raised',
        'disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none',
      )}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}
