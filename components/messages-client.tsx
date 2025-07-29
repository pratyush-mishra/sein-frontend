"use client";
import { useEffect, useState } from "react";
import { Card } from "@heroui/card";
import { Skeleton, Input } from "@heroui/react";
import { title } from "@/components/primitives";
import { Message, MessagesClientProps } from "@/app/api/Interfaces";
import { SearchIcon } from "@/components/icons";

function getListingId(listing: any): number | undefined {
  if (typeof listing === 'object' && listing !== null && 'id' in listing) return listing.id;
  return undefined;
}

function getListingTitle(listing: any): string {
  if (typeof listing === 'object' && listing !== null && 'title' in listing && listing.title) return listing.title;
  return 'Unknown Listing';
}

function getListingTags(listing: any): string[] {
  if (typeof listing === 'object' && listing !== null && Array.isArray(listing.tags)) return listing.tags;
  return [];
}

export default function MessagesClient({ initialMessages }: MessagesClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedListingId, setSelectedListingId] = useState<number | undefined>(undefined);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  async function fetchMessages(selectedId?: number) {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      let res;
      if (token) {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/`);
      }
      if (res.status === 401) throw new Error("You must be logged in to view messages.");
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await res.json();
      setMessages(data);
      // Default to first listing if available
      if (data.length > 0 && (!selectedListingId || selectedId)) {
        const firstListingId = getListingId(data[0].listing);
        setSelectedListingId(selectedId || firstListingId);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
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
        const data = await res.json();
        setCurrentUserId(data.id);
      } catch {
        // ignore
      }
    }
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group messages by listing
  const listingMap: Record<number, { title: string; tags: string[]; messages: Message[] }> = {};
  for (const msg of messages) {
    const id = getListingId(msg.listing);
    if (!id) continue;
    if (!listingMap[id]) {
      listingMap[id] = {
        title: getListingTitle(msg.listing),
        tags: getListingTags(msg.listing),
        messages: [],
      };
    }
    listingMap[id].messages.push(msg);
  }
  const listingIds = Object.keys(listingMap).map(Number);

  // Filter listings by search (title or user in messages)
  const filteredListingIds = search.trim().length === 0
    ? listingIds
    : listingIds.filter((id) => {
        const { title, messages } = listingMap[id];
        const searchLower = search.toLowerCase();
        // Check title
        if (title.toLowerCase().includes(searchLower)) {
          return true;
        }
        // Check sender/recipient username in any message for this listing
        return messages.some((msg) => {
          const sender = typeof msg.sender === 'object' && msg.sender !== null && 'username' in msg.sender ? msg.sender.username : msg.sender;
          const recipient = typeof msg.recipient === 'object' && msg.recipient !== null && 'username' in msg.recipient ? msg.recipient.username : msg.recipient;
          return (
            (typeof sender === 'string' && sender.toLowerCase().includes(searchLower)) ||
            (typeof recipient === 'string' && recipient.toLowerCase().includes(searchLower))
          );
        });
      });

  // Messages for selected listing
  const selectedMessages = selectedListingId && listingMap[selectedListingId] ? listingMap[selectedListingId].messages : [];
  const selectedListingTitle = selectedListingId && listingMap[selectedListingId] ? listingMap[selectedListingId].title : '';

  // Helper to get display name for sender/recipient
  function getDisplayName(user: any, isOwner: boolean, isCurrentUser: boolean) {
    if (isCurrentUser) return "You";
    if (typeof user === 'object' && user !== null && 'username' in user) return user.username;
    return typeof user === 'string' ? user : '';
  }

  return (
    <div>
      <h1 className={title()}>Messages</h1>
      {loading && (
        <div className="flex flex-col md:flex-row gap-6 mt-8 min-h-[400px]">
          {/* Left: Listing Overview Skeleton */}
          <div className="md:w-1/3 w-full border-r border-default-200 pr-0 md:pr-4 mb-6 md:mb-0">
            <Skeleton className="h-6 w-2/3 mb-4 rounded" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          </div>
          {/* Right: Message Details Skeleton */}
          <div className="md:w-2/3 w-full">
            <Skeleton className="h-6 w-1/2 mb-4 rounded" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded" />
              ))}
            </div>
          </div>
        </div>
      )}
      {error && <div className="text-center text-danger mt-8">{error}</div>}
      {!loading && !error && (
        <div className="flex flex-col md:flex-row gap-6 mt-8 min-h-[400px]">
          {/* Left: Listing Overview */}
          <div className="md:w-1/3 w-full border-r border-default-200 pr-0 md:pr-4 mb-6 md:mb-0">
            <div className="font-semibold text-lg mb-4">Listings</div>
            <Input
              className="mb-4"
              placeholder="Search listings by name or user..."
              value={search}
              onValueChange={setSearch}
              isClearable
            />
            {filteredListingIds.length === 0 ? (
              <div className="text-default-400">No messages found.</div>
            ) : (
              <ul className="space-y-2">
                {filteredListingIds.map((id) => (
                  <li key={id}>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        id === selectedListingId
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'hover:bg-default-100 text-default-700'
                      }`}
                      onClick={() => setSelectedListingId(id)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{listingMap[id].title}</span>
                        <span className="text-xs bg-default-200 rounded-full px-2 py-0.5 ml-2">{listingMap[id].messages.length}</span>
                      </div>
                      {/* Show tags if present */}
                      {listingMap[id].tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {listingMap[id].tags.map((tag) => (
                            <span key={tag} className="text-xs bg-default-100 rounded px-2 py-0.5 text-default-500">{tag}</span>
                          ))}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Right: Message Details */}
          <div className="md:w-2/3 w-full">
            <div className="font-semibold text-lg mb-4">{selectedListingTitle || 'Select a listing'}</div>
            {selectedMessages.length === 0 ? (
              <div className="text-default-400">No messages for this listing.</div>
            ) : (
              <>
              <div className="space-y-4">
                {[...selectedMessages]
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((msg) => {
                    // Determine if current user is sender or recipient
                    const senderId = typeof msg.sender === 'object' && msg.sender !== null && 'id' in msg.sender && typeof msg.sender.id === 'number' ? msg.sender.id : undefined;
                    const recipientId = typeof msg.recipient === 'object' && msg.recipient !== null && 'id' in msg.recipient && typeof msg.recipient.id === 'number' ? msg.recipient.id : undefined;
                    const isSenderCurrentUser = currentUserId !== null && senderId === currentUserId;
                    const isRecipientCurrentUser = currentUserId !== null && recipientId === currentUserId;
                    // For owner, assume recipient is the owner
                    const isOwner = isRecipientCurrentUser;
                    return (
                      <Card key={msg.id} className={`w-full p-4 ${isOwner && !isSenderCurrentUser ? 'border-l-4 border-primary' : ''}`}>
                        <div className="mb-1 text-xs text-default-500">
                          From: <span className="font-semibold">{getDisplayName(msg.sender, false, isSenderCurrentUser)}</span> &rarr; To: <span className="font-semibold">{getDisplayName(msg.recipient, isOwner, isRecipientCurrentUser)}</span>
                        </div>
                        <div className="mb-2 text-default-700 whitespace-pre-line">{msg.content}</div>
                        <div className="text-xs text-default-400">{new Date(msg.timestamp).toLocaleString()}</div>
                      </Card>
                    );
                  })}
              </div>
              {/* Reply form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSending(true);
                  setSendError("");
                  try {
                    const token = localStorage.getItem("access_token");
                    // Find the recipient: if current user is sender, reply to recipient, else reply to sender
                    const lastMsg = selectedMessages[selectedMessages.length - 1];
                    let recipientId;
                    const lastSenderId = typeof lastMsg.sender === 'object' && lastMsg.sender !== null && 'id' in lastMsg.sender && typeof lastMsg.sender.id === 'number' ? lastMsg.sender.id : undefined;
                    const lastRecipientId = typeof lastMsg.recipient === 'object' && lastMsg.recipient !== null && 'id' in lastMsg.recipient && typeof lastMsg.recipient.id === 'number' ? lastMsg.recipient.id : undefined;
                    if (currentUserId === lastSenderId) {
                      recipientId = lastRecipientId;
                    } else {
                      recipientId = lastSenderId;
                    }
                    if (!recipientId) throw new Error("Could not determine recipient.");
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        listing_id: selectedListingId,
                        recipient_id: recipientId,
                        content: replyContent,
                      }),
                    });
                    if (!res.ok) {
                      const data = await res.json();
                      throw new Error(data.detail || "Failed to send message");
                    }
                    setReplyContent("");
                    // Refresh messages for this listing
                    await fetchMessages(selectedListingId);
                  } catch (err: any) {
                    setSendError(err.message || "Failed to send message");
                  } finally {
                    setSending(false);
                  }
                }}
                className="mt-4 flex flex-col gap-2"
              >
                <textarea
                  className="border rounded p-2"
                  placeholder="Type your reply..."
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  rows={3}
                  required
                />
                {sendError && <div className="text-danger text-xs">{sendError}</div>}
                <button
                  type="submit"
                  className="self-end bg-primary text-white px-4 py-2 rounded"
                  disabled={sending || !replyContent.trim()}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 