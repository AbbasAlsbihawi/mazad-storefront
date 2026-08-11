'use client';

import { AuthGuard } from '@features/auth';
import { WinsPage } from '@features/wins';
import { useAddresses } from '@features/addresses';

// Confirming a win needs a delivery address, which belongs to the addresses slice — the route
// composes the two rather than letting wins import addresses (AGENTS.md rule 1).
function WinsRoute() {
  const addresses = useAddresses();
  return <WinsPage addresses={addresses.data ?? []} isAddressesPending={addresses.isPending} />;
}

export default function Page() {
  return (
    <AuthGuard>
      <WinsRoute />
    </AuthGuard>
  );
}
