import { title } from "@/components/primitives";
import { Card } from "@heroui/card";

// Fake approved listings data
const listings = [
  {
    id: 1,
    title: "Gently Used Textbooks",
    description: "A set of math and science textbooks in good condition.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
    contact_details: "Contact John Doe at johndoe@email.com",
  },
  {
    id: 2,
    title: "Office Chair",
    description: "Ergonomic office chair, barely used.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    contact_details: "Contact Jane Smith at janesmith@email.com",
  },
  {
    id: 3,
    title: "Kitchen Utensils Set",
    description: "Complete set of kitchen utensils, perfect for students.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    contact_details: "Contact Alex Lee at alexlee@email.com",
  },
];

export default function InventoryPage() {
  return (
    <div>
      <h1 className={title()}>Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {listings.map((listing) => (
          <Card key={listing.id} className="w-full max-w-sm mx-auto">
            {listing.image && (
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
              <p className="text-default-600 mb-2">{listing.description}</p>
              <p className="text-sm text-default-500">{listing.contact_details}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
