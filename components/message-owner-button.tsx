"use client";
import { useState } from "react";
import { Button, Textarea, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/react";

export default function MessageOwnerButton({ listingId, ownerId, ownerUsername }: { listingId: number, ownerId: number, ownerUsername: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      if (!token) throw new Error("You must be logged in to send a message.");
      const res = await fetch("http://localhost:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listing_id: listingId,
          content: content,
          recipient_id: ownerId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to send message");
      }
      setSuccess(true);
      setContent("");
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button color="primary" size="lg" onPress={onOpen}>
        Message Owner
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          <ModalHeader>Message {ownerUsername}</ModalHeader>
          <ModalBody>
            <Textarea
              size="lg"
              label="Message"
              placeholder="Ask about availability, pickup, etc."
              value={content}
              onValueChange={setContent}
              minRows={3}
              isRequired
            />
            {error && <div className="text-danger text-xs mt-2">{error}</div>}
            {success && <div className="text-success text-xs mt-2">Message sent successfully!</div>}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" isLoading={loading} onPress={handleSend} isDisabled={!content.trim()}>
              Send
            </Button>
            <Button variant="light" onPress={onOpenChange}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
