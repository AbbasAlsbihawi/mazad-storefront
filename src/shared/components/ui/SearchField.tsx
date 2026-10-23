'use client';

import { useId } from 'react';
import { cn } from '@shared/lib';
import { Icon } from './Icon';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the field: required, since the visible label is only a placeholder. */
  label: string;
  placeholder?: string;
  clearLabel: string;
  /** Renders the trailing round gold filter button when provided. */
  onFilter?: () => void;
  filterLabel?: string;
  /** A count of active filters, shown on the filter button. */
  filterCount?: number;
  onSubmit?: () => void;
  className?: string;
}

/**
 * SearchField: the design's pill search box (`.search .box`) with an optional round filter
 * button beside it, the one gold control of the browse header.
 */
export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  clearLabel,
  onFilter,
  filterLabel,
  filterCount,
  onSubmit,
  className,
}: SearchFieldProps) {
  const inputId = useId();

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex h-[52px] min-w-0 flex-1 items-center gap-2.5 rounded-full border border-border-strong bg-surface px-[18px]',
          'transition-[border-color,box-shadow] duration-fast ease-ios',
          'focus-within:border-gold focus-within:shadow-[0_0_0_4px_var(--color-gold-soft)]',
        )}
      >
        <Icon name="search" size={19} className="text-foreground-soft" />
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <input
          id={inputId}
          type="search"
          enterKeyHint="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && onSubmit) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder={placeholder}
          // The field itself draws the focus ring on its wrapper.
          className={cn(
            'min-w-0 flex-1 bg-transparent text-[14.5px] text-foreground outline-none',
            'placeholder:text-muted-foreground',
            '[&::-webkit-search-cancel-button]:appearance-none',
          )}
        />
        {value ? (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => onChange('')}
            className="-me-2 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <Icon name="x" size={16} />
          </button>
        ) : null}
      </div>

      {onFilter ? (
        <button
          type="button"
          aria-label={filterCount ? undefined : filterLabel}
          onClick={onFilter}
          className={cn(
            'relative inline-flex size-[52px] shrink-0 items-center justify-center rounded-full',
            'bg-grad text-gold-ink shadow-gold',
            'transition-transform duration-fast ease-ios active:scale-94',
          )}
        >
          <Icon name="sliders" size={20} />
          {filterCount ? <span className="sr-only">{filterLabel}</span> : null}
          {filterCount ? (
            <span className="absolute -end-0.5 -top-0.5 grid h-[19px] min-w-[19px] place-items-center rounded-full border-2 border-background bg-foreground px-1 font-tabular text-[11px] leading-none font-semibold text-background">
              {filterCount}
            </span>
          ) : null}
        </button>
      ) : null}
    </div>
  );
}
