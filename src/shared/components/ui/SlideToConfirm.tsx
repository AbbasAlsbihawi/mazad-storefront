'use client';

import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@shared/lib';
import { ConfirmDialog } from './ConfirmDialog';
import { Icon, type IconName } from './Icon';
import { Spinner } from './Spinner';

const KNOB = 56;
const INSET = 5;
/** How far the knob must travel, as a share of the track, to count as a confirmation. */
const THRESHOLD = 0.9;

export interface SlideToConfirmProps {
  /** "Slide to bid", "Slide to buy". */
  label: string;
  /** Shown once confirmed: "Bid placed". */
  doneLabel?: string;
  icon?: IconName;
  /**
   * Runs the money action. Return (or resolve) false to put the knob back, e.g. when the request
   * failed and the caller is showing why.
   */
  onConfirm: () => void | boolean | Promise<void | boolean>;
  /** The accessible alternative: a tap, Enter or a screen reader opens this confirmation. */
  confirmTitle: string;
  confirmBody?: string;
  confirmLabel: string;
  isDisabled?: boolean;
  isPending?: boolean;
  className?: string;
}

/**
 * Slide to confirm (design `.slide`): money never moves on a single tap. Dragging the gold knob
 * to the far end confirms. Anything else that activates the control (a tap, Enter or Space, a
 * screen reader's activate) opens a confirmation dialog instead, so the gesture is never the only
 * way in and a tap still never moves money on its own.
 */
export function SlideToConfirm({
  label,
  doneLabel,
  icon = 'gavel',
  onConfirm,
  confirmTitle,
  confirmBody,
  confirmLabel,
  isDisabled = false,
  isPending = false,
  className,
}: SlideToConfirmProps) {
  const { t } = useTranslation('common');
  const hintId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [geometry, setGeometry] = useState({ travel: 0, isRtl: false });
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      setGeometry({
        travel: Math.max(0, track.clientWidth - KNOB - INSET * 2),
        isRtl: getComputedStyle(track).direction === 'rtl',
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isDone) return;
    const timer = setTimeout(() => {
      setIsDone(false);
      setProgress(0);
    }, 1600);
    return () => clearTimeout(timer);
  }, [isDone]);

  const isBlocked = isDisabled || isPending;

  async function confirm() {
    setProgress(1);
    const result = await Promise.resolve(onConfirm()).catch(() => false);
    if (result === false) {
      setProgress(0);
      return;
    }
    setIsDone(true);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLSpanElement>) {
    if (isBlocked || isDone) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, moved: false };
    setIsDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLSpanElement>) {
    const state = drag.current;
    if (!state) return;
    const delta = (event.clientX - state.startX) * (geometry.isRtl ? -1 : 1);
    if (Math.abs(delta) > 4) state.moved = true;
    setProgress(Math.min(1, Math.max(0, delta / Math.max(1, geometry.travel))));
  }

  function handlePointerUp() {
    const state = drag.current;
    drag.current = null;
    setIsDragging(false);
    if (!state?.moved) return; // a tap: the click handler asks instead
    suppressClick.current = true;
    if (progress >= THRESHOLD) void confirm();
    else setProgress(0);
  }

  function handleActivate() {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (!isBlocked && !isDone) setIsAsking(true);
  }

  const offset = progress * geometry.travel * (geometry.isRtl ? -1 : 1);

  return (
    <>
      <div
        ref={trackRef}
        role="button"
        tabIndex={isBlocked ? -1 : 0}
        aria-disabled={isBlocked || undefined}
        aria-haspopup="dialog"
        aria-label={label}
        aria-describedby={hintId}
        onClick={handleActivate}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleActivate();
          }
        }}
        className={cn(
          'relative h-[66px] cursor-pointer touch-none overflow-hidden rounded-full border select-none',
          isDone ? 'border-transparent bg-live-soft' : 'border-gold-line bg-surface',
          isBlocked && 'cursor-default opacity-60',
          className,
        )}
      >
        <span id={hintId} className="sr-only">
          {t('slide.hint')}
        </span>
        <span
          aria-hidden
          className="absolute inset-y-0 start-0 rounded-full bg-gold-soft"
          style={{ width: KNOB + INSET * 2 + progress * geometry.travel }}
        />
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 flex items-center justify-center gap-2.5 px-[70px] text-[15px] font-semibold',
            isDone ? 'text-live' : 'text-foreground',
          )}
          style={isDone ? undefined : { opacity: Math.max(0, 1 - progress * 1.4) }}
        >
          <span className="truncate">{isDone && doneLabel ? doneLabel : label}</span>
          {isDone ? null : (
            <span className="flex text-gold">
              {[0, 0.15, 0.3].map((delay) => (
                <Icon
                  key={delay}
                  name="caret-left"
                  size={16}
                  className="-ms-[7px] animate-chevron ltr:-scale-x-100"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </span>
          )}
        </span>
        <span
          aria-hidden
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ transform: `translateX(${offset}px)` }}
          className={cn(
            'gold-sheen absolute start-[5px] top-[5px] grid size-14 place-items-center rounded-full bg-grad text-gold-ink shadow-gold',
            isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab transition-transform duration-medium ease-ios',
          )}
        >
          {isPending ? <Spinner size={22} /> : <Icon name={isDone ? 'check' : icon} size={24} />}
        </span>
      </div>
      <ConfirmDialog
        isOpen={isAsking}
        title={confirmTitle}
        body={confirmBody}
        confirmLabel={confirmLabel}
        onCancel={() => setIsAsking(false)}
        onConfirm={() => {
          setIsAsking(false);
          void confirm();
        }}
      />
    </>
  );
}
