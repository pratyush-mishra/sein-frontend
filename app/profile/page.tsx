"use client";
import { useEffect, useState, useRef } from "react";
import { Input, Textarea, Button, Skeleton, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/react";
import { title } from "@/components/primitives";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);
  const [previewPic, setPreviewPic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } = useDisclosure();
  const [listings, setListings] = useState<any[]>([]);
  const [listingToDelete, setListingToDelete] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const router = useRouter();
  const { user: authUser, isLoading, error } = useAuth({ required: true });

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    async function fetchListings() {
      if (user) {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
          if (!token) return;
          const listingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (listingsRes.ok) {
            const allListings = await listingsRes.json();
            const userListings = allListings.filter((l: any) => l.owner && l.owner.id === user.id && l.is_approved);
            setListings(userListings);
          }
        } catch (err) {
          console.error("Failed to fetch listings:", err);
        }
      }
    }
    fetchListings();
  }, [user]);

  // Handle edit form submit
  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess(false);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) throw new Error("Not authenticated");
      const formData = new FormData(e.currentTarget); // Ensure formData is defined
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
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

  async function handleDeleteListing() {
    if (!listingToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listingToDelete.id}/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to delete listing.");
      }
      setListings(prevListings => prevListings.filter(l => l.id !== listingToDelete.id));
      onDeleteModalOpenChange();
      setListingToDelete(null);
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
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

  if (isLoading) {
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

  if (!user) {
    return null; // Or a different loader, but isLoading should handle it.
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
      {/* User's Active Listings */}
      {listings.length > 0 && (
        <div className="w-full max-w-2xl mt-12">
          <h2 className="text-xl font-semibold mb-4">Your Active Listings</h2>
          <div className="space-y-6">
            {listings.map(listing => (
              <div key={listing.id} className="border rounded-lg p-4 flex flex-col gap-2 bg-white">
                <div className="flex flex-col md:flex-row gap-4">
                  <img src={listing.images && listing.images[0] ? listing.images[0].image : '/default-profile.png'} alt={listing.title} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{listing.title}</h3>
                    <p className="text-default-600">{listing.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button color="primary" className="w-fit" onPress={() => router.push(`/listing/edit/${listing.id}`)}>
                    Edit Listing
                  </Button>
                  <Button
                    color="danger"
                    variant="bordered"
                    className="w-fit"
                    onPress={() => { setListingToDelete(listing); onDeleteModalOpen(); }}>
                    Delete Listing
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center mt-8 w-full">
        <Button color="primary" size="lg" className="px-8" onPress={onOpen}>
          Edit Profile
        </Button>
      </div>
      {/* Edit Profile Modal */}
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
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange} placement="center">
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete the listing: <strong>{listingToDelete?.title}</strong>?</p>
            <p className="text-sm text-danger mt-2">This action cannot be undone.</p>
            {deleteError && <div className="text-danger text-xs mt-2">{deleteError}</div>}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteModalOpenChange} type="button">
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteListing} isLoading={deleteLoading}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
