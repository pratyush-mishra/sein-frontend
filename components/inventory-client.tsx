"use client";
import { title } from "@/components/primitives";
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/react";
import Link from "next/link";
import { Listing } from '@/app/api/Interfaces';

export default function InventoryClient({ listings }: { listings: Listing[] }) {
  const isLoading = !listings || listings.length === 0;
  return (
    <div>
      <h1 className={`${title()} text-center`}>Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 px-4 mx-auto">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Card key={i} className="w-full shadow-2xl flex flex-col">
                <Skeleton className="w-full aspect-[4/3] rounded-t-lg" />
                <div className="p-8 flex-1 flex flex-col">
                  <Skeleton className="h-8 w-2/3 mb-4 rounded" />
                  <Skeleton className="h-6 w-full mb-4 rounded" />
                  <Skeleton className="h-4 w-1/2 mt-auto rounded" />
                </div>
              </Card>
            ))
          : listings.map((listing) => (
              <Link key={listing.id} href={`/inventory/${listing.id}`} className="block">
                <Card className="w-full shadow-2xl hover:scale-105 transition-transform duration-200 flex flex-col">
                  {listing.image && (
                    <div className="w-full aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    <h2 className="text-2xl font-semibold mb-4">{listing.title}</h2>
                    <p className="text-lg text-default-600 mb-4 flex-1">{listing.description}</p>
                    <p className="text-base text-default-500 mt-auto">{listing.contact_details}</p>
                  </div>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
} 