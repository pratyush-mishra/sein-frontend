"use client";
import { useState, useEffect } from "react";
import { title } from "@/components/primitives" 
import { Card } from "@heroui/card";
import { Textarea } from "@heroui/input"
import { Input } from "@heroui/input";
import { Form, Radio, RadioGroup, NumberInput, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Select, SelectItem, Skeleton, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/react";
import  ImageUpload from "@/components/image-upload";
import {useAuth} from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ListingPage() {
    const [isFee, setIsFee] = useState("no");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const availability = [
        {key:"pickup", label:"Available for Pick Up"},
        {key:"dropoff", label:"Available for Drop Off"},
        {key:"onsite", label:"Available to be used only on site"}
    ];
    const categories = [
        { key: "office_material", label: "Office Equipment" },
        { key: "outdoors", label: "Outdoors" },
        { key: "physical_space", label: "Physical Space" },
        { key: "filming_equipment", label: "Filming Equipment" },
        { key: "kids", label: "Kids" },
        { key: "sports_and_games", label: "Sports and Games" },
        { key: "kitchen_cooking", label: "Kitchen / Cooking" },
        { key: "art_equipment", label: "Art Equipment" },
        { key: "other", label: "Other" },
    ];
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isLoading: isAuthLoading, isAuthenticated } = useAuth({ required: true });
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
                formData.append("images", file); // Django expects 'images' field for each image
            });
            // Convert availability to a comma-separated string if needed
            if (formData.getAll("availability").length > 1) {
                const avail = formData.getAll("availability").join(",");
                formData.set("availability", avail);
            }
            // Set fee boolean and value
            formData.set("is_fee", isFee === "yes" ? "true" : "false");
            // Send to backend (adjust URL as needed)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: formData,
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to create listing");
            }
            setSuccess(true);
            onOpen(); // Open the modal on success
            form.reset();
            setSelectedImages([]);
        } catch (err: any) {
            setError(err.message || "Failed to create listing");
        } finally {
            setLoading(false);
        }
    };
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <h1 className={title()}><Skeleton className="h-10 w-64 rounded mb-4" /></h1>
        {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded" />)}
        <Skeleton className="h-6 w-1/2 mb-2 rounded" />
        <Skeleton className="h-40 w-full rounded" />
        <Skeleton className="h-12 w-40 rounded mt-8" />
      </div>
    );
  }
  return isAuthenticated && (
     <div className="flex flex-col items-center justify-center py-10">
            <h1 className={title()}>Share a new Resource</h1>
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
                                size="lg"
                            />
                            <Textarea
                                isRequired
                                label="Description"
                                name="description"
                                labelPlacement="outside"
                                maxRows={4}
                                placeholder="Give additional information about the resource"
                                size="lg"
                            />
                            <NumberInput
                                isRequired
                                hideStepper
                                label="Quantity"
                                labelPlacement="outside"
                                name="qty"
                                defaultValue={1}
                                placeholder="Enter the quantity of item(s)"
                                minValue={1}
                                size="lg"
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
                                size="lg"
                            />

                            <Textarea
                                label="Measurement"
                                name="dimensions"
                                labelPlacement="outside"
                                maxRows={2}
                                placeholder="Give measurements/dimensions or capacity of the item"
                                size="lg"
                            />

                            <Select
                                label="Availability (you can choose multiple)"
                                labelPlacement="outside"
                                name="availability"
                                placeholder="Select availability"
                                selectionMode="multiple"
                                size="lg"
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
                                placeholder="Describe the condition of item."
                                size="lg"
                            />

                            <Select
                                label="Category (you can choose multiple)"
                                labelPlacement="outside"
                                name="category"
                                placeholder="Select category"
                                selectionMode="multiple"
                                isRequired
                                size="lg"
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
                                size="lg"
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
                    {/* Success Modal */}
                    {success && (
                      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                        <ModalContent>
                          <ModalHeader>Submission Received</ModalHeader>
                          <ModalBody>
                            Thank you for sharing your resource. We will now review it to make sure it meets our community guidelines. You&apos;ll get a once it gets approved and visible to other members!
                          </ModalBody>
                          <ModalFooter>
                            <Button color="primary" onPress={onOpenChange}>
                              Close
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    )}
                </Form>
            </Card>
        </div>
  );
}