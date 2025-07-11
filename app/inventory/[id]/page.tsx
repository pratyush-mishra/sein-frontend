import Link from "next/link";
import { notFound } from "next/navigation";
import { Listing } from '@/app/api/Interfaces';
import ListingDetailClient from '@/components/listing-detail-client';

async function fetchListing(id: string): Promise<Listing | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/listings/${id}/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const listing = await fetchListing(resolvedParams.id);
  if (!listing) return notFound();

  // Owner info for messaging
  const ownerId = listing.owner && (listing.owner as any).id;
  const ownerUsername = listing.owner && (listing.owner as any).username;

  return (
    <ListingDetailClient listing={listing} ownerId={ownerId} ownerUsername={ownerUsername} />
  );
} 