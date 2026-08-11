'use client';

import { HomePage } from '@features/home';
import { CategoryRail } from '@features/catalog';
import { useUnreadNotificationCount } from '@features/notifications';

// The one place home, catalog and notifications meet: the feature slices never import each
// other, so the route composes catalog's category rail and the unread badge into home's
// layout (AGENTS.md rule 1).
export default function Page() {
  const unread = useUnreadNotificationCount();

  return <HomePage categoryRail={<CategoryRail />} unreadNotificationCount={unread.data ?? 0} />;
}
