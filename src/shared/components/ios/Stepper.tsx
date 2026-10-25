'use client';

import { cn } from '@shared/lib';
import { Icon } from '@shared/components/ui';

export interface StepperProps {
  value: number;
  min: number;
  max?: number;
  step: number;
  onChange: (value: number) => void;
  /** Pre-formatted display value: the caller owns digits and grouping. */
  displayValue: string;
  decrementLabel: string;
  incrementLabel: string;
  suffix?: string;
  className?: string;
}

/**
 * Stepper (design `.stepper2`): minus, value, plus on a pill. Clamping lives here so a caller
 * can't put an out-of-range amount on screen, but the meaning of the bounds stays with the caller.
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
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border border-border-strong bg-surface p-2',
        className,
      )}
    >
      <StepButton
        icon="minus"
        label={decrementLabel}
        onClick={() => set(value - step)}
        isDisabled={value <= min}
      />
      <span className="min-w-13 flex-1 text-center font-tabular text-[17px] font-medium text-foreground">
        {displayValue}
        {suffix ? (
          <span className="ms-1 text-xs font-normal text-muted-foreground">{suffix}</span>
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
        'inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface-raised text-foreground',
        'transition-transform duration-fast ease-ios active:scale-94',
        'disabled:pointer-events-none disabled:opacity-35',
      )}
    >
      <Icon name={icon} size={17} />
    </button>
  );
}
