import type { Metadata } from 'next';
import { NotFoundScreen } from '@shared/components/feedback';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة — Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundScreen />;
}
