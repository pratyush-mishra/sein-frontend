"use client"
import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { title } from "@/components/primitives";
import { useRouter } from "next/navigation";

export default function AuthenticationPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // No API logic for now
    setTimeout(() => {
      setLoading(false);
      setError("This is a demo. No authentication logic implemented.");
    }, 1000);
  };

  const handleSignupRedirect = () => {
    router.push("/signup");
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className={title()}>Sign In</h1>
      <Card className="w-full max-w-md mt-8 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="text-danger text-sm">{error}</div>}
          <Button type="submit" color="primary" isLoading={loading}>
            Sign In
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-default-600">Don't have an account?</span>
          <Button
            variant="light"
            color="primary"
            className="ml-2"
            onClick={handleSignupRedirect}
          >
            Sign Up
          </Button>
        </div>
      </Card>
    </div>
  );
} 