'use client';

import { useCurrentUser } from '@features/auth';
import { FollowSellerButton } from '@features/sellers';

/**
 * "Follow" on a seller, for everyone but that seller: nobody follows themself (the API refuses it
 * anyway, and stays the authority). Composed here because it needs the signed-in user (auth) and
 * the follow button (sellers). Nothing shows until the viewer is known, so a seller never sees
 * their own Follow button flash in and out.
 */
export function SellerFollowToggle({ sellerId }: { sellerId: string }) {
  const me = useCurrentUser();
  if (me.isPending || me.data?.id === sellerId) return null;
  return <FollowSellerButton sellerId={sellerId} />;
}
