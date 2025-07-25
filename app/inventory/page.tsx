"use client";
import { useState, useEffect } from 'react';
import InventoryClient from '@/components/inventory-client';
import { Listing } from '@/app/api/Interfaces';

async function fetchInventory(search: string = "", category: string = "") {
  try {
    const query = new URLSearchParams({ search, category }).toString();
    const res = await fetch(`http://localhost:8000/api/listings/?${query}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default function InventoryPage() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetchInventory().then(setListings);
  }, []);

  const handleSearch = (search: string) => {
    fetchInventory(search).then(setListings);
  };

  const handleCategoryChange = (category: string) => {
    fetchInventory("", category).then(setListings);
  };

  return <InventoryClient listings={listings} onSearch={handleSearch} onCategoryChange={handleCategoryChange} />;
}
