"use client";
import { useEffect, useState, useRef } from "react";
import { Input, Textarea, Button, Skeleton, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/react";
import { title } from "@/components/primitives";
import { useRouter, useParams } from "next/navigation";
import ListingDetailClient from '@/components/listing-detail-client';

export default function ProfilePage(props: any) {
  const params = useParams();
  const id = params?.id || props?.params?.id;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);
  const [previewPic, setPreviewPic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  // Remove all code related to listings, selectedListing, editModalOpen, and the user's listings section/modal.

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Not authenticated");
        let url = "";
        if (id === "me") {
          url = "http://localhost:8000/auth/users/me/";
        } else {
          url = `http://localhost:8000/api/users/${id}/`;
        }
        const res = await fetch(url, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
        // Check if this is the current user
        if (id === "me" || (data && data.id && localStorage.getItem("userId") && String(data.id) === localStorage.getItem("userId"))) {
          setIsCurrentUser(true);
          // Fetch current user's listings
          const listingsRes = await fetch("http://localhost:8000/api/listings/my/", {
            headers: { Authorization: `Token ${token}` },
          });
          if (listingsRes.ok) {
            //setListings(await listingsRes.json());
          }
        } else {
          setIsCurrentUser(false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  // Handle edit form submit
  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess(false);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");
      const formData = new FormData(e.currentTarget);
      if (!formData.get("profile_picture")) {
        formData.delete("profile_picture");
      }
      const res = await fetch("http://localhost:8000/auth/users/me/", {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to update profile");
      }
      const updated = await res.json();
      setUser(updated);
      setEditSuccess(true);
      onOpenChange();
    } catch (err: any) {
      setEditError(err.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewPic(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewPic(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <h1 className={title()}><Skeleton className="h-10 w-64 rounded mb-4" /></h1>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl mt-8">
          <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-6 w-32 rounded" />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-full rounded" />)}
          </div>
        </div>
        <Skeleton className="h-12 w-40 rounded mt-8" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-danger mt-8">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <h1 className={title()}>Profile</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl mt-8">
        {/* Profile Picture and Username */}
        <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
          <img
            src={user.profile_picture || "/default-profile.png"}
            alt={user.username}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold mb-1">{user.username}</h2>
            <p className="text-default-500">{user.email}</p>
          </div>
        </div>
        {/* Details */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <span className="font-medium">Bio:</span>
            <p className="text-default-600 mt-1 whitespace-pre-line">{user.bio || <span className="text-default-400">No bio provided.</span>}</p>
          </div>
          <div>
            <span className="font-medium">Contact Details:</span>
            <p className="text-default-600 mt-1 whitespace-pre-line">{user.contact_details || <span className="text-default-400">No contact details provided.</span>}</p>
          </div>
        </div>
      </div>
      {isCurrentUser && (
        <div className="flex justify-center mt-8 w-full">
          <Button color="primary" size="lg" className="px-8" onPress={onOpen}>
            Edit Profile
          </Button>
        </div>
      )}
      {/* Edit Profile Modal */}
      {isCurrentUser && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <form onSubmit={handleEditSubmit} encType="multipart/form-data">
              <ModalBody>
                <div className="flex flex-col md:flex-row gap-8 w-full">
                  <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
                    <img
                      src={previewPic || user.profile_picture || "/default-profile.png"}
                      alt={user.username}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                    />
                    <Button
                      type="button"
                      variant="bordered"
                      onPress={() => fileInputRef.current?.click()}
                    >
                      Change Picture
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="profile_picture"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <Input
                      label="Username"
                      name="username"
                      defaultValue={user.username}
                      isRequired
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      defaultValue={user.email}
                      isRequired
                    />
                    <Textarea
                      label="Bio"
                      name="bio"
                      defaultValue={user.bio || ""}
                      minRows={3}
                    />
                    <Textarea
                      label="Contact Details"
                      name="contact_details"
                      defaultValue={user.contact_details || ""}
                      minRows={2}
                    />
                  </div>
                </div>
                {editError && <div className="text-danger text-xs mt-2">{editError}</div>}
                {editSuccess && <div className="text-success text-xs mt-2">Profile updated successfully!</div>}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" isLoading={editLoading}>
                  Save
                </Button>
                <Button variant="light" onPress={onOpenChange} type="button">
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}