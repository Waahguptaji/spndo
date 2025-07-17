// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoBag } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaApple } from "react-icons/fa";
import loginImage from "../../../public/assets/tree.png";
import appleIcon from "../../../public/assets/apple-icon-light.svg"; 
import facebookIcon from "../../../public/assets/facebook-icon.svg"; 
import twitterIcon from "../../../public/assets/x-icon-light.svg"; 
import googleIcon from "../../../public/assets/google-icon.svg"; 
import xicondark from "../../../public/assets/x-icon-dark.svg"; 
import appleIcondark from "../../../public/assets/apple-icon-dark.svg"; 
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
    <div className="flex items-center justify-center">

      <div className="flex w-screen h-screen justify-center">

   
        <div className="p-8 md:w-5/12 flex flex-col justify-center"> 
          <div className="flex justify-center relative">
            <div className="bg-primary-brand rounded-full p-2"><IoBag className="text-secondary-darkBrand" /></div>
          </div>
          <h2 className="text-xl font-heading dark:text-primary-light text-primary-dark mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-sm text-neutral-grey3 dark:text-dark-muted mb-6 text-center">
            Please login to your account
          </p>

          {/* Social Media Login */}
          <div className="flex justify-center gap-4">
            <Button type="button" variant="social" aria-label="Login with Google" >
              <Image src={googleIcon} alt="Google Icon" className="w-7 h-7" />
            </Button>
            <Button type="button" variant="social" aria-label="Login with Apple">
              <Image src={appleIcon} alt="Apple Icon" className="w-7 h-7 dark:hidden" />
              <Image src={appleIcondark} alt="Apple Icon" className="w-7 h-7 hidden dark:block" />
            </Button>
            <Button type="button" variant="social" aria-label="Login with Facebook">
              <Image src={facebookIcon} alt="Facebook Icon" className="w-7 h-7" />
            </Button>
            <Button type="button" variant="social" aria-label="Login with Twitter">
              <Image src={twitterIcon} alt="Twitter Icon" className="w-7 h-7 dark:hidden" />
              <Image src={xicondark} alt="Twitter Icon" className="w-7 h-7 hidden dark:block" />
            </Button>
          </div>
          {/* Divider */}
          <div className="flex items-center my-6 md:mx-10">
            <div className="flex-grow h-px bg-neutral-softGrey1"></div>
            <span className="mx-4 text-sm text-neutral-grey2 dark:text-dark-muted">
              OR
            </span>
            <div className="flex-grow h-px bg-neutral-softGrey1"></div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:mx-10">
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
            <Button type="submit" fullWidth>
              Login
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-neutral-grey3 dark:text-dark-muted">
            Don’t have an account?{' '}
            <Link
              href="/register"
              className="text-primary-brand hover:underline dark:text-primary-brand"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Image container - added centering and padding */}
        <div className="hidden md:flex items-center justify-center bg-primary-light dark:bg-primary-dark w-7/12">
          <Image
            src={loginImage}
            alt="Login illustration"
            // Use object-contain to fit the image within the container
            className=" w-full h-full border-none md:p-1"
          />
        </div>
      </div>
    </div>
  );
}
