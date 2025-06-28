// src/app/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔐 Placeholder login logic
    if (formData.email === "test@spndo.com" && formData.password === "123456") {
      alert("Login successful!");
      router.push("/dashboard"); // replace with actual route later
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-softGrey3 dark:bg-dark-bg px-4">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-neutral-white dark:bg-neutral-dark2">
        <h2 className="text-2xl font-heading text-primary-brand dark:text-dark-text mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-neutral-grey1 dark:text-dark-muted mb-6">
          Please login to your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <FormInput
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
<Button type="submit" className="mt-2">Login</Button>

        </form>

        <p className="mt-4 text-sm text-center text-neutral-grey2 dark:text-dark-muted">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-primary-brand hover:underline dark:text-primary-brand"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
