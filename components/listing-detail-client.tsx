"use client";
import { useEffect, useState } from "react";
import { Chip, Skeleton } from "@heroui/react";
import Link from "next/link";
import MessageOwnerButton from "@/components/message-owner-button";
import { Listing } from '@/app/api/Interfaces';

export default function ListingDetailClient({ listing, ownerId, ownerUsername }: {
  listing: Listing,
  ownerId: number,
  ownerUsername: string,
}) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [form, setForm] = useState<Partial<Listing>>(listing);
  useEffect(() => {
    setForm(listing);
  }, [listing]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await fetch("http://localhost:8000/auth/users/me/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setCurrentUserId(data.id);
      } finally {
        setIsPageLoading(false); // Set to false as soon as data is fetched
      }
    }
    fetchCurrentUser();
  }, []);

  if (isPageLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
            <Skeleton className="w-full h-64 rounded-lg" />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <Skeleton className="h-10 w-2/3 mb-2 rounded" />
            <Skeleton className="h-6 w-1/2 mb-2 rounded" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full mb-2 rounded" />
            ))}
            <Skeleton className="h-4 w-1/3 mt-2 rounded" />
            <Skeleton className="h-6 w-1/4 mt-2 rounded" />
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Skeleton className="h-12 w-40 rounded" />
        </div>
        <div className="flex justify-center mt-4">
          <Skeleton className="h-6 w-32 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 w-full">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        {listing.image && (
          <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-2 break-words">{listing.title}</h1>
          <div className="flex flex-wrap gap-2 items-center mb-2">
            {listing.category && (
              <Chip color="primary" variant="solid" size="md">
                {categoryLabel(listing.category)}
              </Chip>
            )}
            {listing.qty !== undefined && (
              <span className="text-sm bg-default-100 rounded px-2 py-1">Qty: {listing.qty}</span>
            )}
            {listing.is_fee && listing.fee !== undefined && (
              <span className="text-sm bg-default-100 rounded px-2 py-1">Fee: {listing.fee}</span>
            )}
          </div>
          <p className="text-default-600 mb-2 whitespace-pre-line">{listing.description}</p>
          {listing.dimensions && (
            <div className="text-sm text-default-500"><span className="font-semibold">Dimensions:</span> {listing.dimensions}</div>
          )}
          {listing.availability && (
            <div className="text-sm text-default-500"><span className="font-semibold">Availability:</span> {listing.availability}</div>
          )}
          {listing.condition && (
            <div className="text-sm text-default-500"><span className="font-semibold">Condition:</span> {listing.condition}</div>
          )}
          {listing.comment && (
            <div className="text-sm text-default-500"><span className="font-semibold">Comment:</span> {listing.comment}</div>
          )}
          {listing.contact_details && (
            <div className="text-sm text-default-500"><span className="font-semibold">Contact:</span> {listing.contact_details}</div>
          )}
          <div className="text-xs text-default-400 mt-2">
            Created: {listing.created_at && new Date(listing.created_at).toLocaleString()}<br />
            Updated: {listing.updated_at && new Date(listing.updated_at).toLocaleString()}
          </div>
          {ownerId && (
            <div className="mt-2">
              <Link href={`/profile/${ownerId}`} className="text-blue-600 hover:underline text-sm">View Owner Profile</Link>
            </div>
          )}
        </div>
      </div>
      {/* Message Owner Button and Modal */}
      <div className="flex justify-center mt-8">
        {currentUserId !== null && currentUserId !== ownerId && (
          <MessageOwnerButton listingId={listing.id} ownerId={ownerId} ownerUsername={ownerUsername} />
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Link href="/inventory" className="inline-block text-blue-600 hover:underline">&larr; Back to Inventory</Link>
      </div>
    </div>
  );
}

function categoryLabel(key: string) {
  switch (key) {
    case "office_material": return "Office Material";
    case "gardening_supplies": return "Gardening Supplies";
    case "physical_space": return "Physical Space";
    case "tools": return "Tools";
    case "other": return "Other";
    default: return key;
  }
} 