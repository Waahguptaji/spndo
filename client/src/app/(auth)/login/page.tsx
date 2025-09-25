"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();

  // 🚨 Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard"); // replace avoids back/forward issue
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false, // Prevents NextAuth auto-redirect
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result?.error) {
      alert("Invalid credentials. Please try again.");
    } else {
      // ✅ Login success → fetch user by email
      const res = await fetch("/api/user?email=" + formData.email);
      const user = await res.json();

      if (user.success) {
    localStorage.setItem("userId", user.data.id); // ✅ save userId
    console.log("Logged in user:", user);
  }
  console.log("Logged in user:", user);

      // localStorage.setItem("userId", user.id); // ✅ save userId
      router.push("/dashboard");
    }
  };

  // Show loader while NextAuth checks session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Only render login form if user is not authenticated
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="flex min-h-screen md:flex-col justify-center">
      <div className="flex overflow-hidden">
        {/* Left side - form */}
        <div className="md:px-24 md:w-5/12 flex flex-col justify-center relative ">
          {/* Logo */}
          <div className="flex justify-center relative">
            <div className="bg-primary-brand w-14 h-14 rounded-full flex items-center justify-center shadow-md">
              <Image
                src="/assets/bag-icon.svg"
                alt="Bag"
                width={26}
                height={26}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-neutral-white text-neutral-dark1">
              Welcome Back
            </h2>
            <p className="dark:text-neutral-grey3 text-sm">
              Please login to your account
            </p>
          </div>

          {/* Social logins */}
          <div className="flex justify-center gap-1 md:gap-4 flex-wrap px-3 md:px-0">
            <Button type="button" variant="social" aria-label="Login with Google">
              <Image
                src="/assets/google-icon.svg"
                alt="Google Icon"
                width={24}
                height={24}
              />
            </Button>
            <Button type="button" variant="social" aria-label="Login with Apple">
              <Image
                src="/assets/apple-icon-light.svg"
                alt="Apple Icon"
                className="dark:hidden"
                width={24}
                height={24}
              />
              <Image
                src="/assets/apple-icon-dark.svg"
                alt="Apple Icon"
                className="hidden dark:block"
                width={24}
                height={24}
              />
            </Button>
            <Button type="button" variant="social" aria-label="Login with Facebook">
              <Image
                src="/assets/facebook-icon.svg"
                alt="Facebook Icon"
             
                width={24}
                height={24}
              />
            </Button>
            <Button type="button" variant="social" aria-label="Login with Twitter">
              <Image
                src="/assets/x-icon-light.svg"
                alt="Twitter Icon"
                className="dark:hidden"
                width={28}
                height={28}
              />
              <Image
                src="/assets/x-icon-dark.svg"
                alt="Twitter Icon"
                className="hidden dark:block"
                width={28}
                height={28}
              />
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6 mx-4 md:mx-0">
            <div className="flex-grow h-px bg-neutral-softGrey1"></div>
            <span className="mx-4 text-sm text-neutral-grey2 dark:text-dark-muted">
              OR
            </span>
            <div className="flex-grow h-px bg-neutral-softGrey1"></div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 md:px-0">
            <FormInput
              id="email"
              type="email"
              label="Email"
              icon={<MdOutlineEmail />}
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
              icon={<TbLockPassword />}
            />
            <Button
              type="submit"
              fullWidth
              className="mt-4"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-neutral-dark2 dark:text-dark-muted">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-neutral-dark2 dark:text-primary-brand underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Right side - image */}
        <div className="hidden md:block w-7/12 h-screen relative">
          <Image
            src="/assets/tree.png"
            alt="Login illustration"
            className="object-cover p-3 rounded-3xl"
            fill
          />
        </div>
      </div>
    </div>
  );
}
