"use client";
import { useState } from "react";
import { Form, Input, Select, SelectItem, Checkbox, Button, form, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/react";
import { Card } from "@heroui/card";
import { Textarea } from "@heroui/input"
import { title } from "@/components/primitives";
import TermsAndConditions from "@/components/terms-and-conditions";
export default function SignupPage() {
  const [password, setPassword] = useState("");
  const [re_password, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Real-time password validation
  const getPasswordError = (value: string) => {
    if (value.length < 4) {
      return "Password must be 4 characters or more";
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      return "Password needs at least 1 uppercase letter";
    }
    if ((value.match(/[^a-zA-Z0-9]/g) || []).length < 1) {
      return "Password needs at least 1 symbol";
    }
    return null;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSubmitted(null);
    const formData = new FormData(e.currentTarget);
    if (profilePicture) {
      formData.set("profile_picture", profilePicture);
    }
    formData.set("bio", bio);
    formData.set("contact_details", contactDetails);

    // Custom validation checks
    const newErrors: any = {};
    // Password validation
    const passwordError = getPasswordError(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    // Confirm password validation
    if (password !== re_password) {
      newErrors.re_password = "Passwords do not match";
    }
    // Username validation
    if (formData.get("username") === "admin") {
      newErrors.username = "Nice try! Choose a different name";
    }
    if (!formData.get("email")) {
      newErrors.email = "Please enter your email";
    }
    if (!formData.get("username")) {
      newErrors.username = "Please enter your username";
    }
    if (!formData.get("password")) {
      newErrors.password = "Please enter your password";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    // clear errors and submit
    setErrors({});
    setSubmitted(Object.fromEntries(formData.entries()));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        try {
          const data = await res.json();
          // Map known backend errors to the 'errors' state.
          // For unknown errors, use a generic message.
          const newErrors = { ...data, general: data.detail || "An unknown error occurred." };
          setErrors(newErrors);
        } catch (jsonError) {
          // The response was not valid JSON.
          setErrors({ general: "Signup failed. Please try again later." });
        }
        setLoading(false);
        return;
      }
      setSubmitted({ success: true });
      onOpen(); // Open the modal on success
    } catch (err: any) {
      setErrors({ general: err.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className={title()}>Sign Up</h1>
      <Card className="w-full max-w-md mt-8 p-6">
        <Form onSubmit={onSubmit} className="flex flex-col gap-4" encType="multipart/form-data" validationErrors={errors} onReset={() => setSubmitted(null)}>
          <Input
            isRequired
            label="Organisation Name"
            labelPlacement="outside"
            name="username"
            placeholder="Enter the name of your organisation"
            errorMessage={errors.username}
          />
          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
            errorMessage={errors.email}
          />
          <Input
            isRequired
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter a strong password"
            type="password"
            value={password}
            onValueChange={setPassword}
            errorMessage={getPasswordError(password) || errors.password}
            isInvalid={!!getPasswordError(password) || !!errors.password}
          />
          <Input
            isRequired
            label="Confirm Password"
            labelPlacement="outside"
            name="re_password"
            placeholder="Please re-enter your password"
            type="password"
            value={re_password}
            onValueChange={setRePassword}
            errorMessage={getPasswordError(password) || errors.re_password}
            isInvalid={!!errors.re_password}
          />

          <Textarea
            label="Bio"
            name="bio"
            labelPlacement="outside"
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxRows={4}
            placeholder="Tell us about yourself or your org."
          />

          <Textarea
            label="Contact Details"
            name="contact_details"
            labelPlacement="outside"
            value={contactDetails}
            onChange={e => setContactDetails(e.target.value)}
            maxRows={4}
            placeholder="Enter your primary contact details"
          />
          <label className="text-sm font-medium" htmlFor="profile_picture">Profile Picture</label>
          <input
            id="profile_picture"
            name="profile_picture"
            type="file"
            accept="image/*"
            className="rounded-lg border border-default-200 p-2 text-default-700 focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={e => setProfilePicture(e.target.files ? e.target.files[0] : null)}
          />
          <TermsAndConditions />
          <Checkbox> I accept the terms and conditions of using this platform</Checkbox> 
          <Button type="submit" color="primary" isLoading={loading} >
            Sign Up
          </Button>
        </Form>
        {submitted && submitted.success && (
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
            <ModalContent>
              <ModalHeader>Signup Request Created</ModalHeader>
              <ModalBody>
                Thanks for signing up. Please wait while we review your details. You will get an email once your account is approved.
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onOpenChange}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Card>
    </div>
  );
} 