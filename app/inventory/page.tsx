"use client"
import { title } from "@/components/primitives";
import { Card } from "@heroui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import {Listing }from '@/app/api/Interfaces'


export default function InventoryPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("http://localhost:8000/api/listings/");
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  return (
    <div>
      <h1 className={`${title()} text-center`}>Inventory</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 px-4 mx-auto">
        {listings.map((listing) => (
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
