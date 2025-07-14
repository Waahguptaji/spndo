"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log({ username, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <img src="/logo.svg" alt="Monex Logo" className="w-12 h-12" />
        <h1 className="text-2xl font-heading font-bold mt-2 text-gray-900">
          monex
        </h1>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <FormInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<Mail size={18} />}
          placeholder="Username"
        />

        <FormInput
          label="Password"
          variant="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          placeholder="Password"
        />

        <Button type="submit" className="w-full mt-4">
          Login
        </Button>
      </form>

      {/* Forgot Password */}
      <p className="text-sm font-medium text-gray-500 mt-4 uppercase">
        Forgot Password
      </p>

      {/* OR Divider */}
      <div className="my-6 flex items-center w-full max-w-sm">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-4 text-gray-400">Or</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      {/* Social Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          CONTINUE WITH GOOGLE
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
        >
          <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5" />
          CONTINUE WITH APPLE
        </button>
      </div>

      {/* Register */}
      <p className="text-sm text-gray-600 mt-6">
        Don’t have an account?{" "}
        <Link href="/register" className="text-blue-600 font-medium underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
