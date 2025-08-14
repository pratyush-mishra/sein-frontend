"use client";
import { useEffect, useState } from "react";
import { Chip, Skeleton } from "@heroui/react";
import Link from "next/link";
import MessageOwnerButton from "@/components/message-owner-button";
import { Listing } from '@/app/api/Interfaces';
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ListingDetailClient({ listing, ownerId, ownerUsername }: {
  listing: Listing,
  ownerId: number,
  ownerUsername: string,
}) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [form, setForm] = useState<Partial<Listing>>(listing);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  useEffect(() => {
    setForm(listing);
  }, [listing]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const userData = await res.json();
        setCurrentUserId(userData.id);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
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
    <div className="max-w-6xl mx-auto mt-10 px-2 sm:px-4 w-full">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Image Carousel */}
        <div className="flex-shrink-0 w-full lg:w-1/2 flex flex-col items-center justify-center relative">
          {Array.isArray(listing.images) && listing.images.length > 0 ? (
            <>
              <div className="relative w-full max-w-[32rem] h-[28rem] flex items-center justify-center">
                <img
                  src={listing.images?.[currentImageIdx]?.image || "/default-profile.png"}
                  alt=""
                  className="w-full h-[36rem] max-w-[48rem] object-cover rounded-2xl shadow-2xl border-4 border-primary"
                />
                {listing.images?.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
                      onClick={() => setCurrentImageIdx((prev) => (prev === 0 ? (listing.images?.length || 1) - 1 : prev - 1))}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
                      onClick={() => setCurrentImageIdx((prev) => (prev === (listing.images?.length || 1) - 1 ? 0 : prev + 1))}
                      aria-label="Next image"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}
                {listing.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {listing.images?.map((img: any, idx: number) => (
                      <span
                        key={img.id}
                        className={`inline-block w-3 h-3 rounded-full ${idx === currentImageIdx ? 'bg-primary' : 'bg-default-300'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <img
              src="/default-profile.png"
              alt=""
              className="w-full h-[36rem] max-w-[48rem] object-cover rounded-2xl shadow-2xl border-4 border-primary"
            />
          )}
        </div>
        {/* Info */}
        <div className="flex-1 flex flex-col gap-10 bg-white/80 rounded-2xl p-10 shadow-lg border border-default-200 min-w-0">
          <h1 className="text-5xl font-extrabold mb-4 break-words text-primary drop-shadow-lg">{listing.title}</h1>
          {/* Creator/Owner */}
          <div className="mb-2 text-lg text-default-700 font-medium flex items-center gap-2">
            <span>By:</span>
            <span className="text-primary font-bold">
              {ownerUsername || (listing.owner && (listing.owner as any).username) || 'Unknown'}
            </span>
          </div>
          {/* Key Attributes Row */}
          <div className="flex flex-wrap gap-6 items-center mb-4 border-b border-default-200 pb-4">
            {listing.category && (
              <div className="flex flex-wrap gap-2">
                {(() => {
                  let categoryKeys: string[] = [];
                  if (typeof listing.category === 'string') {
                    try {
                      const parsed = JSON.parse(listing.category);
                      if (Array.isArray(parsed)) {
                        categoryKeys = parsed;
                      } else {
                        categoryKeys = [listing.category];
                      }
                    } catch (e) {
                      categoryKeys = [listing.category];
                    }
                  } else if (Array.isArray(listing.category)) {
                    categoryKeys = listing.category;
                  }

                  return categoryKeys.map((categoryKey, index) => (
                    <Chip key={index} color="primary" variant="solid" size="lg" className="text-xl px-4 py-2">
                      {categoryLabel(categoryKey)}
                    </Chip>
                  ));
                })()}
              </div>
            )}
            {listing.qty !== undefined && (
              <span className="text-lg bg-default-100 rounded px-4 py-2 font-semibold">Qty: {listing.qty}</span>
            )}
            {listing.is_fee && listing.fee !== undefined && (
              <span className="text-lg bg-default-100 rounded px-4 py-2 font-semibold">Fee: {listing.fee}</span>
            )}
          </div>
          {/* Details List */}
          <div className="flex flex-col gap-4 text-lg">
            <div>
              <span className="font-semibold">Description:</span>
              <span className="ml-2 text-default-700 whitespace-pre-line leading-relaxed">{listing.description}</span>
            </div>
            {listing.dimensions && (
              <div><span className="font-semibold">Dimensions:</span> <span className="ml-2 text-default-500">{listing.dimensions}</span></div>
            )}
            {listing.availability && (
              <div><span className="font-semibold">Availability:</span> <span className="ml-2 text-default-500">{listing.availability}</span></div>
            )}
            {listing.condition && (
              <div><span className="font-semibold">Condition:</span> <span className="ml-2 text-default-500">{listing.condition}</span></div>
            )}
            {listing.comment && (
              <div><span className="font-semibold">Comment:</span> <span className="ml-2 text-default-500">{listing.comment}</span></div>
            )}
            {listing.contact_details && (
              <div><span className="font-semibold">Contact:</span> <span className="ml-2 text-default-500">{listing.contact_details}</span></div>
            )}
          </div>
          <div className="text-base text-default-400 mt-4 border-t border-default-200 pt-4">
            <span className="font-semibold">Created:</span> {listing.created_at && new Date(listing.created_at).toLocaleString()}<br />
            <span className="font-semibold">Updated:</span> {listing.updated_at && new Date(listing.updated_at).toLocaleString()}
          </div>
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