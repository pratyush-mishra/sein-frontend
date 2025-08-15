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

  // Color palette
  const colorClasses = [
    "bg-pink-500 bg-opacity-70 hover:bg-pink-600",
    "bg-blue-500 bg-opacity-70 hover:bg-blue-600",
    "bg-green-500 bg-opacity-70 hover:bg-green-600",
    "bg-yellow-500 bg-opacity-70 hover:bg-yellow-600",
    "bg-purple-500 bg-opacity-70 hover:bg-purple-600",
    "bg-red-500 bg-opacity-70 hover:bg-red-600",
    "bg-teal-500 bg-opacity-70 hover:bg-teal-600",
    "bg-orange-500 bg-opacity-70 hover:bg-orange-600",
    "bg-indigo-500 bg-opacity-70 hover:bg-indigo-600",
    "bg-cyan-500 bg-opacity-70 hover:bg-cyan-600",
  ];

  const badgeColorClasses = [
    "bg-pink-500 bg-opacity-70 text-white",
    "bg-blue-500 bg-opacity-70 text-white",
    "bg-green-500 bg-opacity-70 text-white",
    "bg-yellow-500 bg-opacity-70 text-white",
    "bg-purple-500 bg-opacity-70 text-white",
    "bg-red-500 bg-opacity-70 text-white",
    "bg-teal-500 bg-opacity-70 text-white",
    "bg-orange-500 bg-opacity-70 text-white",
    "bg-indigo-500 bg-opacity-70 text-white",
    "bg-cyan-500 bg-opacity-70 text-white",
  ];

  // Function to get consistent color for a category
  const getCategoryColor = (categoryValue: string, isButton: boolean = false) => {
    const categoryColorMap: { [key: string]: number } = {
      'office_material': 0,
      'outdoors': 1,
      'physical_space': 2,
      'filming_equipment': 3,
      'kids': 4,
      'sports_and_games': 5,
      'kitchen_cooking': 6,
      'art_equipment': 7,
      'other': 8,
      // Reserve index 9 for any future category
    };
    
    const index = categoryColorMap[categoryValue] ?? 9; // Default to index 9 if category not found
    return isButton ? colorClasses[index] : badgeColorClasses[index];
  };

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
      {/* Category buttons with consistent colors */}
      <div className="flex justify-center flex-wrap gap-4 my-4">
        <Button
          onClick={() => onCategoryChange("")}
          size="lg" radius="full"
          className={`${colorClasses[0]} text-grey text-lg font-semibold transition-colors duration-200`}
        >
          All
        </Button>
        {categories.map(([value, label]) => (
          <Button
            key={value}
            onClick={() => onCategoryChange(value)}
            size="lg" radius="full"
            className={`${getCategoryColor(value, true)} text-grey text-lg font-semibold transition-colors duration-200`}
          >
            {label}
          </Button>
        ))}
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
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    {/* Category badges with consistent colors */}
                    {listing.category && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(() => {
                          let categoryKeys: string[] = [];
                          if (typeof listing.category === 'string') {
                            try {
                              // Try parsing it as a JSON array
                              const parsed = JSON.parse(listing.category);
                              if (Array.isArray(parsed)) {
                                categoryKeys = parsed;
                              } else {
                                // It's a single string value
                                categoryKeys = [listing.category];
                              }
                            } catch (e) {
                              // Not a JSON string, treat as a single category key
                              categoryKeys = [listing.category];
                            }
                          } else if (Array.isArray(listing.category)) {
                            categoryKeys = listing.category;
                          }

                          return categoryKeys.map((categoryKey, index) => {
                            const found = categories.find(([value]) => value === categoryKey);
                            const label = found ? found[1] : categoryKey;
                            const colorClass = getCategoryColor(categoryKey);
                            return (
                              <span 
                                key={index} 
                                className={`${colorClass} text-xs px-3 py-1 rounded-full w-fit font-semibold`}
                              >
                                {label}
                              </span>
                            );
                          });
                        })()}
                      </div>
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