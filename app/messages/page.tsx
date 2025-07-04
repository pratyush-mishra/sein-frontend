import { Card } from "@heroui/card";
import { title } from "@/components/primitives";

// Fake messages data
const messages = [
  {
    id: 1,
    listingTitle: "Gently Used Textbooks",
    sender: "johndoe",
    recipient: "janesmith",
    content: "Hi, is this still available?",
    timestamp: "2025-06-24 14:00",
  },
  {
    id: 2,
    listingTitle: "Office Chair",
    sender: "janesmith",
    recipient: "johndoe",
    content: "Yes, it's available!",
    timestamp: "2025-06-24 14:05",
  },
  {
    id: 3,
    listingTitle: "Kitchen Utensils Set",
    sender: "alexlee",
    recipient: "johndoe",
    content: "Can you share more pictures?",
    timestamp: "2025-06-24 15:00",
  },
];

export default function MessagesPage() {
  return (
    <div>
      <h1 className={title()}>Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {messages.map((msg) => (
          <Card key={msg.id} className="w-full max-w-md mx-auto p-4">
            <div className="mb-2 text-sm text-default-400">Listing: <span className="font-medium text-default-600">{msg.listingTitle}</span></div>
            <div className="mb-1 text-xs text-default-500">From: <span className="font-semibold">{msg.sender}</span> &rarr; To: <span className="font-semibold">{msg.recipient}</span></div>
            <div className="mb-2 text-default-700">{msg.content}</div>
            <div className="text-xs text-default-400">{msg.timestamp}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
