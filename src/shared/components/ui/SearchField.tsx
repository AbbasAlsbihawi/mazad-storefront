'use client';

import { useId } from 'react';
import { cn } from '@shared/lib';
import { Icon } from './Icon';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the field — required, since the visible label is only a placeholder. */
  label: string;
  placeholder?: string;
  clearLabel: string;
  /** Renders the trailing 44pt primary filter button when provided. */
  onFilter?: () => void;
  filterLabel?: string;
  className?: string;
}

/**
 * SearchField — the iOS rounded search bar that sits directly under the nav bar on browse
 * screens. The optional filter button is the one place a primary fill appears beside a field.
 */
export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  clearLabel,
  onFilter,
  filterLabel,
  className,
}: SearchFieldProps) {
  const inputId = useId();

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex h-touch flex-1 items-center gap-2 rounded-md bg-surface px-3.5 shadow-card',
          'focus-within:shadow-none focus-within:outline-2 focus-within:outline-ring',
        )}
      >
        <Icon name="search" size={18} className="text-muted-foreground" />
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          // The field itself already draws the focus ring on its wrapper.
          className={cn(
            'min-w-0 flex-1 bg-transparent text-subhead text-foreground outline-none',
            'placeholder:text-muted-foreground',
            '[&::-webkit-search-cancel-button]:appearance-none',
          )}
        />
        {value ? (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => onChange('')}
            className="inline-flex shrink-0 p-1 text-muted-foreground"
          >
            <Icon name="x" size={16} />
          </button>
        ) : null}
      </div>

      {onFilter ? (
        <button
          type="button"
          aria-label={filterLabel}
          onClick={onFilter}
          className={cn(
            'inline-flex size-touch shrink-0 items-center justify-center rounded-md',
            'bg-primary text-primary-foreground shadow-button',
            'transition-opacity duration-fast ease-ios active:opacity-75',
          )}
        >
          <Icon name="sliders-horizontal" size={20} />
        </button>
      ) : null}
    </div>
  );
}
