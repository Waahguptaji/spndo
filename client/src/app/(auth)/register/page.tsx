"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    // The corrected code
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full justify-center">
      {/* left: form */}
      <div className="relative z-10 w-full md:w-5/12 flex flex-col items-center  h-full px-6 justify-center space-y-4">
        {/* logo */}
        <div>
          <div className="bg-primary-brand w-14 h-14 rounded-full flex items-center justify-center shadow-md">
            <Image
              src="/assets/bag-icon.svg"
              alt="Bag"
              width={26}
              height={26}
            />
          </div>
        </div>

        {/* title */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold dark:text-neutral-white text-neutral-dark1">
            Create an account
          </h1>
          <p className="dark:text-neutral-grey3 text-sm">
            Sign up now and unlock exclusive access!
          </p>
        </div>

        {/* social buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="w-20 h-12 dark:bg-neutral-grey1 bg-neutral-white rounded-xl shadow-sm flex items-center justify-center hover:bg-neutral-grey2 transition">
            <Image
              src="/assets/google-icon.svg"
              alt="Google"
              width={26}
              height={26}
            />
          </button>
          <button className="w-20 h-12 dark:bg-neutral-grey1 bg-neutral-white rounded-xl shadow-sm flex items-center justify-center hover:bg-neutral-grey2 transition">
            <Image
              src="/assets/facebook-icon.svg"
              alt="Facebook"
              width={26}
              height={26}
            />
          </button>
          <button className="w-20 h-12 dark:bg-neutral-grey1 bg-neutral-white rounded-xl shadow-sm flex items-center justify-center hover:bg-neutral-grey2 transition">
            <Image
              src="/assets/apple-icon-light.svg"
              alt="Apple"
              width={26}
              height={26}
              className="block dark:hidden"
            />
            <Image
              src="/assets/apple-icon-dark.svg"
              alt="Apple"
              width={26}
              height={26}
              className="hidden dark:block"
            />
          </button>
          <button className="w-20 h-12 dark:bg-neutral-grey1 bg-neutral-white rounded-xl shadow-sm flex items-center justify-center hover:bg-neutral-grey2 transition">
            <Image
              src="/assets/x-icon-light.svg"
              alt="Apple"
              width={26}
              height={26}
              className="block dark:hidden"
            />
            <Image
              src="/assets/x-icon-dark.svg"
              alt="Apple"
              width={26}
              height={26}
              className="hidden dark:block"
            />
          </button>
        </div>

        {/* divider */}
        <div className="flex items-center w-full max-w-sm">
          <hr className="flex-grow border-neutral-grey1" />
          <span className="px-3 text-xs dark:text-neutral-white text-neutral-grey3">
            OR
          </span>
          <hr className="flex-grow border-neutral-grey1" />
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <FormInput
            label="Email"
            type="email"
            placeholder="helloexample@gmail.com"
            required
            icon={<Mail className="w-5 h-5 text-neutral-grey3" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            label="Password"
            variant="password"
            placeholder="••••••••••••"
            required
            icon={<Lock className="w-5 h-5 text-neutral-grey3" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center text-sm">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-primary-brand rounded border-neutral-grey1 focus:ring-primary-brand"
            />
            <label
              htmlFor="terms"
              className="ml-2 text-neutral-dark2 dark:text-neutral-white"
            >
              I agree to the {" "}
              <a
                href="#"
                className="text-neutral-dark1 dark:text-primary-brand underline"
              >
                terms of service
              </a>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="w-full max-w-sm h-12 text-lg font-semibold rounded-lg"
          >
            Sign up
          </Button>
        </form>

        {/* footer link */}
        <p className="text-sm text-center text-neutral-dark2 dark:text-neutral-grey3">
          Already have an account? {" "}
          <Link
            href="/login"
            className="text-neutral-dark2 dark:text-primary-brand underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* right: image */}
      <div className="hidden md:block md:w-7/12 h-full relative">
        <Image
          src="/assets/tree.png"
          alt="Serene tree"
          fill
          className="object-cover rounded-3xl p-3"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
