"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";

import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email === "test@spndo.com" && formData.password === "123456") {
      alert("Login successful!");
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen  md:flex-col justify-center ">
      <div className="flex overflow-hidden">
        <div className="md:px-24 md:w-5/12 flex flex-col justify-center relative">
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
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-neutral-white text-neutral-dark1">
              Welcome Back
            </h2>
            <p className="dark:text-neutral-grey3 text-sm">
              Please login to your account
            </p>
          </div>
          {/* Social Media Login */}
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="social"
              aria-label="Login with Google"
            >
              <Image src="/assets/google-icon.svg" alt="Google Icon" width={26}
                height={26} />
            </Button>
            <Button
              type="button"
              variant="social"
              aria-label="Login with Apple"
            >
              <Image
                src="/assets/apple-icon-light.svg"
                alt="Apple Icon"
                className="w-7 h-7 dark:hidden"
                width={28}
                height={28}
              />
              <Image
                src="/assets/apple-icon-dark.svg"
                alt="Apple Icon"
                className="w-7 h-7 hidden dark:block"
                width={28}
                height={28}
              />
            </Button>
            <Button
              type="button"
              variant="social"
              aria-label="Login with Facebook"
            >
              <Image
                src="/assets/facebook-icon.svg"
                alt="Facebook Icon"
                className="w-7 h-7"
                width={28}
                height={28}
              />
            </Button>
            <Button
              type="button"
              variant="social"
              aria-label="Login with Twitter"
            >
              <Image
                src="/assets/x-icon-light.svg"
                alt="Twitter Icon"
                className="w-7 h-7 dark:hidden"
                width={28}
                height={28}
              />
              <Image
                src="/assets/x-icon-dark.svg"
                alt="Twitter Icon"
                className="w-7 h-7 hidden dark:block"
                width={28}
                height={28}
              />
            </Button>
          </div>
          {/* Divider */}
          <div className="flex items-center my-6 ">
            <div className="flex-grow h-px bg-neutral-softGrey1"></div>
            <span className="mx-4 text-sm text-neutral-grey2 dark:text-dark-muted">
              OR
            </span>
            <div className="flex-grow h-px bg-neutral-softGrey1"></div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 "
          >
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
            <Button type="submit" fullWidth className="mt-4">
              Login
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-neutral-dark2dark:text-dark-muted">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-neutral-dark2 dark:text-primary-brand underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Image container - added centering and padding */}
        <div className="hidden md:block w-7/12 h-screen relative ">
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
