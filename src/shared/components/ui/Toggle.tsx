import { cn } from '@shared/lib';

/**
 * A switch (design `.toggle`): off is a quiet knob on the high surface, on fills the track with
 * the gold gradient. A real `role="switch"` button, named by the caller.
 */
export function Toggle({
  isOn,
  onChange,
  label,
  isDisabled = false,
  className,
}: {
  isOn: boolean;
  onChange: (next: boolean) => void;
  label: string;
  isDisabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      disabled={isDisabled}
      onClick={() => onChange(!isOn)}
      className={cn(
        'relative h-[30px] w-[50px] shrink-0 rounded-full border transition-colors duration-fast ease-ios',
        'disabled:pointer-events-none disabled:opacity-45',
        isOn ? 'border-transparent bg-grad' : 'border-border-strong bg-surface-high',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-[3px] size-[22px] rounded-full transition-[inset-inline-start] duration-medium ease-ios',
          isOn
            ? 'start-[23px] bg-white shadow-[0_1px_3px_rgb(0_0_0/30%)]'
            : 'start-[3px] bg-muted-foreground light:bg-white light:shadow-[0_1px_3px_rgb(45_32_12/35%)]',
        )}
      />
    </button>
  );
}
