"use client";
import { useState, useEffect } from "react";
import { title } from "@/components/primitives" 
import { Card } from "@heroui/card";
import { Textarea } from "@heroui/input"
import { Input } from "@heroui/input";
import { Form, Radio, RadioGroup, NumberInput, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Select, SelectItem, Skeleton } from "@heroui/react";
import  ImageUpload from "@/components/image-upload";
import { useRouter } from "next/navigation";

export default function ListingPage() {
    const [isFee, setIsFee] = useState("no");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const availability = [
        {key:"pickup", label:"Pick Up"},
        {key:"dropoff", label:"Drop Off"},
        {key:"onsite", label:"Only used on site"}
    ];
    const categories = [
        { key: "office_material", label: "Office Material" },
        { key: "gardening_supplies", label: "Gardening Supplies" },
        { key: "physical_space", label: "Physical Space" },
        { key: "tools", label: "Tools" },
        { key: "other", label: "Other" },
    ];
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
            router.replace("/authentication");
        }
        // Simulate loading for skeleton
        const timeout = setTimeout(() => setIsPageLoading(false), 600);
        return () => clearTimeout(timeout);
    }, [router]);
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
            selectedImages.forEach((file, idx) => {
                formData.append("image", file); // Django expects 'image' field for each image
            });
            // Convert availability to a comma-separated string if needed
            if (formData.getAll("availability").length > 1) {
                const avail = formData.getAll("availability").join(",");
                formData.set("availability", avail);
            }
            // Set fee boolean and value
            formData.set("is_fee", isFee === "yes" ? "true" : "false");
            // Send to backend (adjust URL as needed)
            const res = await fetch("http://localhost:8000/api/listings/", {
                method: "POST",
                headers: {
                    Authorization: `Token ${localStorage.getItem("authToken")}`,
                },
                body: formData,
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to create listing");
            }
            setSuccess(true);
            form.reset();
            setSelectedImages([]);
        } catch (err: any) {
            setError(err.message || "Failed to create listing");
        } finally {
            setLoading(false);
        }
    };
  if (isPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className={title()}><Skeleton className="h-10 w-64 rounded mb-4" /></h1>
        <Card className="w-full max-w-4xl mt-8 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-1/2 mb-2 rounded" />
              <Skeleton className="h-40 w-full rounded" />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Skeleton className="h-12 w-40 rounded" />
          </div>
        </Card>
      </div>
    );
  }
  return (
     <div className="flex flex-col items-center justify-center py-10">
            <h1 className={title()}>Add new Resource</h1>
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
                            />
                            <Textarea
                                isRequired
                                label="Description"
                                name="description"
                                labelPlacement="outside"
                                maxRows={4}
                                placeholder="Give additional information about the resource"
                            />
                            <NumberInput
                                isRequired
                                label="Quantity"
                                labelPlacement="outside"
                                name="qty"
                                placeholder="Enter the quantity of item(s)"
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
                            />

                            <Textarea
                                label="Measurement"
                                name="dimensions"
                                labelPlacement="outside"
                                maxRows={2}
                                placeholder="Give measurements/dimensions or capacity of the item"
                            />

                            <Select
                                label="Availability (you can choose multiple)"
                                labelPlacement="outside"
                                name="availability"
                                placeholder="Select availability"
                                selectionMode="multiple"
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
                            />

                            <Select
                                label="Category (you can choose multiple)"
                                labelPlacement="outside"
                                name="category"
                                placeholder="Select category"
                                selectionMode="multiple"
                                isRequired
                            >
                                {categories.map((cat) => (
                                    <SelectItem key={cat.key}>{cat.label}</SelectItem>
                                ))}
                            </Select>
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
                            Add Resource
                        </Button>
                    </div>
                    {error && <div className="text-danger text-sm text-center mt-2">{error}</div>}
                    {success && <div className="text-success text-sm text-center mt-2">Resource created successfully!</div>}
                </Form>
            </Card>
        </div>
  
  );
}