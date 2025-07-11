import InventoryClient from '@/components/inventory-client';

async function fetchInventory() {
  try {
    // Fetch inventory data from the backend (adjust endpoint as needed)
    const res = await fetch('http://localhost:8000/api/listings/', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function InventoryPage() {
  const listings = await fetchInventory();
  return <InventoryClient listings={listings} />;
}
