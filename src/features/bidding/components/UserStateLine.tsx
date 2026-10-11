'use client';

import { Icon, type IconName } from '@shared/components/ui';
import { useMoney } from '@shared/hooks';
import { cn } from '@shared/lib';
import { useBiddingTranslation } from '../hooks/useBiddingTranslation';
import type { UserState } from '../lib/user-state';

type ShownState = Exclude<UserState, { kind: 'signIn' }>;

const LOOK: Record<ShownState['kind'], { icon: IconName; className: string }> = {
  own: { icon: 'store', className: 'text-foreground-soft' },
  won: { icon: 'check', className: 'text-success' },
  soldToOther: { icon: 'gavel', className: 'text-muted-foreground' },
  ended: { icon: 'clock', className: 'text-muted-foreground' },
  notStarted: { icon: 'clock', className: 'text-foreground-soft' },
  autoBid: { icon: 'trending-up', className: 'text-foreground' },
  leading: { icon: 'check', className: 'text-success' },
  outbid: { icon: 'trending-up', className: 'text-warning' },
  canBid: { icon: 'gavel', className: 'text-foreground-soft' },
};

/** The viewer's state on this auction, as the single line the page shows for it. */
export function UserStateLine({ state }: { state: ShownState }) {
  const { t } = useBiddingTranslation();
  const { money } = useMoney();
  const look = LOOK[state.kind];

  return (
    <p
      role="status"
      className={cn('flex items-center gap-2 text-subhead font-semibold', look.className)}
      data-testid="auction-user-state"
      data-state={state.kind}
    >
      <Icon name={look.icon} size={18} className="shrink-0" />
      {state.kind === 'autoBid'
        ? t('state.autoBid', { amount: money(state.maxAmount) })
        : t(`state.${state.kind}`)}
    </p>
  );
}
