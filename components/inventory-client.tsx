"use client";
import { useState, useEffect } from "react";
import { title } from "@/components/primitives";
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/react";
import Link from "next/link";
import { Listing } from '@/app/api/Interfaces';
import { Input } from "@heroui/input";
import { Button } from "@heroui/react";

export default function InventoryClient({ listings, onSearch, onCategoryChange }: { listings: Listing[], onSearch: (search: string) => void, onCategoryChange: (category: string) => void }) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const isLoading = !listings;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/categories/`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearch(value);
  };

  return (
    <div>
      <h1 className={`${title()} text-center`}>Inventory</h1>
      <div className="flex justify-center my-6">
        <Input
          aria-label="Search inventory"
          classNames={{
            inputWrapper: "bg-white text-black border border-gray-300 rounded-full px-4 py-2 w-80",
            input: "text-base bg-transparent border-none outline-none",
          }}
          placeholder="Search inventory..."
          value={search}
          onValueChange={handleSearchChange}
          type="search"
        />
      </div>
      {/* Colorful category buttons */}
      <div className="flex justify-center flex-wrap gap-4 my-4">
        {(() => {
          // Define a palette of Tailwind color classes
          const colorClasses = [
            "bg-pink-500 bg-opacity-70 hover:bg-pink-600 text-grey text-lg",
            "bg-blue-500 bg-opacity-70 hover:bg-blue-600 text-grey text-lg",
            "bg-green-500 bg-opacity-70 hover:bg-green-600 text-grey text-lg",
            "bg-yellow-500 bg-opacity-70 hover:bg-yellow-600 text-grey text-lg",
            "bg-purple-500 bg-opacity-70 hover:bg-purple-600 text-grey text-lg",
            "bg-red-500 bg-opacity-70 hover:bg-red-600 text-grey text-lg",
            "bg-teal-500 bg-opacity-70 hover:bg-teal-600 text-grey text-lg",
            "bg-orange-500 bg-opacity-70 hover:bg-orange-600 text-grey text-lg",
            "bg-indigo-500 bg-opacity-70 hover:bg-indigo-600 text-grey text-lg",
            "bg-cyan-500 bg-opacity-70 hover:bg-cyan-600 text-grey text-lg",
          ];
          return (
            <>
              <Button
                onClick={() => onCategoryChange("")}
                size="lg" radius="full"
                className={colorClasses[0] + " font-semibold transition-colors duration-200"}
              >
                All
              </Button>
              {categories.map(([value, label], idx) => (
                <Button
                  key={value}
                  onClick={() => onCategoryChange(value)}
                  size="lg" radius="full"
                  className={
                    colorClasses[(idx + 1) % colorClasses.length] +
                    " font-semibold transition-colors duration-200"
                  }
                >
                  {label}
                </Button>
              ))}
            </>
          );
        })()}
      </div>
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
                  {listing.images && listing.images.length > 0 && (
                    <div className="w-full aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden">
                      <img
                        src={listing.images[0].image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    {/* Category badge */}
                    {listing.category && (
                      <span
                        className={
                          (() => {
                            // Try to match the category value to the index in categories
                            const idx = categories.findIndex(([value]) => value === listing.category);
                            const colorClasses = [
                              "bg-pink-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                              "bg-blue-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                              "bg-green-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                              "bg-yellow-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                              "bg-purple-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                              "bg-red-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                              "bg-teal-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                              "bg-orange-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                              "bg-indigo-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                              "bg-cyan-500 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full mb-2 w-fit font-semibold",
                            ];
                            return colorClasses[
                              idx >= 0 ? (idx + 1) % colorClasses.length : 0
                            ];
                          })()
                        }
                      >
                        {/* Show the label if possible, else the value */}
                        {(() => {
                          const found = categories.find(([value]) => value === listing.category);
                          return found ? found[1] : listing.category;
                        })()}
                      </span>
                    )}
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