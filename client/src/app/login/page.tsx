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
import loginImage from "../../../public/loginimage.png"; // Adjust the path as necessary
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
    <div className="min-h-screen flex items-center justify-center  md:px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 grid-cols-1   rounded-lg  overflow-hidden ">
        {/* Left Image/Illustration Section */}
        

        {/* Right Login Section */}
        
        <div className="p-8 row-span-4" >
          <div className="flex justify-center">
            <div className="bg-primary-green rounded-full p-2"><IoBag className="text-secondary-darkBrand" /></div>
          </div>
          <h2 className="text-2xl font-heading text-primary-light dark:text-dark-text mb-2 text-center">
            Welcome Back 
          </h2>
          <p className="text-sm text-neutral-grey1 dark:text-dark-muted mb-6 text-center">
            Please login to your account
          </p>
          

          {/* Social Media Login */}
          <div className="flex justify-center gap-4">
            <Button type="button" variant="social" aria-label="Login with Google">
              <FcGoogle size={20}  />
            </Button>
            <Button type="button" variant="social" aria-label="Login with Apple">
              <FaApple size={20} />
            </Button>
            <Button type="button" variant="social" aria-label="Login with Facebook">
              <FaFacebookF size={20} className="text-blue-600" />
            </Button>
            <Button type="button" variant="social" aria-label="Login with Twitter">
              <FaXTwitter size={20} />
            </Button>
          </div>
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-neutral-softGrey1"></div>
            <span className="mx-4 text-sm text-neutral-grey2 dark:text-dark-muted">
              OR
            </span>
            <div className="flex-grow h-px bg-neutral-softGrey1"></div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <Button type="submit" fullWidth >
              Login
            </Button>
          </form>

          

          <p className="mt-6 text-sm text-center text-neutral-grey2 dark:text-dark-muted">
            Don’t have an account?{' '}
            <Link
              href="/register"
              className="text-primary-brand hover:underline dark:text-primary-brand"
            >
              Register
            </Link>
          </p>
        </div>


        <div className="hidden md:flex  bg-primary-light dark:bg-primary-dark row-span-8 ">
          <Image
            src={loginImage}
            alt="Login illustration"
            className="h-fit w-fit"
          />
        </div>
      </div>
    </div>
  );
}
