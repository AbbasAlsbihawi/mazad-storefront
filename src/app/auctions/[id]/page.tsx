import type { Metadata } from 'next';
import {
  NOT_FOUND,
  auctionJsonLd,
  auctionMetadata,
  fetchPublicAuction,
  serializeJsonLd,
} from '@shared/seo';
import { AuctionPageClient } from './AuctionPageClient';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return auctionMetadata(id, await fetchPublicAuction(id));
}

/**
 * Server shell: page head and structured data come from the public API (cached fetch shared with
 * generateMetadata); the interactive page itself is unchanged and renders client-side.
 */
export default async function Page({ params }: Props) {
  const { id } = await params;
  const auction = await fetchPublicAuction(id);
  return (
    <>
      {auction && auction !== NOT_FOUND ? (
        <script
          type="application/ld+json"
          // Holds seller-written text: serializeJsonLd escapes anything that could close the element.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(auctionJsonLd(id, auction)) }}
        />
      ) : null}
      <AuctionPageClient />
    </>
  );
}
