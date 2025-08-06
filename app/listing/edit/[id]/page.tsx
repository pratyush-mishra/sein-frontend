"use client";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { Card } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Input, NumberInput, Select, SelectItem, Button, Form, RadioGroup, Radio } from "@heroui/react";
import ImageUpload from "@/components/image-upload";
import { useRouter, useParams } from "next/navigation";

export default function EditListingPage() {
  const [isFee, setIsFee] = useState("no");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const availability = [
    { key: "pickup", label: "Pick Up" },
    { key: "dropoff", label: "Drop Off" },
    { key: "onsite", label: "Only used on site" },
  ];
  const categories = [
    { key: "office_material", label: "Office Material" },
    { key: "gardening_supplies", label: "Gardening Supplies" },
    { key: "physical_space", label: "Physical Space" },
    { key: "tools", label: "Tools" },
    { key: "other", label: "Other" },
  ];
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    async function fetchListing() {
      if (!id) return;
      setIsPageLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        // TODO
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch listing");
        const data = await res.json();
        setListing(data);
        setIsFee(data.is_fee ? "yes" : "no");
      } catch (err: any) {
        setError(err.message || "Failed to fetch listing");
      } finally {
        setIsPageLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      // Add images to formData
      selectedImages.forEach((file) => {
        formData.append("image", file);
      });
      // Convert availability to a comma-separated string if needed
      if (formData.getAll("availability").length > 1) {
        const avail = formData.getAll("availability").join(",");
        formData.set("availability", avail);
      }
      // Set fee boolean and value
      formData.set("is_fee", isFee === "yes" ? "true" : "false");
      // Send PATCH to backend
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to update listing");
      }
      setSuccess(true);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <h1 className={title()}><span>Loading...</span></h1>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-danger mt-8">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className={title()}>Edit Resource</h1>
      <Card className="w-full max-w-4xl mt-8 p-6">
        <Form className="flex flex-col gap-6" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="flex flex-col gap-4">
              <Input
                isRequired
                label="Title"
                labelPlacement="outside"
                name="title"
                placeholder="Enter title of the resource"
                defaultValue={listing?.title || ""}
              />
              <Textarea
                isRequired
                label="Description"
                name="description"
                labelPlacement="outside"
                maxRows={4}
                placeholder="Give additional information about the resource"
                defaultValue={listing?.description || ""}
              />
              <NumberInput
                isRequired
                hideStepper
                label="Quantity"
                labelPlacement="outside"
                name="qty"
                minValue={1}
                placeholder="Enter the quantity of item(s)"
                defaultValue={listing?.qty || 1}
              />
              <RadioGroup 
                isRequired
                label="Is there any additional fee associated with this resource?"
                name="is_fee"
                value={isFee}
                defaultValue="no"
                orientation="horizontal"
                onValueChange={setIsFee}
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </RadioGroup>
              <NumberInput
                label="Fee Amount (if applicable)"
                name="fee"
                placeholder="NA"
                isRequired={isFee === "yes"}
                defaultValue={listing?.fee || ""}
              />
              <Textarea
                label="Measurement"
                name="dimensions"
                labelPlacement="outside"
                maxRows={2}
                placeholder="Give measurements/dimensions or capacity of the item"
                defaultValue={listing?.dimensions || ""}
              />
              <Select
                label="Availability (you can choose multiple)"
                labelPlacement="outside"
                name="availability"
                placeholder="Select availability"
                selectionMode="multiple"
                defaultSelectedKeys={listing?.availability ? listing.availability.split(",") : []}
              >
                {availability.map((availability) => (
                  <SelectItem key={availability.key}>{availability.label}</SelectItem>
                ))}
              </Select>
              <Textarea
                label="Condition"
                name="condition"
                labelPlacement="outside"
                maxRows={2}
                placeholder="Describe the condition of item"
                defaultValue={listing?.condition || ""}
              />
              <Select
                label="Category (you can choose multiple)"
                labelPlacement="outside"
                name="category"
                placeholder="Select category"
                selectionMode="multiple"
                isRequired
                defaultSelectedKeys={listing?.category ? [listing.category] : []}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.key}>{cat.label}</SelectItem>
                ))}
              </Select>
              <Textarea
                label="Contact Details"
                name="contact_details"
                labelPlacement="outside"
                maxRows={2}
                placeholder="Please give collection times, location and other contact details for this listing."
                isRequired
                defaultValue={listing?.contact_details || ""}
              />
            </div>
            {/* Right Column - Image Upload */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Resource Images</h3>
              <ImageUpload
                maxFiles={8}
                maxSize={5}
                acceptedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                onImagesChange={handleImagesChange}
              />
              {/* Show existing images */}
              {listing?.images && listing.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {listing.images.map((img: any) => (
                    <img key={img.id} src={img.image} alt="Listing" className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="px-8"
              isLoading={loading}
            >
              Save Changes
            </Button>
          </div>
          {error && <div className="text-danger text-sm text-center mt-2">{error}</div>}
          {success && <div className="text-success text-sm text-center mt-2">Listing updated successfully!</div>}
        </Form>
      </Card>
    </div>
  );
} 