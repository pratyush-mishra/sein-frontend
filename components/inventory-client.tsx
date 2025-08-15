"use client";
import { useState, useEffect } from "react";
import { title } from "@/components/primitives";
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/react";
import Link from "next/link";
import { Listing } from '@/app/api/Interfaces';
import { Input } from "@heroui/input";
import { Button } from "@heroui/react";
import { categoryColors } from "@/config/colors";

export default function InventoryClient({ listings, onSearch, onCategoryChange }: { listings: Listing[], onSearch: (search: string) => void, onCategoryChange: (category: string) => void }) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<[string, string][]>([]);
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

  const getCategoryColor = (categoryValue: string) => {
    return categoryColors[categoryValue] || "bg-gray-500";
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
        <Button
          onClick={() => onCategoryChange("")}
          size="lg" radius="full"
          className={`bg-pink-500 bg-opacity-70 hover:bg-pink-600 text-grey text-lg font-semibold transition-colors duration-200`}
        >
          All
        </Button>
        {categories.map(([value, label]) => (
          <Button
            key={value}
            onClick={() => onCategoryChange(value)}
            size="lg" radius="full"
            className={`${getCategoryColor(value)} bg-opacity-70 hover:bg-opacity-100 text-white text-lg font-semibold transition-colors duration-200`}
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
                    {/* Category badges */}
                    {listing.category && (
                      <div className="flex flex-wrap gap-2 mb-2">
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

                          return categoryKeys.map((categoryKey, index) => {
                            const found = categories.find(([value]) => value === categoryKey);
                            const label = found ? found[1] : categoryKey;
                            const colorClass = `${getCategoryColor(categoryKey)} bg-opacity-70 text-white text-xs px-3 py-1 rounded-full w-fit font-semibold`;
                            return (
                              <span key={index} className={colorClass}>
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