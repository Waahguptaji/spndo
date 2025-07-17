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
    <div
      className="min-h-screen flex flex-col md:flex-row relative overflow-hidden"
      style={{ backgroundColor: "#242d2d" }}
    >
      {/* spotlight layers */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(140,152,110,0.3) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: "rgba(140,152,110,0.4)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: "rgba(140,152,110,0.3)" }}
      />

      {/* left: form */}
      <div className="relative z-10 w-full md:w-5/12 flex flex-col items-center  min-h-screen justify-center px-6 space-y-8">
        {/* logo */}
        <div>
          <div className="bg-primary-brand w-14 h-14 rounded-full flex items-center justify-center shadow-md">
            <Image
              src="/assets/bag-icon.svg"
              alt="Google"
              width={26}
              height={26}
            />
          </div>
        </div>

        {/* title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Create an account
          </h1>
          <p className="text-neutral-grey3 text-sm">
            Sign up now and unlock exclusive access!
          </p>
        </div>

        {/* social buttons */}
        <div className="flex justify-center gap-4">
          <button className="w-20 h-12 bg-neutral-grey1 rounded-xl shadow-sm flex items-center justify-center hover:bg-neutral-grey2 transition">
            <Image
              src="/assets/google-icon.svg"
              alt="Google"
              width={26}
              height={26}
            />
          </button>
          <button className="w-20 h-12 bg-neutral-grey1 rounded-xl shadow-sm flex items-center justify-center hover:bg-neutral-grey2 transition">
            <Image
              src="/assets/facebook-icon.svg"
              alt="Facebook"
              width={26}
              height={26}
            />
          </button>
          <button className="w-20 h-12 bg-neutral-grey1 rounded-xl shadow-sm flex items-center justify-center hover:bg-neutral-grey2 transition">
            <Image
              src="/assets/apple-icon.svg"
              alt="Apple"
              width={26}
              height={26}
            />
          </button>
          <button className="w-20 h-12 bg-neutral-grey1 rounded-xl shadow-sm flex items-center justify-center hover:bg-neutral-grey2 transition">
            <Image
              src="/assets/x-icon.svg"
              alt="Apple"
              width={26}
              height={26}
            />
          </button>
        </div>

        {/* divider */}
        <div className="flex items-center w-full max-w-sm">
          <hr className="flex-grow border-neutral-grey1" />
          <span className="px-3 text-xs text-neutral-grey3">OR</span>
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
            <label htmlFor="terms" className="ml-2 text-white">
              I agree to the{" "}
              <a href="#" className="text-primary-brand underline">
                terms of service
              </a>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="h-12 mt-4 mb-2 text-lg font-semibold rounded-lg"
          >
            Sign up
          </Button>
        </form>

        {/* footer link */}
        <p className="text-sm text-center text-neutral-grey3">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-brand underline">
            Login
          </Link>
        </p>
      </div>

      {/* right: image */}
      <div className="hidden md:block md:w-7/12 h-screen relative">
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
