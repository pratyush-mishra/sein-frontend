import { Card } from "@heroui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Listing }from '@/app/api/Interfaces'



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
  const listing = await fetchListing(params.id);
  if (!listing) return notFound();

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        {listing.image && (
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
          <p className="text-default-600 mb-4">{listing.description}</p>
          <div className="mb-2"><span className="font-semibold">Category:</span> {listing.category}</div>
          {listing.qty !== undefined && <div className="mb-2"><span className="font-semibold">Quantity:</span> {listing.qty}</div>}
          {listing.is_fee && listing.fee !== undefined && <div className="mb-2"><span className="font-semibold">Fee:</span> {listing.fee}</div>}
          {listing.dimensions && <div className="mb-2"><span className="font-semibold">Dimensions:</span> {listing.dimensions}</div>}
          {listing.availability && <div className="mb-2"><span className="font-semibold">Availability:</span> {listing.availability}</div>}
          {listing.condition && <div className="mb-2"><span className="font-semibold">Condition:</span> {listing.condition}</div>}
          {listing.comment && <div className="mb-2"><span className="font-semibold">Comment:</span> {listing.comment}</div>}
          {listing.contact_details && <div className="mb-2"><span className="font-semibold">Contact:</span> {listing.contact_details}</div>}
          <div className="text-xs text-default-400 mt-4">
            Created: {listing.created_at && new Date(listing.created_at).toLocaleString()}<br />
            Updated: {listing.updated_at && new Date(listing.updated_at).toLocaleString()}
          </div>
          <Link href="/inventory" className="inline-block mt-6 text-blue-600 hover:underline">&larr; Back to Inventory</Link>
        </div>
      </Card>
    </div>
  );
} 