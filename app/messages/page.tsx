import MessagesClient from '@/components/messages-client';

async function fetchMessages() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    // On the server, localStorage is not available. So, messages should be fetched on the client.
    // We'll pass an empty array here and let the client component fetch messages with the token.
    return [];
  } catch {
    return [];
  }
}

export default async function MessagesPage() {
  const messages = await fetchMessages();
  return <MessagesClient initialMessages={messages} />;
}
