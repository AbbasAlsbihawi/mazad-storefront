import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SellerFollowToggle } from './SellerFollowToggle';

const me = vi.hoisted(() => ({
  current: { data: undefined as { id: string } | undefined, isPending: false },
}));
vi.mock('@features/auth', () => ({ useCurrentUser: () => me.current }));
vi.mock('@features/sellers', () => ({
  FollowSellerButton: ({ sellerId }: { sellerId: string }) => (
    <button type="button">follow {sellerId}</button>
  ),
}));

beforeEach(() => {
  me.current = { data: { id: 'buyer-1' }, isPending: false };
});

describe('SellerFollowToggle', () => {
  it("offers Follow on someone else's store or listing", () => {
    render(<SellerFollowToggle sellerId="seller-1" />);
    expect(screen.getByRole('button', { name: 'follow seller-1' })).toBeTruthy();
  });

  it('never offers sellers to follow themselves', () => {
    me.current = { data: { id: 'seller-1' }, isPending: false };
    render(<SellerFollowToggle sellerId="seller-1" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('waits until the viewer is known instead of flashing the button', () => {
    me.current = { data: undefined, isPending: true };
    render(<SellerFollowToggle sellerId="seller-1" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
